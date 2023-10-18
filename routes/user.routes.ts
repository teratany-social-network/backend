import { Router } from "express"
import { editPasswordeController, editProfileController, editProfileImageController, getUserByEmailController, getUserByIdController, getUserByNameController, getUserByTokenController, getUserWithCoordonatesController, passwordRecoveryController, searchController, sendRecoveryCodeController } from "../controllers/user.controller"
const USerRouter = Router()
USerRouter.get('/', (req, res) => searchController(req, res))
USerRouter.get('/displayName', (req, res) => getUserByNameController(req, res))
USerRouter.get('/email', (req, res) => getUserByEmailController(req, res))
USerRouter.get('/byToken', (req, res) => getUserByTokenController(req, res))
USerRouter.get('/withCoordonates', (req, res) => getUserWithCoordonatesController(req, res))
USerRouter.get('/password/recovery', (req, res) => sendRecoveryCodeController(req, res))
USerRouter.get('/:id', (req, res) => getUserByIdController(req, res))

USerRouter.patch('/profileImage', (req, res) => editProfileImageController(req, res))
USerRouter.patch('/password', (req, res) => editPasswordeController(req, res))
USerRouter.patch('/password/recovery', (req, res) => passwordRecoveryController(req, res))
USerRouter.patch('/profile', (req, res) => editProfileController(req, res))

export { USerRouter }
