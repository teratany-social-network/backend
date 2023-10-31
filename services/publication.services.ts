import { IPub, PublicationModel } from "../models/publication.model";
import { PublicatorModel } from "../models/publicator.model";
import { ErrorHandler } from "../utils/error";

export const create = async (publication: IPub) => {
    if (await PublicatorModel.findById(publication.publicator)) {
        await new PublicationModel(publication).save()
    } else throw new ErrorHandler("Vous essayez de publier avec un compte qui n'est pas enregistré", 403, new Error)
}

export const searchByPublicator = async (publicatorId: String): Promise<any[]> => {
    try {
        const publicator = await PublicatorModel.findById(publicatorId)
        if (publicator) {
            let populatePublicator = { path: 'userId', select: 'displayName image _id publicator' }
            if (publicator.type != "user") populatePublicator = { path: 'pageId', select: 'name image _id publicator' }
            const publications = await PublicationModel.find({ publicator: publicatorId })
                .populate({ path: 'publicator', populate: { ...populatePublicator } })
                .populate({ path: 'commentaire', populate: { path: 'user' } })
                .populate({ path: 'reaction', populate: { path: 'user' } })
            return publications
        } else throw new ErrorHandler("Ce profil n'existe pas", 404, new Error)
    }
    catch (error) { throw new ErrorHandler("Erreur interne au serveur, nous y travaillons", 500, error) }
}

export const update = async (publicationId: String, content: String) => await PublicationModel.findByIdAndUpdate(publicationId, { content }).catch((error) => { throw new ErrorHandler("Erreur interne, nous y travaillons.", 500, error) })

