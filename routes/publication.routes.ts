import { Router } from "express"
import { authenticateToken } from "../middleware/authentificationToken"
import { createPublicationController, getOnePublicationController, getProfilePublicationController, postCommentController, removeCommentController, removePublicationController, toggleReactionController, updatePublicationController } from "../controllers/publication.controller"

const PublicationRouter = Router()

PublicationRouter.post('/reaction/toggle', authenticateToken, (req, res) => toggleReactionController(req, res))

PublicationRouter.post('/comment', authenticateToken, (req, res) => postCommentController(req, res))
PublicationRouter.delete('/comment', authenticateToken, (req, res) => removeCommentController(req, res))

PublicationRouter.post('/', authenticateToken, (req, res) => createPublicationController(req, res))
PublicationRouter.get('/byProfile', authenticateToken, (req, res) => getProfilePublicationController(req, res))
PublicationRouter.get('/one', authenticateToken, (req, res) => getOnePublicationController(req, res))
PublicationRouter.patch('/', authenticateToken, (req, res) => updatePublicationController(req, res))
PublicationRouter.delete('/:publicationId', authenticateToken, (req, res) => removePublicationController(req, res))

export { PublicationRouter }