import { Request, Response } from "express";
import { IPage, IPageGeneral } from "../models/page.model";
import { checkIfWalletExist, createPage, getAdministratorList, getAdministredPageList, getPageById, search, updateAddress, updateCategory, updateContact, updateCoordonates, updateDescription, updateName, updateProfilePicture, updatedeviantWalletID } from "../services/pages.services";
import { ErrorHandler } from "../utils/error";

export const getPageByIdController = async (req: Request, res: Response) => {
    const { id } = req.params
    console.log(id);

    await getPageById(id)
        .then((page: IPage) => {
            console.log(page);
            res.send(page)
        })
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const checkIfWalletExistController = (req: Request, res: Response) => {
    const { wallet } = req.params
    checkIfWalletExist(wallet)
        .then((isExist: Boolean) => res.send(isExist))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const searchController = (req: Request, res: Response) => {
    const { name, country, category, type } = req.query
    search(name.toString(), country.toString(), category.toString(), type.toString())
        .then((results: any) => res.send(results))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const getAdministredPageListController = (req: Request, res: Response) => {
    const { userId } = req.params
    getAdministredPageList(userId)
        .then((results: any) => res.send(results))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const getAdministratorListController = (req: Request, res: Response) => {
    const { pageId } = req.params
    getAdministratorList(pageId)
        .then((results: any) => res.send(results))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const updateProfilePictureController = (req: Request, res: Response) => {
    const { pageId, url } = req.body
    let token = req.headers.authorization
    updateProfilePicture(pageId, url, token)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const updateNameController = (req: Request, res: Response) => {
    const { pageId, name } = req.body
    let token = req.headers.authorization
    updateName(pageId, name, token)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const updateDescriptionController = (req: Request, res: Response) => {
    const { pageId, description } = req.body
    let token = req.headers.authorization
    updateDescription(pageId, description, token)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const updateCategoryController = (req: Request, res: Response) => {
    const { pageId, category } = req.body
    let token = req.headers.authorization
    updateCategory(pageId, category, token)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const updateAddressController = (req: Request, res: Response) => {
    const { pageId, address, country } = req.body
    let token = req.headers.authorization
    updateAddress(pageId, address, country, token)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const updateContactController = (req: Request, res: Response) => {
    const { pageId, phoneNumber, website, email } = req.body
    let token = req.headers.authorization
    updateContact(pageId, phoneNumber, website, email, token)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const updatedeviantWalletIDController = (req: Request, res: Response) => {
    const { pageId, deviantWalletID } = req.body
    let token = req.headers.authorization
    updatedeviantWalletID(pageId, deviantWalletID, token)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const updateCoordonatesController = (req: Request, res: Response) => {
    const { pageId, latitude, longitude } = req.body
    let token = req.headers.authorization
    updateCoordonates(pageId, latitude, longitude, token)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}

export const createPageController = (req: Request, res: Response) => {
    const page = req.body as IPageGeneral
    let token = req.headers.authorization
    createPage(token, page)
        .then((id: string) => res.send(id))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}