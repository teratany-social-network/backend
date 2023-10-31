import { Router } from "express"
import { authenticateToken } from "../middleware/authentificationToken"
const USerRouter = Router()
USerRouter.get('/:id', (req, res) => getByPublicator(req, res))

export { USerRouter }
