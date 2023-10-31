import { Router } from "express"
import { getByPublicatorController } from "../controllers/publicator.controller"
const PublicatorRouter = Router()
PublicatorRouter.get('/:id', (req, res) => getByPublicatorController(req, res))

export { PublicatorRouter }
