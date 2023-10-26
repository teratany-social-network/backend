import { AdminAndPageModel, IPageGeneral, PageModel, PageType } from "../models/page.model"
import { ErrorHandler } from "../utils/error"
import { decodeAuthorization } from "../utils/jwtDecode"
import { IPage } from "../models/page.model"
import axios from "axios"
import { Types } from "mongoose"
import { PublicatorModel } from "../models/publicator.model"

export const isAdmin = async (token: string, pageId: string): Promise<number> => {
    try {
        let administration = await AdminAndPageModel.findOne({ admin: await decodeAuthorization(token).id, page: pageId })
        if (administration) return administration.role
        else return 0
    } catch (error) {
        return 0
    }
}

export const getPageById = async (id: string): Promise<IPage> => {
    try { return await PageModel.findById(id).populate('publicator') }
    catch (error) { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) }
}

export const checkIfWalletExist = async (walletId: string): Promise<Boolean> => {
    let walletData = await axios(`https://explorer.deviantcoin.io/ext/getaddress/${walletId}`).catch((error) => { throw new ErrorHandler("Impossible de verifier le wallet pour l'istant. Nous y travaillons", 500, error) })
    if (walletData.data.details === 'Invalid address') throw new ErrorHandler("Vous avez entré un Wallet deviantcoin invalide", 404, new Error())
    else return true
}

export const search = async (name: string, country: string, category: string, type: string): Promise<any[]> => {
    let result = await PageModel.find({
        name: { $regex: name, $options: "i" },
        country: { $regex: country, $options: "i" },
        pageType: { $regex: type, $options: "i" },
        category: { $regex: category, $options: "i" }
    }).select('name image description category address country email phoneNumber website deviantWalletId coordonates pageType publicator').populate('publicator')
    return result
}

export const getAdministredPageList = async (userId: String): Promise<any> => {
    try {
        return await AdminAndPageModel.find({ admin: userId }).populate('page')
    } catch (error) { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) }
}

export const getAdministratorList = async (pageId: String): Promise<any> => {
    try {
        return await AdminAndPageModel.find({ page: pageId }).populate('admins')
    } catch (error) { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) }
}

export const updateProfilePicture = async (pageId: string, url: string, token: string) => {
    if (await isAdmin(token, pageId) > 0)
        await PageModel.findByIdAndUpdate(pageId, { image: url }).catch((error) => { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) })
    else throw new ErrorHandler("Vous n'êtes pas administrateur de cette page", 403, new Error)
}

export const updateName = async (pageId: string, name: string, token: string) => {
    if (await isAdmin(token, pageId) > 0)
        await PageModel.findByIdAndUpdate(pageId, { name }).catch((error) => { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) })
    else throw new ErrorHandler("Vous n'êtes pas administrateur de cette page", 403, new Error)
}

export const updateDescription = async (pageId: string, description: string, token: string) => {
    if (await isAdmin(token, pageId) > 0)
        await PageModel.findByIdAndUpdate(pageId, { description }).catch((error) => { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) })
    else throw new ErrorHandler("Vous n'êtes pas administrateur de cette page", 403, new Error)
}

export const updateCategory = async (pageId: string, category: string, token: string) => {
    if (await isAdmin(token, pageId) > 0)
        await PageModel.findByIdAndUpdate(pageId, { category }).catch((error) => { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) })
    else throw new ErrorHandler("Vous n'êtes pas administrateur de cette page", 403, new Error)
}

export const updateAddress = async (pageId: string, address: string, country: string, token: string) => {
    if (await isAdmin(token, pageId) > 0)
        await PageModel.findByIdAndUpdate(pageId, { address, country }).catch((error) => { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) })
    else throw new ErrorHandler("Vous n'êtes pas administrateur de cette page", 403, new Error)
}

export const updateContact = async (pageId: string, phoneNumber: string, website: string, email: string, token: string) => {
    if (await isAdmin(token, pageId) > 0)
        await PageModel.findByIdAndUpdate(pageId, { email, phoneNumber, website }).catch((error) => { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) })
    else throw new ErrorHandler("Vous n'êtes pas administrateur de cette page", 403, new Error)
}

export const updatedeviantWalletID = async (pageId: string, deviantWalletID: string, token: string) => {
    if (await isAdmin(token, pageId) > 0)
        await PageModel.findByIdAndUpdate(pageId, { deviantWalletID }).catch((error) => { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) })
    else throw new ErrorHandler("Vous n'êtes pas administrateur de cette page", 403, new Error)
}

export const updateCoordonates = async (pageId: string, latitude: number, longitude: number, token: string) => {
    if (await isAdmin(token, pageId) > 0)
        await PageModel.findByIdAndUpdate(pageId, { coordonates: { latitude, longitude } }).catch((error) => { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) })
    else throw new ErrorHandler("Vous n'êtes pas administrateur de cette page", 403, new Error)
}

export const createPage = async (token: string, page: IPageGeneral): Promise<String> => {
    let pageId = new Types.ObjectId()
    let publicatorId = new Types.ObjectId()
    let adminAndPageId = new Types.ObjectId()
    let userId = await decodeAuthorization(token).id

    let newAdminAndPage = new AdminAndPageModel({
        _id: adminAndPageId,
        admin: userId,
        page: pageId,
        role: 2
    })

    let newPublicator = new PublicatorModel({
        type: page.pageType,
        _id: publicatorId,
        pageId
    })

    let newPage = new PageModel({
        ...page,
        publicator: publicatorId
    })

    if (await checkIfWalletExist(page.deviantWalletID)) {
        try {
            await newPublicator.save()
            await newAdminAndPage.save()
            await newPage.save()
            return pageId.toString()
        } catch (error) { throw new ErrorHandler("Error interne au serveur, nous y travaillons", 500, error) }
    }
}