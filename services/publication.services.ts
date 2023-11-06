import { ProfileModel } from "../models/profile.model"
import { CommentModel } from "../models/comment.model"
import { IPub, PublicationModel } from "../models/publication.model"
import { ErrorHandler } from "../utils/error"
import { Types } from "mongoose"

export const createPublication = async (publication: IPub) => {
    try {
        const profile = await ProfileModel.findById(publication.profile)
        if (profile) {
            const newPublication = await new PublicationModel(publication).save()

            profile.publications.push(newPublication.id)
            await profile.save()
        } else throw new ErrorHandler("Vous essayez de publier avec un compte qui n'est pas enregistré", 403, new Error)
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        else throw new ErrorHandler("Erreur interne au serveur, nous y travaillons", 500, error)
    }
}

export const getProfilePublication_ = async (profileId: String, ownId: string): Promise<any[]> => {
    try {
        const publications = await PublicationModel.find({ profile: profileId })
            .populate({ path: 'profile', select: 'name image profileType' })
            .populate({ path: 'comments', populate: { path: 'profile', select: 'name image profileType' } })
            .populate({ path: 'reactions', select: 'name profileType' })
        return publications
    }
    catch (error) { throw new ErrorHandler("Erreur interne au serveur, nous y travaillons", 500, error) }
}

export const getProfilePublication = async (profileId: string, ownId: string): Promise<IPub[]> => {
    try {
        return await PublicationModel.aggregate([
            {
                $match: { profile: new Types.ObjectId(profileId) }
            },
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'profile',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $unwind: '$profile'
            },
            {
                $addFields: {
                    isReacted: {
                        $in: [new Types.ObjectId(ownId), '$reactions._id']
                    },
                    numberOfComments: { $size: '$comments' },
                    numberOfReactions: { $size: '$reactions' },
                }
            },
            {
                $project: {
                    '_id': 1,
                    'images': 1,
                    'date': 1,
                    'content': 1,
                    'isReacted': 1,
                    'numberOfComments': 1,
                    'numberOfReactions': 1,
                    'profile._id': 1,
                    'profile.name': 1,
                    'profile.image': 1,
                    'profile.profileType': 1
                }
            }
        ]);

    } catch (error) {
        throw new ErrorHandler("Erreur interne au serveur, nous y travaillons", 500, error);
    }
};

export const getOnePublication = async (publicationId: string, ownId: string): Promise<IPub[]> => {
    try {
        return await PublicationModel.aggregate([
            {
                $match: { _id: new Types.ObjectId(publicationId) }
            },
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'profile',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $unwind: '$profile'
            },

            {
                $addFields: {
                    isReacted: {
                        $in: [new Types.ObjectId(ownId), '$reactions._id']
                    },
                    numberOfComments: { $size: '$comments' },
                    numberOfReactions: { $size: '$reactions' },
                }
            },
            {
                $project: {
                    '_id': 1,
                    'images': 1,
                    'date': 1,
                    'content': 1,
                    'isReacted': 1,
                    'profile._id': 1,
                    'profile.name': 1,
                    'profile.image': 1,
                    'numberOfComments': 1,
                    'numberOfReactions': 1
                }
            }
        ]);

    } catch (error) {
        throw new ErrorHandler("Erreur interne au serveur, nous y travaillons", 500, error);
    }
};

export const updatePublication = async (publicationId: String, content: String) => {
    await PublicationModel.findByIdAndUpdate(publicationId, { content })
        .catch((error) => { throw new ErrorHandler("Erreur interne, nous y travaillons.", 500, error) })
}

export const postComment = async (profile: string, publicationId: String, content: string) => {
    try {
        const newComment = new CommentModel({ profile, content })
        const publication = await PublicationModel.findById(publicationId)
        if (publication) {
            await newComment.save()
                .then(async () => {
                    publication.comments.push(newComment)
                    await publication.save()
                })
        } else throw new ErrorHandler(`La publication n'existe pas`, 404, new Error)
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        else throw new ErrorHandler(`Erreur côté serveur, nous y travaillons.`, 500, error)
    }
}

export const removeComment = async (commentId: string) => {
    await CommentModel.findByIdAndDelete(commentId).catch((error) => { throw new ErrorHandler(`Erreur côté serveur, nous y travaillons`, 500, error) })
}
export const removePublication = async (publicationId: string) => {
    await PublicationModel.findByIdAndDelete(publicationId).catch((error) => { throw new ErrorHandler(`Erreur côté serveur, nous y travaillons`, 500, error) })
}

export const toggleReaction = async (publicationId: string, profileId: string) => {
    try {
        const publication = await PublicationModel.findById(publicationId)
        if (publication) {
            const index = publication.reactions.indexOf(profileId)
            if (index === -1) publication.reactions.push(profileId)
            else publication.reactions.splice(index, 1)
            await publication.save()
        } else throw new ErrorHandler('Publication non trouvée', 404, new Error)
    } catch (error) {
        if (error instanceof ErrorHandler) throw error
        else throw new ErrorHandler('Une erreur s\'est produite lors de la mise à jour des réactions de l\'utilisateur pour la publication, nous y travaillons', 500, error)
    }
}

export const getComments = async (publicationId: string): Promise<any[]> => {
    const publication = await PublicationModel.findById(publicationId)
        .populate({
            path: 'comments',
            populate: {
                path: 'profile',
                select: '_id image name'
            }
        })
    if (publication) return publication.comments
    else throw new ErrorHandler(`La publication n'existe pas.`, 404, new Error)
}

export const getReactions = async (publicationId: string): Promise<any[]> => {
    const publication = await PublicationModel.findById(publicationId)
        .populate({
            path: 'reactions',
            select: '_id image name'
        })
    if (publication) return publication.reactions
    else throw new ErrorHandler(`La publication n'existe pas.`, 404, new Error)
}