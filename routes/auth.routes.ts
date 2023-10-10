import { Router } from "express"
import { checkEmailController, checkUsernameController, sendEmailController, signupController, verifyEmailController } from "../controllers/auth.controller"
const AuthRouter = Router()


/**
 * @swagger
 * /user/authentication/verifyEmail:
 *   post:
 *     summary: Permet de verifier qu'un utilisateur est bel et bien le propriétaire de l'email 
 *     description: un email a été envoyé à l'utilisateur contenat le code de vérification. Pour permettre à l'utilisateur de confirmer que le mail est bel et bien le sien, il doit fournir le mail suivi du code qui lui a été envoyé 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'adresse email a verifier.
 *                 example: example@mail.org
 *               code:
 *                 type: number
 *                 description: Le code de confirmation.
 *                 example: 123456
*             
 *     responses:
 *       200:
 *         description: True si le mail a été vérifié, False sinon
 *       500:
 *         description: Une erreur serveur s'est produite
 */
AuthRouter.post('/verifyEmail', (req, res) => verifyEmailController(req, res))
AuthRouter.post('/register', (req, res) => signupController(req, res))

AuthRouter.get('/checkUsername', (req, res) => checkUsernameController(req, res))
AuthRouter.get('/checkEmail', (req, res) => checkEmailController(req, res))
AuthRouter.get('/sendEmail', (req, res) => sendEmailController(req, res))

export { AuthRouter }
