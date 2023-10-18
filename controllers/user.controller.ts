import { getUserById, editProfileImage, getUserByName, editPassword, editProfile, getUserByToken, getUserWithCoordonates, passwordRecovery, sendRecoveryCode, search, getUserByEmail } from "../services/user.services"
import { TEditProfile, TPrivateInfo } from "../types/TUser"
import { decodeAuthorization } from "../utils/jwtDecode"
import { TSendEmail } from "../types/TAuthentication"
import { ErrorHandler } from "../utils/error"
import { IUser } from "../models/user.model"
import { Request, Response } from "express"

export const getUserByIdController = async (req: Request, res: Response) => {
    const { id } = req.params
    await getUserById(id?.toString() || "")
        .then((user: IUser) => res.send(user))
        .catch((error: ErrorHandler) => console.log(error)
        )
}
export const getUserByNameController = async (req: Request, res: Response) => {
    const { displayName } = req.query
    await getUserByName(displayName?.toString() || "")
        .then((user: IUser) => res.send(user))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const getUserByEmailController = async (req: Request, res: Response) => {
    const { email } = req.query
    await getUserByEmail(email?.toString() || "")
        .then((user: IUser) => res.send(user))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const editProfileImageController = async (req: Request, res: Response) => {
    const { imageData } = req.body
    let token = req.headers.authorization || ""
    let id: string = await decodeAuthorization(token).id
    await editProfileImage(id, imageData)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const editPasswordeController = async (req: Request, res: Response) => {
    const { password, newPassword } = req.body
    let token = req.headers.authorization || ""
    let id: string = await decodeAuthorization(token).id
    await editPassword(id, password, newPassword)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const editProfileController = async (req: Request, res: Response) => {
    const userData = req.body.userData as TEditProfile
    const privateInfo = req.body.privateInfo as TPrivateInfo
    let token = req.headers.authorization || ""
    let id: string = await decodeAuthorization(token).id
    await editProfile(id, userData, privateInfo)
        .then((token: String) => res.send(token))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}


export const getUserByTokenController = async (req: Request, res: Response) => {
    let token = req.headers.authorization
    console.log(token);

    await getUserByToken(token)
        .then((user: IUser) => res.send(user))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const getUserWithCoordonatesController = async (req: Request, res: Response) => {
    await getUserWithCoordonates()
        .then((users: any) => res.send(users))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const passwordRecoveryController = async (req: Request, res: Response) => {
    const { email, recovery, password } = req.body
    await passwordRecovery(email, recovery, password)
        .then((token: String) => res.send(token))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const sendRecoveryCodeController = async (req: Request, res: Response) => {
    const { email } = req.query
    await sendRecoveryCode(email.toString() || "")
        .then((isSent: TSendEmail) => res.send(isSent))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const searchController = async (req: Request, res: Response) => {
    const { filter } = req.query
    await search(filter?.toString() || '')
        .then((users: any) => res.send(users))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}