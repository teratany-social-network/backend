import { ProfileModel } from "../models/profile.model";
import { CommentModel } from "../models/comment.model";
import { IPub, PublicationModel } from "../models/publication.model";
import { ErrorHandler } from "../utils/error";

export const create = async (publication: IPub) => {
    if (await ProfileModel.findById(publication.profile)) {
        await new PublicationModel(publication).save()
    } else throw new ErrorHandler("Vous essayez de publier avec un compte qui n'est pas enregistré", 403, new Error)
}

export const getProfilePublication = async (profileId: String): Promise<any[]> => {
    try {
        const publications = await PublicationModel.find({ profile: profileId })
            .populate({ path: 'profile' })
            .populate({ path: 'comment', populate: { path: 'profile' } })
            .populate({ path: 'reaction', populate: { path: 'profile' } })
        return publications
    }
    catch (error) { throw new ErrorHandler("Erreur interne au serveur, nous y travaillons", 500, error) }
}

export const update = async (publicationId: String, content: String) => {
    await PublicationModel.findByIdAndUpdate(publicationId, { content })
        .catch((error) => { throw new ErrorHandler("Erreur interne, nous y travaillons.", 500, error) })
}

export const comment = async (profile: string, publicationId: String, content: string) => {
    const newComment = new CommentModel({ profile, content })
    const publication = await PublicationModel.findById(publicationId)
    if (publication) {
        await newComment.save()
        publication.comments.push(newComment)
    } else throw new ErrorHandler(`La publication n'existe pas`, 404, new Error)
}

