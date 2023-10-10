import { IUser, UserModel } from "../models/user.model"
import { TEditProfile } from "../types/TUser"
import { ErrorHandler } from "../utils/error"
import { generateToken } from "../utils/generateJwtToken"
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
    return UserModel.findById(id, userGetMask).populate('publicator').then((user) => {
        if (user == null) throw new Error(`Il n'y a pas d'utilisateur avec l'id: ${id}`)
        return user.toObject()
    })
}

export const getOneUserByUsername = async (username: string): Promise<IUser> => {
    return UserModel.findOne({ username }, userGetMask).populate('publicator').then((user) => {
        if (user == null) throw new Error(`Il n'y a pas d'utilisateur avec le nom d'utilisateur: ${username}`)
        return user.toObject()
    })
}

export const editProfileImage = async (id: string, imageData: string) => {
    UserModel.findByIdAndUpdate(id, { image: imageData }).catch((error: Error) => { throw new ErrorHandler(`Une erreur de connexion à la base de données s'est produite.`, error) })
}
export const editPassword = async (id: string, password: string) => {
    UserModel.findByIdAndUpdate(id, { image: sha(password) }).catch((error: Error) => { throw new ErrorHandler(`Une erreur de connexion à la base de données s'est produite.`, error) })
}

export const editProfile = async (updateValue: TEditProfile, privateInfo: any): Promise<String> => {
    return UserModel.findById(updateValue._id).then((user) => {
        if (user) {
            user.email = updateValue.email
            user.lastname = updateValue.lastname
            user.username = updateValue.username
            user.firstname = updateValue.firstname
            user.address.value = updateValue.address
            user.walletId.value = updateValue.walletId
            user.coordonates.isPrivate = privateInfo.coordonates
            user.address.isPrivate === false ? user.address.isPrivate = false : user.address.isPrivate = privateInfo.address
            user.country.isPrivate === false ? user.country.isPrivate = false : user.country.isPrivate = privateInfo.country
            user.walletId.isPrivate === false ? user.walletId.isPrivate = false : user.walletId.isPrivate = privateInfo.walletId
            user.concat = updateValue.username + " " + updateValue.firstname + " " + updateValue.lastname + " " + updateValue.email

            user.save().then(() => { return generateToken(updateValue._id, updateValue.username, updateValue.email, user.role) })
                .catch((error) => {
                    if (error.code === 11000 || error.code === 11001) throw new Error("Le nom d'utilisateur ou l'adresse email est déjà utilisé par un autre utilisateur")
                    else throw new ErrorHandler("Erreur de connexion à la base de donnée. Nous y travaillons!", error)
                })
        } else throw new Error("Le nom d'utilisateur ou l'adresse email est déjà utilisé par un autre utilisateur")
        return ''
    })
}