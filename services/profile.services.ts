import mongoose, { Types } from "mongoose"
import { IProfile, ProfileModel } from "../models/profile.model"
import { TSendEmail } from "../types/TAuthentication"
import { IContact, ICreateProfile, ILocalisation } from "../types/profile"
import { ErrorHandler } from "../utils/error"
import { generateToken } from "../utils/generateJwtToken"
import { decodeAuthorization } from "../utils/jwtDecode"
import { sendMail } from "../utils/nodemailer"
import { sha } from "../utils/sha256"
import { PublicationModel } from "../models/publication.model"

const profileGetMask = {
    password: 0,
    newNotificationCount: 0,
    confirmation: 0,
    notifications: 0,
    isFollowed: 0
}

export const getProfileById = async (id: string, ownId: string): Promise<IProfile[]> => {
    try {

        const profile = await ProfileModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) },
            },
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'administratedProfiles',
                    foreignField: '_id',
                    as: 'administratedProfiles',
                },
            },
            {
                $addFields: {
                    administratedProfiles: {
                        $map: {
                            input: '$administratedProfiles',
                            as: 'adminProfile',
                            in: {
                                id: '$$adminProfile._id',
                                name: '$$adminProfile.name',
                                image: '$$adminProfile.image',
                                numberOfFollowers: { $size: '$$adminProfile.followers' },
                            },
                        },
                    },
                    isFollowed: {
                        $in: [new Types.ObjectId(ownId), '$followers']
                    },

                },
            },

            {
                $project: {
                    password: 0,
                    newNotificationCount: 0,
                    confirmation: 0,
                    notifications: 0,
                    reaction: 0,
                    __v: 0
                },
            },
        ]);


        return profile[0];
    } catch (error) {
        throw new ErrorHandler(`${id} n'est pas un identifiant de profil valide`, 403, error);
    }
}

export const getProfileByName = async (name: string): Promise<IProfile> => {
    const profile = await ProfileModel.findOne({ name }, profileGetMask).populate('administratedProfiles admins')
        .catch((error) => { throw new ErrorHandler(`Une erreur s'est produite lors de la recherche du profil`, 500, error) })
    if (!profile) throw new ErrorHandler((`Il n'y a pas de profil nommé: ${name}`), 404, new Error('Profil introuvable'))
    return profile.toObject()
}

export const getProfileByEmail = async (email: string): Promise<IProfile> => {
    const profile = await ProfileModel.findOne({ 'contact.email': email }, profileGetMask)
        .catch((error) => { throw new ErrorHandler(`Une erreur s'est produite lors de la recherche du profil`, 500, error) })
    if (!profile) throw new ErrorHandler((`Il n'y a pas d'utilisateur avec l'adresse mail: ${email}`), 404, new Error('Utilisateur introuvable'))
    return profile.toObject()
}

export const editProfileImage = async (id: string, image: string) => {
    await ProfileModel.findByIdAndUpdate(id, { image }).catch((error: Error) => { throw new ErrorHandler(`Une erreur de connexion à la base de données s'est produite.`, 500, error) })
}

export const editPassword = async (id: string, password: string, newPassword: string) => {
    const profile = await ProfileModel.findById(id)
    if (profile) {
        if (profile.profileType == 'user') {
            if (profile.password == sha(password)) {
                profile.password = sha(newPassword)
                await profile.save()
            } else throw new ErrorHandler(`Le mot de passe ne correspond pas`, 403, new Error())
        } else throw new ErrorHandler(`Les ${profile.profileType} ne peuvent pas avoir de mot de passe`, 401, new Error())
    } else throw new ErrorHandler(`Le profil n'existe pas`, 404, new Error())
}

export const editProfileGeneral = async (id: string, name: string, description: string, email: string) => {
    return await ProfileModel.findById(id).then(async (profile) => {


        if (profile) {
            profile.name = name
            profile.description = description
            profile.contact.email = email
            return await profile.save()
                .catch((error) => {
                    if (error.code === 11000 || error.code === 11001) throw new ErrorHandler("Le nom   est déjà utilisé par un autre profil", 401, error)
                    else throw new ErrorHandler("Erreur de connexion à la base de donnée. Nous y travaillons!", 500, error)
                })
        }
    })
}

