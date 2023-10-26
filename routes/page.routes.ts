import { Router } from "express"
import { checkIfWalletExistController, createPageController, getAdministratorListController, getAdministredPageListController, getPageByIdController, updateAddressController, updateCategoryController, updateContactController, updateCoordonatesController, updateDescriptionController, updateNameController, updateProfilePictureController, updatedeviantWalletIDController } from "../controllers/pages.controller"
import { searchController } from "../controllers/user.controller"
import { authenticateToken } from "../middleware/authentificationToken"
const PageRouter = Router()
PageRouter.get('/id/:id', (req, res) => getPageByIdController(req, res))
PageRouter.get('/checkWallet/:wallet', (req, res) => checkIfWalletExistController(req, res))
PageRouter.get('/search', (req, res) => searchController(req, res))
PageRouter.get('/administred/:userId', (req, res) => getAdministredPageListController(req, res))
PageRouter.get('/administrator/:pageId', (req, res) => getAdministratorListController(req, res))

PageRouter.patch('/profilePicture', authenticateToken, (req, res) => updateProfilePictureController(req, res))
PageRouter.patch('/name', authenticateToken, (req, res) => updateNameController(req, res))
PageRouter.patch('/description', authenticateToken, (req, res) => updateDescriptionController(req, res))
PageRouter.patch('/category', authenticateToken, (req, res) => updateCategoryController(req, res))
PageRouter.patch('/address', authenticateToken, (req, res) => updateAddressController(req, res))
PageRouter.patch('/contact', authenticateToken, (req, res) => updateContactController(req, res))
PageRouter.patch('/walletId', authenticateToken, (req, res) => updatedeviantWalletIDController(req, res))
PageRouter.patch('/coordonates', authenticateToken, (req, res) => updateCoordonatesController(req, res))

PageRouter.post('/', (req, res) => createPageController(req, res))

export { PageRouter }
