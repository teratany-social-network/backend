import { checkEmail, checkUsername, sendEmail, signup, verifyEmail } from "../services/authentication.services"
import { Request, Response } from "express"
import { ErrorHandler } from "../utils/error"
import { TSendEmail, TSignup } from "../types/TAuthentication"

export const checkUsernameController = async (req: Request, res: Response) => {
    const { username } = req.body
    checkUsername(username)
        .then((response: Boolean) => res.send(response))
        .catch((error: ErrorHandler) => res.status(400).send({ error }))
}

export const checkEmailController = async (req: Request, res: Response) => {
    const { email } = req.body
    checkEmail(email)
        .then((response: Boolean) => res.send(response))
        .catch((error: ErrorHandler) => res.status(400).send({ error }))
}

export const sendEmailController = async (req: Request, res: Response) => {
    const { email } = req.body
    sendEmail(email)
        .then((response: TSendEmail) => res.send(response))
        .catch((error: ErrorHandler) => res.status(400).send({ error }))
}

export const verifyEmailController = async (req: Request, res: Response) => {
    const { email, code } = req.body
    await verifyEmail(email, code)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(400).send({ error }))
}

export const signupController = async (req: Request, res: Response) => {
    signup(req.body as TSignup)
        .then((token: String | void) => res.send(token))
        .catch((error: ErrorHandler) => res.status(400).send({ error }))
} 