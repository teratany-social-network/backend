import { decodeAuthorization } from "../utils/jwtDecode"
import { TSendEmail } from "../types/TAuthentication"
import { ErrorHandler } from "../utils/error"
import { Request, Response } from "express"
import { createProfile, editCategories, editContact, editLocalisation, editPassword, editProfileGeneral, editProfileImage, getProfileByEmail, getProfileById, getProfileByName, getProfileByToken, getProfileWithCoordonates, passwordRecovery, search, sendRecoveryCode, toggleFollow } from "../services/profile.services"
import { IProfile } from "../models/profile.model"
import { IContact, ICreateProfile, ILocalisation } from "../types/profile"

export const getProfileByIdController = async (req: Request, res: Response) => {
    const { id, ownId } = req.params
    await getProfileById(id?.toString() || "", ownId?.toString() || "")
        .then((profile: IProfile[]) => res.send(profile))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const getProfileByNameController = async (req: Request, res: Response) => {
    const { name } = req.query
    await getProfileByName(name?.toString() || "")
        .then((profile: IProfile) => res.send(profile))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const getProfileByEmailController = async (req: Request, res: Response) => {
    const { email } = req.query
    await getProfileByEmail(email?.toString() || "")
        .then((profile: IProfile) => res.send(profile))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const editProfileImageController = async (req: Request, res: Response) => {
    const { image, id } = req.body

    await editProfileImage(id, image)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const editPasswordController = async (req: Request, res: Response) => {
    const { password, newPassword } = req.body
    let token = req.headers.authorization || ""
    let id: string = await decodeAuthorization(token).id
    await editPassword(id, password, newPassword)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const editProfileGeneralController = async (req: Request, res: Response) => {
    let { id, name, description, email } = req.body
    await editProfileGeneral(id, name, description, email)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const editLocalisationController = async (req: Request, res: Response) => {
    const { id } = req.body
    const newCoordonates = req.body as ILocalisation
    await editLocalisation(id, newCoordonates)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const getProfileByTokenController = async (req: Request, res: Response) => {
    let token = req.headers.authorization
    await getProfileByToken(token)
        .then((profile: IProfile) => res.send(profile))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const getProfileWithCoordonatesController = async (req: Request, res: Response) => {
    await getProfileWithCoordonates()
        .then((profiles: any) => res.send(profiles))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const passwordRecoveryController = async (req: Request, res: Response) => {
    const { email, code, password } = req.body
    await passwordRecovery(email, code, password)
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
    const { filter, ownId } = req.query
    await search(filter?.toString() || '', ownId?.toString() || '')
        .then((profiles: any) => res.send(profiles))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const editCategoriesController = async (req: Request, res: Response) => {
    const { id, categories } = req.body
    editCategories(id, categories)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}
export const editContactController = async (req: Request, res: Response) => {
    const { id } = req.body
    const contact = req.body as IContact
    editContact(id, contact)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const createProfileController = async (req: Request, res: Response) => {
    let token = req.headers.authorization
    const id = decodeAuthorization(token).id || ''
    const profile = req.body as ICreateProfile
    createProfile(id, profile)
        .then((newProfile) => res.send(newProfile))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const toggleFollowController = async (req: Request, res: Response) => {
    let { currentProfileId, toFollowId } = req.body
    toggleFollow(currentProfileId, toFollowId)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}