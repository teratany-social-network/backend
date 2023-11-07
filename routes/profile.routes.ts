import { Router } from "express"
import { authenticateToken } from "../middleware/authentificationToken"
import { editLocalisationController, searchController, editPasswordController, editProfileImageController, getProfileByEmailController, getProfileByIdController, getProfileByNameController, getProfileByTokenController, getProfileWithCoordonatesController, passwordRecoveryController, sendRecoveryCodeController, editProfileGeneralController, editCategoriesController, editContactController, createProfileController, toggleFollowController } from "../controllers/profile.controller"

const ProfileRouter = Router()
ProfileRouter.get('/', (req, res) => searchController(req, res))
ProfileRouter.get('/name', (req, res) => getProfileByNameController(req, res))
ProfileRouter.get('/email', (req, res) => getProfileByEmailController(req, res))
ProfileRouter.get('/byToken', authenticateToken, (req, res) => getProfileByTokenController(req, res))
ProfileRouter.get('/withCoordonates', (req, res) => getProfileWithCoordonatesController(req, res))
ProfileRouter.get('/password/recovery', (req, res) => sendRecoveryCodeController(req, res))
ProfileRouter.get('/:id/:ownId', (req, res) => getProfileByIdController(req, res))

ProfileRouter.post('/follow', (req, res) => toggleFollowController(req, res))

ProfileRouter.patch('/password/recovery', (req, res) => passwordRecoveryController(req, res))
ProfileRouter.patch('/image', authenticateToken, (req, res) => editProfileImageController(req, res))
ProfileRouter.patch('/password', authenticateToken, (req, res) => editPasswordController(req, res))
ProfileRouter.patch('/general', authenticateToken, (req, res) => editProfileGeneralController(req, res))
ProfileRouter.patch('/localisation', authenticateToken, (req, res) => editLocalisationController(req, res))
ProfileRouter.patch('/categories', authenticateToken, (req, res) => editCategoriesController(req, res))
ProfileRouter.patch('/contact', authenticateToken, (req, res) => editContactController(req, res))
ProfileRouter.post('/create', authenticateToken, (req, res) => createProfileController(req, res))

export { ProfileRouter }
