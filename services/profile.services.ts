import { IProfile, ProfileModel } from "../models/profile.model"
import { TSendEmail } from "../types/TAuthentication"
import { ILocalisation } from "../types/profile"
import { ErrorHandler } from "../utils/error"
import { generateToken } from "../utils/generateJwtToken"
import { decodeAuthorization } from "../utils/jwtDecode"
import { sendMail } from "../utils/nodemailer"
import { sha } from "../utils/sha256"

const profileGetMask = {
    password: 0,
    newNotificationCount: 0,
    confirmation: 0,
    notifications: 0,
    reaction: 0
}

export const getProfileById = async (id: string): Promise<IProfile> => {
    const profile = await ProfileModel.findById(id, profileGetMask)
        .catch((error) => { throw new ErrorHandler(`Une erreur s'est produite lors de la recherche du profil par ID: ${id}`, 500, error) })
    if (!profile) throw new ErrorHandler(`Il n'y a pas de profil avec l'id: ${id}`, 404, new Error())
    return profile.toObject()
}

export const getProfileByName = async (name: string): Promise<IProfile> => {
    const profile = await ProfileModel.findOne({ name }, profileGetMask)
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
        if (profile.password == sha(password)) {
            profile.password = sha(newPassword)
            await profile.save()
        } else throw new ErrorHandler(`Le mot de passe ne correspond pas`, 403, new Error())
    } else throw new ErrorHandler(`Le profil n'existe pas`, 404, new Error())
    await ProfileModel.findByIdAndUpdate(id, { password: sha(password) }).catch((error: Error) => { throw new ErrorHandler(`Une erreur de connexion à la base de données s'est produite.`, 500, error) })
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
    return ProfileModel.findById(id, profileGetMask).then((profile) => {
        if (profile == null) throw new Error(`Il n'y a pas d'utilisateur avec l'id: ${id}`)
        return profile.toObject()
    })
}

export const getProfileWithCoordonates = async (): Promise<any> => {
    return await ProfileModel.find({ localisation: { coordonates: { isPublic: true } } }, profileGetMask)
        .catch((error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée`, 500, error) })
}

export const passwordRecovery = async (email: string, recoveryCode: string, password: string): Promise<String> => {
    const profile = await ProfileModel.findOne({ 'contact.email': email, profileType: 'user' })
    if (profile) {
        if (profile.confirmation.recoveryCode == recoveryCode) {
            profile.password = sha(password)
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

export const search = async (filter: String): Promise<any> => {
    return await ProfileModel.find({ name: { $regex: filter, $options: "i" } }, profileGetMask)
        .then((result) => { return result })
        .catch((error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée`, 500, error) })
}

