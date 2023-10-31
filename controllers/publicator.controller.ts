import { Request, Response } from "express";
import { getByPublicator } from "../services/publicator.services";
import { ErrorHandler } from "../utils/error";

export const getByPublicatorController = async (req: Request, res: Response) => {
    await getByPublicator(req.params.id).then((publicator: any) => res.send(publicator))
        .catch((error: ErrorHandler) => res.status(error.code).send(error))
}