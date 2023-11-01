import { sha } from "../utils/sha256"
import { ErrorHandler } from "../utils/error"
import { sendMail } from "../utils/nodemailer"
import { generateToken } from "../utils/generateJwtToken"
import { TSendEmail, TSignup } from "../types/TAuthentication"
import { ProfileModel } from "../models/profile.model"


export const checkName = async (name: string): Promise<Boolean> => {
    try {
        if (await ProfileModel.exists({ name })) return false
        return true
    } catch (error) { throw new ErrorHandler("Erreur de connexion à la base de donnée, nous y travaillons!", 500, error) }
}

export const checkEmail = async (email: string): Promise<Boolean> => {
    try {
        if (await ProfileModel.exists({ 'contact.email': email })) return false
        return true
    } catch (error) { throw new ErrorHandler("Erreur de connexion à la base de donnée, nous y travaillons!", 500, error) }
}

export const sendEmail = async (email: string): Promise<TSendEmail> => {
    try {
        let profile = await ProfileModel.findOne({ 'contact.email': email })
        if (profile) {
            if (profile.confirmation.accountStatus == 'active') {
                let recoveryCode = Math.floor(Math.random() * 1000)
                profile.confirmation.recoveryCode = recoveryCode.toString()
                profile.confirmation.accountStatus = 'pending'
                await profile.save()
                let text = "Votre code de confirmation est : " + recoveryCode
                await sendMail(email, "Email verification", text)
                return { isSent: true, message: "Code de validation envoyé" }
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
        const profile = await ProfileModel.findOne({ 'contact.email': email })
        if (profile) {
            if (profile.confirmation.recoveryCode == code) {
                profile.confirmation.recoveryCode = '0'
                profile.confirmation.accountStatus = 'active'
                await profile.save()
            } else throw new ErrorHandler("Le code de confirmation fourni ne correspond pas!", 403, new Error())
        } else throw new ErrorHandler(`Aucun utilisateur trouvé avec l'adresse e-mail ${email}`, 404, new Error())
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        throw new ErrorHandler("Une erreur s'est produite lors de la validation de l'adresse e-mail de l'utilisateur", 500, error)
    }
}


export const signup = async (profile: TSignup): Promise<String> => {
    let token: String = ""
    if (profile.name.length < 2) throw new ErrorHandler(`Vous devez envoyer un nom plus long (2 minimum)`, 403, new Error())
    else if (profile.password.length < 4) throw new ErrorHandler(`Vous devez choisir un mot de passe plus long, au moin 4 caractères`, 403, new Error())

    const existingProfile = await ProfileModel.findOne({ name: profile.name })
    if (existingProfile) throw new ErrorHandler(`Malheureusement, le nom d'utilisateur ${profile.name} est déjà utilisé par ${existingProfile.contact.email}.`, 403, new Error())

    const existingEmailProfile = await ProfileModel.findOne({ 'contact.email': profile.email })
    if (existingEmailProfile) throw new ErrorHandler(`Malheureusement, l'adresse email' ${profile.email} est déjà utilisé par ${existingEmailProfile.name}.`, 401, new Error(`Malheureusement, l'adresse email' ${profile.email} est déjà utilisé par ${existingEmailProfile.name}.`))
    let recoveryCode = Math.floor(Math.random() * 1000000)
    profile.password = sha(profile.password)
    const newProfile = new ProfileModel({
        name: profile.name,
        contact: { email: profile.email },
        password: profile.password,
        confirmation: {
            recoveryCode: recoveryCode,
            accountStatus: 'pending'
        },
    })
    try {
        await newProfile.save()
        token = generateToken(newProfile.id, newProfile.name, newProfile.contact.email, 1)
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        throw new ErrorHandler(`Une erreur s'est produite lors de l'inscription de l'utilisateur. Veuillez réessayer.`, 500, error)
    }
    return token
}


export const signin = async (email: string, password: string): Promise<String> => {
    const profile = await ProfileModel.findOne({ 'contact.email': email, password: sha(password) })
    if (profile) return generateToken(profile.id, profile.name, profile.contact.email, profile.role)
    throw new ErrorHandler(`Votre email ou votre mot de passe est incorrect`, 401, new Error())
}