import { Request, Response, NextFunction } from 'express'

export const verifyRequestBody = (body: Record<string, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let list: string = ''
        let isMissing: boolean = false
        for (const prop in body) {
            if (!body.hasOwnProperty(prop) || body[prop] === undefined || body[prop] === null) {
                isMissing = true
                list += `${prop},`
            }
        }
        if (isMissing) return res.status(400).json({ error: `Les propriétés suivantes doivent être fournies dans le corps de la requête : ${list}` })
        next()
    }
}
