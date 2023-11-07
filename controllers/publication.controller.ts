import { Request, Response } from "express";
import { createPublication, feed, getComments, getOnePublication, getProfilePublication, getReactions, postComment, removeComment, removePublication, toggleReaction, updatePublication } from "../services/publication.services";

export const createPublicationController = async (req: Request, res: Response) => {
    const { profile, content, images } = req.body
    await createPublication({ profile, content, images })
        .then(() => res.send('ok'))
        .catch((error) => res.status(error.code).send(error))
}

export const getProfilePublicationController = async (req: Request, res: Response) => {
    const { profileId, ownId } = req.query
    await getProfilePublication(profileId.toString(), ownId.toString())
        .then((publications) => res.send(publications))
        .catch((error) => res.status(error.code).send(error))
}

export const getOnePublicationController = async (req: Request, res: Response) => {
    const { publicationId, ownId } = req.query
    await getOnePublication(publicationId.toString(), ownId.toString())
        .then((publications) => res.send(publications))
        .catch((error) => res.status(error.code).send(error))
}

export const updatePublicationController = async (req: Request, res: Response) => {
    const { publicationId, content } = req.body
    await updatePublication(publicationId, content)
        .then(() => res.send('ok'))
        .catch((error) => res.status(error.code).send(error))
}

export const postCommentController = async (req: Request, res: Response) => {
    const { publicationId, content, profileId } = req.body
    await postComment(profileId, publicationId, content)
        .then(() => res.send('ok'))
        .catch((error) => res.status(error.code).send(error))
}

export const removeCommentController = async (req: Request, res: Response) => {
    const { commentId } = req.params
    await removeComment(commentId)
        .then(() => res.send('ok'))
        .catch((error) => res.status(error.code).send(error))
}

export const removePublicationController = async (req: Request, res: Response) => {
    const { publicationId } = req.params
    await removePublication(publicationId)
        .then(() => res.send('ok'))
        .catch((error) => res.status(error.code).send(error))
}

export const toggleReactionController = async (req: Request, res: Response) => {
    const { profileId, publicationId } = req.body
    await toggleReaction(publicationId, profileId)
        .then(() => res.send('ok'))
        .catch((error) => res.status(error.code).send(error))
}

export const getCommentsController = async (req: Request, res: Response) => {
    const { publicationId } = req.params
    await getComments(publicationId)
        .then((comments) => res.send(comments))
        .catch((error) => res.status(error.code).send(error))
}

export const getReactionsController = async (req: Request, res: Response) => {
    const { publicationId } = req.params
    await getReactions(publicationId)
        .then((reactions) => res.send(reactions))
        .catch((error) => res.status(error.code).send(error))
}

export const feedController = async (req: Request, res: Response) => {
    const { ownId } = req.params
    await feed(ownId)
        .then((publications) => res.send(publications))
        .catch((error) => res.status(error.code).send(error))
}