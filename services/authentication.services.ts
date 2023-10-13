import { sha } from "../utils/sha256"
import { Types } from "mongoose"
import { nameFormat } from "../utils/format"
import { ErrorHandler } from "../utils/error"
import { sendMail } from "../utils/nodemailer"
import { generateToken } from "../utils/generateJwtToken"
import { TSendEmail, TSignup } from "../types/TAuthentication"
import { PublicatorModel, PublicatorType } from "../models/publicator.model"
import { AuthTypes, IUser, UserAccountStatus, UserModel } from "../models/user.model"


export const checkName = async (displayName: string): Promise<Boolean> => {
    try {
        if (await UserModel.exists({ displayName })) return false
        return true
    } catch (error) { throw new ErrorHandler("Erreur de connexion à la base de donnée, nous y travaillons!", 500, error) }
}
export const checkEmail = async (email: string): Promise<Boolean> => {
    try {
        if (await UserModel.exists({ email })) return false
        return true
    } catch (error) { throw new ErrorHandler("Erreur de connexion à la base de donnée, nous y travaillons!", 500, error) }
}

export const sendEmail = async (email: string): Promise<TSendEmail> => {
    try {
        let user = await UserModel.findOne({ email: email })
        if (user) {
            if (user.status == UserAccountStatus.active) {
                let recoveryCode = Math.floor(Math.random() * 1000)
                user.recoveryCode = recoveryCode
                user.status = UserAccountStatus.pending
                await user.save()
                let text = "Votre code de confirmation est : " + recoveryCode
                await sendMail(email, "Email verification", text)
                return { isSent: true }
            }
            return { isSent: false, message: "Votre adresse email a déjà été validée" }
        }
        throw new ErrorHandler(`Il n'y a pas d'utilisateur sous le mail ${email}`, 404, new Error(`Il n'y a pas d'utilisateur sous le mail ${email}`))
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        throw new ErrorHandler("Une erreur s'est produite lors de l'envoi de l'e-mail de vérification", 500, error)
    }
}

export const verifyEmail = async (email: string, code: string) => {
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            if (user.recoveryCode == code) {
                user.recoveryCode = 0
                user.status = UserAccountStatus.active
                await user.save()
            } else throw new ErrorHandler("Le code de confirmation fourni ne correspond pas!", 403, new Error())
        } else throw new ErrorHandler(`Aucun utilisateur trouvé avec l'adresse e-mail ${email}`, 404, new Error())
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        throw new ErrorHandler("Une erreur s'est produite lors de la validation de l'adresse e-mail de l'utilisateur", 500, error)
    }
}


export const signup = async (user: TSignup): Promise<String> => {
    let token: String = ""
    if (user.displayName.length < 2) throw new ErrorHandler(`Vous devez envoyer un nom plus long (2 minimum)`, 403, new Error())
    else if (user.password.length < 4) throw new ErrorHandler(`Vous devez choisir un mot de passe plus long, au moin 4 caractères`, 403, new Error())

    const existingUser = await UserModel.findOne({ displayName: user.displayName })
    if (existingUser) throw new ErrorHandler(`Malheureusement, le nom d'utilisateur ${user.displayName} est déjà utilisé par ${existingUser.email}.`, 403, new Error())

    const existingEmailUser = await UserModel.findOne({ email: user.email })
    if (existingEmailUser) throw new ErrorHandler(`Malheureusement, l'adresse email' ${user.email} est déjà utilisé par ${existingEmailUser.displayName}.`, 401, new Error(`Malheureusement, l'adresse email' ${user.email} est déjà utilisé par ${existingEmailUser.displayName}.`))

    const _id: Types.ObjectId = new Types.ObjectId()
    const publicatorId: Types.ObjectId = new Types.ObjectId()
    const newPublicator = new PublicatorModel({
        userId: _id,
        _id: publicatorId,
        type: PublicatorType.user,
    })

    let recoveryCode = Math.floor(Math.random() * 1000000)
    user.password = sha(user.password)
    const newUser = new UserModel({
        _id,
        recoveryCode,
        email: user.email,
        displayName: user.displayName,
        password: user.password,
        publicator: publicatorId,
        authType: AuthTypes.classic,
        status: UserAccountStatus.active,
        concat: user.displayName + " " + user.email,
    })
    try {

        await newPublicator.save()
        await newUser.save()
        token = generateToken(_id.toString(), user.displayName, user.email, 1)
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        throw new ErrorHandler(`Une erreur s'est produite lors de l'inscription de l'utilisateur. Veuillez réessayer.`, 500, error)
    }
    return token
}


export const signin = async (email: string, password: string): Promise<String> => {
    const user = await UserModel.findOne({ email, password: sha(password) })
    if (user) return generateToken(user.id, user.displayName, user.email, user.role)
    throw new ErrorHandler(`Votre email ou votre mot de passe est incorrect`, 401, new Error())
}