import { Router } from "express"
import { checkEmailController, sendEmailController, checkNameController, signupController, verifyEmailController } from "../controllers/auth.controller"
const AuthRouter = Router()
AuthRouter.post('/verifyEmail', (req, res) => verifyEmailController(req, res))
AuthRouter.post('/signup', (req, res) => signupController(req, res))
AuthRouter.get('/checkName', (req, res) => checkNameController(req, res))
AuthRouter.get('/checkEmail', (req, res) => checkEmailController(req, res))
AuthRouter.get('/sendEmail', (req, res) => sendEmailController(req, res))
AuthRouter.get('/signin', (req, res) => signupController(req, res))

export { AuthRouter }
