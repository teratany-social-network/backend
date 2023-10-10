import Jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express'
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        let token: string
        if (authHeader.includes("Bearer")) token = authHeader.split(" ")[1]
        else token = authHeader
        try {
            const payload = Jwt.verify(token, process.env.SECRET || '')
        } catch (error) {
            res.status(401).send("Your token is not valid, please signin again.")
            return
        }
    } else {
        res.status(401).send("It looks like you need to log in or authenticate to access this feature. Please log in or signup.")
        return
    }
    next()
}

