import { sha } from "../utils/sha256"
import { Types } from "mongoose"
import { nameFormat } from "../utils/format"
import { ErrorHandler } from "../utils/error"
import { sendMail } from "../utils/nodemailer"
import { generateToken } from "../utils/generateJwtToken"
import { TSendEmail, TSignup } from "../types/TAuthentication"
import { PublicatorModel, PublicatorType } from "../models/publicator.model"
import { AuthTypes, UserAccountStatus, UserModel } from "../models/user.model"

export const checkUsername = async (username: string): Promise<Boolean> => {
    const user = await UserModel.exists({ username }).catch((error: Error) => { throw new ErrorHandler("Erreur de connexion à la base de donnée, nous y travaillons!", error) })
    if (user) return true
    return false
}
export const checkEmail = async (email: string): Promise<Boolean> => {
    const user = await UserModel.exists({ email }).catch((error: Error) => { throw new ErrorHandler("Erreur de connexion à la base de donnée, nous y travaillons!", error) })
    if (user) return true
    return false
}

export const sendEmail = async (email: string): Promise<TSendEmail> => {
    let user = await UserModel.findOne({ email: email })
    if (user) {
        if (user.status == UserAccountStatus.active) {
            let recoveryCode = Math.floor(Math.random() * 100000)
            user.recoveryCode = recoveryCode
            user.status = UserAccountStatus.pending
            await user.save().catch((error: Error) => { throw new ErrorHandler("Impossible de générer le code de confirmation", error) })
            let text = "Votre code de confirmation est : " + recoveryCode
            await sendMail(email, "Email verification", text).catch((error: ErrorHandler) => { throw error })
            return { isSent: true }
        }
        return { isSent: false, message: "Votre adresse email a déjâ été validé" }
    }
    throw new ErrorHandler(`Il n'y a pas d'utilisateur sous le mail ${email}`, new Error())
}

export const verifyEmail = async (email: string, code: string) => {
    await UserModel.findOne({ email: email }).then(async (user) => {
        if (user) {
            if (user.recoveryCode == code) {
                user.recoveryCode = 0
                user.status = UserAccountStatus.active
                await user.save().catch((error: Error) => { throw new ErrorHandler("Impossible de valider le mail de l\'utilisateur", error) })
            } else throw new ErrorHandler("Le code que vous avez fourni ne correspond pas!", new Error())
        }
        throw new ErrorHandler(`Il n'y a pas d'utilisateur sous le mail ${email}`, new Error())
    })
}


export const signup = async (user: TSignup): Promise<String | void> => {
    await UserModel.findOne({ username: user.username }).then(async (existingUser) => {
        if (existingUser) throw new Error(`Malheureusement, le nom d'utilisateur ${user.username} est déjà utilisé par ${existingUser.firstname + ' ' + existingUser.lastname}.`)

        await UserModel.findOne({ email: user.email }).then(async (existing) => {
            if (existing) throw new Error(`Malheureusement, l'adresse email' ${user.username} est déjà utilisé par ${existing.username}.`)

            const _id: Types.ObjectId = new Types.ObjectId()
            const publicatorId: Types.ObjectId = new Types.ObjectId()
            const newPublicator = new PublicatorModel({
                userId: _id,
                _id: publicatorId,
                type: PublicatorType.user,
            })

            let recoveryCode = Math.floor(Math.random() * 1000000)
            user.password = sha(user.password);
            user.firstname = nameFormat(user.firstname);
            user.lastname = nameFormat(user.lastname);
            const newUser = new UserModel({
                _id,
                recoveryCode,
                email: user.email,
                username: user.username,
                password: user.password,
                lastname: user.lastname,
                publicator: publicatorId,
                firstname: user.firstname,
                authType: AuthTypes.classic,
                status: UserAccountStatus.active,
                concat: user.username + " " + user.firstname + " " + user.lastname + " " + user.email,
            })

            await newPublicator.save().then(async () => {
                await newUser.save()
                    .then(() => { return generateToken(_id.toString(), user.username, user.email, 1) })
                    .catch((error: Error) => { throw new ErrorHandler(`Impossible d'enregistrer l'utilisateur ${user}`, error) })
            }).catch((error: Error) => { throw new ErrorHandler(`Impossible d'enregistrer le publicator de l'user ${user}`, error) })
        }).catch((error: Error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée. Nous y travaillons!`, error) })
    }).catch((error: Error) => { throw new ErrorHandler(`Erreur de connexion à la base de donnée. Nous y travaillons!`, error) })
}