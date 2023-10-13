import { Router } from "express"
import { getUserByIdController } from "../controllers/user.controller"
const USerRouter = Router()
USerRouter.get('/:id', (req, res) => getUserByIdController(req, res))

export { USerRouter }
