import { Request, Response } from "express";
import { getUserById } from "../services/user.services";
import { IUser } from "../models/user.model";
import { ErrorHandler } from "../utils/error";

export const getUserByIdController = async (req: Request, res: Response) => {
    const { id } = req.query
    await getUserById(id?.toString() || "")
        .then((user: IUser) => res.send(user))
        .catch((error: ErrorHandler) => res.status(500).send(error))
}