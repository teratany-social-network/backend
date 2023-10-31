import { PublicatorModel } from "../models/publicator.model";
import { ErrorHandler } from "../utils/error";

export const getByPublicator = async (id: string): Promise<any> => {
    const publicator = await PublicatorModel.findById(id)
        .populate(
            [
                {
                    path: 'publications',
                    populate: [
                        { path: 'commentaires', populate: 'user' },
                        { path: 'reactions', populate: 'user' }
                    ]
                },
                { path: 'userId', select: 'displayName email account_date image address country walletId coordonates' },
                { path: 'pageId' }
            ]
        )
    if (publicator) return publicator
    else throw new ErrorHandler("Ce profile n'existe pas", 404, new Error)
}