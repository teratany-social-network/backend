import { IUser, UserModel } from "../models/user.model"
import { TSendEmail } from "../types/TAuthentication"
import { TCoordonates, TEditProfile, TPrivateInfo } from "../types/TUser"
import { ErrorHandler } from "../utils/error"
import { generateToken } from "../utils/generateJwtToken"
import { decodeAuthorization } from "../utils/jwtDecode"
import { sendMail } from "../utils/nodemailer"
import { sha } from "../utils/sha256"

const userGetMask = {
    concat: 0,
    password: 0,
    authType: 0,
    recoveryCode: 0,
    sendRecoveryCount: 0,
    sendRecoveryLastTime: 0,
    notification: 0,
    notificationCount: 0,
    reaction: 0
}

export const getUserById = async (id: string): Promise<IUser> => {
    try {
        const user = await UserModel.findById(id, userGetMask).populate({
            path: 'publicator',
            // populate: {
            //     path: 'publications',
            //     populate: [{
            //         path: 'commentaires',
            //         populate: 'user'
            //     },
            //     {
            //         path: 'reactions',
            //         populate: 'user'
            //     }]
            // }
        })
        if (!user) throw new ErrorHandler(`Il n'y a pas d'utilisateur avec l'id: ${id}`, 404, new Error())
        return user.toObject()
    } catch (error) {
        console.log(error);
        throw new ErrorHandler(`Une erreur s'est produite lors de la recherche de l'utilisateur par ID: ${id}`, 500, error)
    }
}

export const getUserByName = async (displayName: string): Promise<IUser> => {
    return UserModel.findOne({ displayName }, userGetMask).populate('publicator').then((user) => {
        if (user == null) throw new ErrorHandler((`Il n'y a pas d'utilisateur nommé: ${displayName}`), 404, new Error('Utilisateur introuvable'))
        return user.toObject()
    })
}

export const getUserByEmail = async (email: string): Promise<IUser> => {
    return UserModel.findOne({ email }, userGetMask).populate('publicator').then((user) => {
        if (user == null) throw new ErrorHandler((`Il n'y a pas d'utilisateur avec l'adresse mail: ${email}`), 404, new Error('Utilisateur introuvable'))
        return user.toObject()
    })
}

export const editProfileImage = async (id: string, imageData: string) => {
    UserModel.findByIdAndUpdate(id, { image: imageData }).catch((error: Error) => { throw new ErrorHandler(`Une erreur de connexion à la base de données s'est produite.`, 500, error) })
}

export const editPassword = async (id: string, password: string, newPassword: string) => {
    const user = await UserModel.findById(id)
    if (user) {
        if (user.password == sha(password)) {
            user.password = sha(newPassword)
            await user.save()
        } else throw new ErrorHandler(`Le mot de passe ne correspond pas`, 403, new Error())
    } else throw new ErrorHandler(`L'utilisateur n'existe pas`, 404, new Error())
    await UserModel.findByIdAndUpdate(id, { password: sha(password) }).catch((error: Error) => { throw new ErrorHandler(`Une erreur de connexion à la base de données s'est produite.`, 500, error) })
}

export const editProfile = async (id: string, updateValue: TEditProfile): Promise<String> => {


    return await UserModel.findById(id).then(async (user) => {

        if (user) {
            user.displayName = updateValue.displayName
            user.email = updateValue.email
            user.address = updateValue.address
            user.country = updateValue.country
            user.walletId = updateValue.walletId

            user.concat = updateValue.displayName + " " + updateValue.email

            return await user.save().then(() => { return generateToken(updateValue._id, updateValue.displayName, updateValue.email, user.role) })
                .catch((error) => {
                    if (error.code === 11000 || error.code === 11001) throw new ErrorHandler("Le nom d'utilisateur ou l'adresse email est déjà utilisé par un autre utilisateur", 401, error)
                    else throw new ErrorHandler("Erreur de connexion à la base de donnée. Nous y travaillons!", 500, error)
                })
        }
        return ''
    })
}

export const editCoordonates = async (id: string, coordonates: TCoordonates) => {
    return await UserModel.findById(id).then(async (user) => {
        if (user) {
            user.coordonates = coordonates
            return await user.save().catch((error) => { throw new ErrorHandler("Erreur de connexion à la base de donnée. Nous y travaillons!", 500, error) })
        }
    })
}

export const getUserByToken = async (authorization: string): Promise<IUser> => {
    let id: String
    try {
        id = await decodeAuthorization(authorization).id
    } catch (error) { throw new ErrorHandler(`Vous devez envoyer un token JWT valide`, 403, error) }
    return UserModel.findById(id, userGetMask).populate('publicator').then((user) => {
        if (user == null) throw new Error(`Il n'y a pas d'utilisateur avec l'id: ${id}`)
        return user.toObject()
    })
}

export const getUserWithCoordonates = async (): Promise<any> => {
    return await UserModel.find({ coordonates: { isPrivate: false } }, userGetMask)
        .then((result) => { return result })
        .catch((error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée`, 500, error) })
}

export const passwordRecovery = async (email: string, recoveryCode: string, password: string): Promise<String> => {
    const user = await UserModel.findOne({ email })
    if (user) {
        if (user.recoveryCode == recoveryCode) {
            user.password = sha(password)
            await user.save()
            return generateToken(user.id, user.displayName, user.email, user.role)
        } else throw new ErrorHandler(`Le code dee confirmation ne correspond pas`, 403, new Error())
    } else throw new ErrorHandler(`L'utilisateur n'existe pas`, 404, new Error(`L'utilisateur n'existe pas`))
}

export const sendRecoveryCode = async (email: string): Promise<TSendEmail> => {
    let user = await UserModel.findOne({ email: email })
    if (user) {
        let recoveryCode = Math.floor(Math.random() * 1000)
        user.recoveryCode = recoveryCode
        await user.save().catch((error: Error) => { throw new ErrorHandler("Impossible de générer le code de confirmation", 500, error) })
        let text = "Votre code de confirmation est : " + recoveryCode
        await sendMail(email, "Email verification", text).catch((error: ErrorHandler) => { throw error })
        return { isSent: true }

    } throw new ErrorHandler(`Il n'y a pas d'utilisateur sous le mail ${email}`, 404, new Error(`Il n'y a pas d'utilisateur sous le mail ${email}`))
}

export const search = async (filter: String): Promise<any> => {
    return await UserModel.find({ concat: { $regex: filter, $options: "i" } }, userGetMask)
        .then((result) => { return result })
        .catch((error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée`, 500, error) })
}

