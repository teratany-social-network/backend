import { Router } from "express"
import { authenticateToken } from "../middleware/authentificationToken"
import { createPublicationController, feedController, getCommentsController, getOnePublicationController, getProfilePublicationController, getReactionsController, postCommentController, removeCommentController, removePublicationController, toggleReactionController, updatePublicationController } from "../controllers/publication.controller"

const PublicationRouter = Router()

PublicationRouter.get('/byProfile', authenticateToken, (req, res) => getProfilePublicationController(req, res))
PublicationRouter.get('/one', authenticateToken, (req, res) => getOnePublicationController(req, res))
PublicationRouter.post('/', authenticateToken, (req, res) => createPublicationController(req, res))
PublicationRouter.patch('/', authenticateToken, (req, res) => updatePublicationController(req, res))
PublicationRouter.delete('/:publicationId', authenticateToken, (req, res) => removePublicationController(req, res))

PublicationRouter.get('/comments/:publicationId', (req, res) => getCommentsController(req, res))
PublicationRouter.post('/comment', authenticateToken, (req, res) => postCommentController(req, res))
PublicationRouter.delete('/comment', authenticateToken, (req, res) => removeCommentController(req, res))

PublicationRouter.get('/reactions/:publicationId', (req, res) => getReactionsController(req, res))
PublicationRouter.post('/reaction/toggle', authenticateToken, (req, res) => toggleReactionController(req, res))

PublicationRouter.get('/feed/:ownId', (req, res) => feedController(req, res))

export { PublicationRouter }