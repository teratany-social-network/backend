import { checkEmail, checkName, sendEmail, signin, signup, verifyEmail } from "../services/authentication.services"
import { Request, Response } from "express"
import { ErrorHandler } from "../utils/error"
import { TSendEmail, TSignup } from "../types/TAuthentication"

export const checkNameController = async (req: Request, res: Response) => {
    const { name } = req.query
    checkName(name?.toString() || "")
        .then((response: Boolean) => res.send(response))
        .catch((error: ErrorHandler) => res.status(error.code).send({ error }))
}

export const checkEmailController = async (req: Request, res: Response) => {
    const { email } = req.query
    checkEmail(email?.toString() || "")
        .then((response: Boolean) => res.send(response))
        .catch((error: ErrorHandler) => res.status(error.code).send({ error }))
}

export const sendEmailController = async (req: Request, res: Response) => {
    const { email } = req.body
    sendEmail(email)
        .then((response: TSendEmail) => res.send(response))
        .catch((error: ErrorHandler) => res.status(error.code).send({ error }))
}

export const verifyEmailController = async (req: Request, res: Response) => {
    const { email, code } = req.body
    await verifyEmail(email, code)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send({ error }))
}

export const signupController = async (req: Request, res: Response) => {
    signup(req.body as TSignup)
        .then((token: String | void) => res.send(token))
        .catch((error: ErrorHandler) => res.status(error.code).send({ error }))
}

export const signinController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    signin(email, password)
        .then((token: String) => res.send(token))
        .catch((error: ErrorHandler) => res.status(error.code).send({ error }))
} 