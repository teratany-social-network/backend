import { Request, Response } from "express"
import { IHistorique } from "../models/historique.model"
import { addToHistory, getHistoriques, removeFromHistoriques } from "../services/historique.services"
import { ErrorHandler } from "../utils/error"

export const addToHistoryController = async (req: Request, res: Response) => {
    const historique = req.body as IHistorique
    addToHistory(historique)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error.description))
}

export const removeFromHistoriquesController = async (req: Request, res: Response) => {
    const { id } = req.params
    removeFromHistoriques(id)
        .then(() => res.send('ok'))
        .catch((error: ErrorHandler) => res.status(error.code).send(error.description))
}

export const getHistoriquesController = async (req: Request, res: Response) => {
    const { id } = req.params
    getHistoriques(id)
        .then((historique) => res.send(historique))
        .catch((error: ErrorHandler) => res.status(error.code).send(error.description))
}