export const editLocalisation = async (id: string, localisation: ILocalisation) => {
    return await ProfileModel.findById(id).then(async (profile) => {
        if (profile) {
            profile.localisation = localisation
            return await profile.save().catch((error) => { throw new ErrorHandler("Erreur de connexion à la base de donnée. Nous y travaillons!", 500, error) })
        }
    })
}

export const getProfileByToken = async (authorization: string): Promise<IProfile> => {
    let id: String
    try {
        id = await decodeAuthorization(authorization).id
    } catch (error) { throw new ErrorHandler(`Vous devez envoyer un token JWT valide`, 403, error) }
    return ProfileModel.findById(id).then((profile) => {
        if (profile == null) throw new Error(`Il n'y a pas d'utilisateur avec l'id: ${id}`)
        return profile.toObject()
    })
}

export const getProfileWithCoordonates = async (): Promise<any> => {
    return await ProfileModel.find({ 'localisation.coordonates.isPublic': true }, profileGetMask)
        .catch((error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée`, 500, error) })
}

export const passwordRecovery = async (email: string, recoveryCode: string, password: string): Promise<String> => {
    const profile = await ProfileModel.findOne({ 'contact.email': email, profileType: 'user' })
    if (profile) {
        if (profile.confirmation.recoveryCode == recoveryCode) {
            profile.password = sha(password)
            profile.confirmation.recoveryCode = '0'
            await profile.save()
            return generateToken(profile.id, profile.name, email, profile.role)
        } else throw new ErrorHandler(`Le code dee confirmation ne correspond pas`, 403, new Error())
    } else throw new ErrorHandler(`L'utilisateur n'existe pas`, 404, new Error(`L'utilisateur n'existe pas`))
}

export const sendRecoveryCode = async (email: string): Promise<TSendEmail> => {
    let profile = await ProfileModel.findOne({ 'contact.email': email })
    if (profile) {
        let recoveryCode = Math.floor(Math.random() * 1000)
        profile.confirmation.recoveryCode = recoveryCode.toString()
        await profile.save().catch((error: Error) => { throw new ErrorHandler("Impossible de générer le code de confirmation", 500, error) })
        let text = "Votre code de confirmation est : " + recoveryCode
        await sendMail(email, "Email verification", text).catch((error: ErrorHandler) => { throw error })
        return { isSent: true }
    } else throw new ErrorHandler(`Il n'y a pas d'utilisateur sous le mail ${email}`, 404, new Error(`Il n'y a pas d'utilisateur sous le mail ${email}`))
}

export const search = async (filter: String, ownId: string, type: string): Promise<any> => {

    const profiles = await ProfileModel.aggregate([
        { $match: { name: { $regex: filter, $options: "i" }, profileType: { $regex: type, $options: "i" } } },
        {
            $addFields: {
                isFollowed: {
                    $in: [new Types.ObjectId(ownId), '$followers']
                },
                numberOfFollowers: { $size: '$followers' },
            }
        },
        {
            $project: {
                '_id': 1,
                'name': 1,
                'image': 1,
                'profileType': 1,
                'localisation.country': 1,
                'isFollowed': 1,
                'numberOfFollowers': 1,
            }
        }
    ]).catch((error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée`, 500, error) })

    const publications = await PublicationModel.aggregate([
        {
            $lookup: {
                from: 'profiles',
                localField: 'profile',
                foreignField: '_id',
                as: 'profile'
            }
        },
        {
            $unwind: '$profile'
        },
        {
            $match: {
                $or: [
                    { content: { $regex: filter, $options: "i" } },
                    { 'profile.name': { $regex: filter, $options: "i" } }
                ]
            }
        },
        {
            $addFields: {
                isReacted: {
                    $in: [new Types.ObjectId(ownId), '$reactions']
                },
                numberOfComments: { $size: '$comments' },
                numberOfReactions: { $size: '$reactions' },
            }
        },
        {
            $project: {
                '_id': 1,
                'images': 1,
                'date': 1,
                'content': 1,
                'isReacted': 1,
                'numberOfComments': 1,
                'numberOfReactions': 1,
                'profile._id': 1,
                'profile.name': 1,
                'profile.image': 1,
                'profile.profileType': 1
            }
        }
    ]).catch((error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée`, 500, error) })
    return { profiles, publications }
}

export const editContact = async (id: string, contact: IContact) => {
    const isEmailExist = await ProfileModel.findOne({ 'contact.email': contact.email })
    if (isEmailExist && isEmailExist.id != id) throw new ErrorHandler(`L'adresse email est déja utilisé par un autre profile`, 401, new Error())
    else {
        const profile = await ProfileModel.findById(id)
        if (profile) {
            if (profile.profileType != 'user') {
                profile.contact = contact
                await profile.save()
                    .catch((error) => {
                        if (error.code === 11000 || error.code === 11001) throw new ErrorHandler("Le mail est déjà utilisé par un autre profil", 401, error)
                        else throw new ErrorHandler("Erreur de connexion à la base de donnée. Nous y travaillons!", 500, error)
                    })
            } else throw new ErrorHandler(`Les profiles utilisateurs n'ont pas de contact`, 401, new Error())
        } else throw new ErrorHandler(`Le profil que vous voulez modifier n'existe pas`, 404, new Error())
    }
}

export const editCategories = async (id: string, categories: string) => {
    const profile = await ProfileModel.findById(id)
    if (profile) {
        if (profile.profileType != 'user') {
            profile.categories = categories
            await profile.save()
                .catch((error) => {
                    if (error.code === 11000 || error.code === 11001) throw new ErrorHandler("Le nom   est déjà utilisé par un autre profil", 401, error)
                    else throw new ErrorHandler("Erreur de connexion à la base de donnée. Nous y travaillons!", 500, error)
                })
        } else throw new ErrorHandler(`Les profiles utilisateurs n'ont pas de categories`, 401, new Error())
    } else throw new ErrorHandler(`Le profil que vous voulez modifier n'existe pas`, 404, new Error())
}

export const createProfile = async (ownerId: string, profile: ICreateProfile): Promise<IProfile> => {

    try {
        const isEmailExist = await ProfileModel.exists({ 'contact.email': profile.contact.email })
        if (isEmailExist) throw new ErrorHandler(`L'adresse email est déja utilisé par un autre profile`, 401, new Error())
        else {
            if (profile.name.length > 2) {
                if (profile.profileType == 'association' || profile.profileType == 'entreprise') {
                    const owner = await ProfileModel.findById(ownerId)
                    if (owner) {
                        profile.admins = [ownerId]
                        const newProfile = await new ProfileModel(profile).save().catch((error) => {

                            if (error.code == 11000) throw new ErrorHandler(`Le nom est déja utilisé par un autre profile`, 401, new Error())
                            throw new ErrorHandler(`Erreur du serveur, nous y travaillons`, 500, error)
                        })

                        owner.administratedProfiles.push(newProfile._id)
                        await owner.save().catch((error) => { throw new ErrorHandler(`Erreur du serveur, nous y travaillons`, 500, error) })

                        return newProfile
                    } else throw new ErrorHandler(`Il n'y a aucun compte sous l'identifiant ${ownerId}`, 401, new Error())

                } else throw new ErrorHandler(`Vous devez uniquement crée une association ou une entreprise et non ${profile.profileType}`, 403, new Error())
            } else throw new ErrorHandler('Vous devez fournir un nom de plus de 2 lettres', 403, new Error())
        }
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        else throw new ErrorHandler(`Erreur du serveur, nous y travaillons`, 500, error)
    }
}

export const toggleFollow = async (currentProfileId: string, toFollowId: string) => {
    const currentProfile = await ProfileModel.findById(currentProfileId)
    const toFollow = await ProfileModel.findById(toFollowId)
    if (currentProfile && toFollow) {
        let index = currentProfile.following.indexOf(toFollowId)
        if (index === -1) {
            currentProfile.following.push(toFollowId)
            toFollow.followers.push(currentProfileId)
        } else {
            currentProfile.following.splice(index, 1)
            index = toFollow.following.indexOf(currentProfileId)
            toFollow.followers.splice(index, 1)
        }
        await currentProfile.save()
        await toFollow.save()
    } else throw new ErrorHandler(`Vous essayez de suivre un profile qui n'existe pas`, 404, new Error)
}


export const getFollowingList = async (id: string) => {
    try {
        const profile = await ProfileModel.findById(id)
            .populate({
                path: 'following',
                select: 'name image profileType'
            })
        if (profile) return profile.following || []
        else throw new ErrorHandler('Cet utilisateur n\'existe pas', 404, new Error)
    } catch (error) {
        throw new ErrorHandler('Impossible d\'avoir la liste des profiles suivi', 500, error);
    }
};