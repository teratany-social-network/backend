import { HistoriqueModel, IHistorique } from "../models/historique.model"
import { ErrorHandler } from "../utils/error"

export const addToHistory = async (historique: IHistorique) => {
    await HistoriqueModel.findOneAndDelete({text: historique.text})
    await new HistoriqueModel(historique).save()
        .catch((error) => {
            throw new ErrorHandler('Erreur interne lors de l\'ajout de nouveau composant dans l\'historique', 500, error)
        })
}

export const removeFromHistoriques = async (id: string) => {
    await HistoriqueModel.findByIdAndDelete(id)
        .catch((error) => {
            throw new ErrorHandler('Erreur interne lors de la suppression composant dans l\'historique', 500, error)
        })
}

export const getHistoriques = async (owner: string): Promise<IHistorique[]> => {
    const historiques = await HistoriqueModel.find({ owner }).sort({date:-1})
        .catch((error) => {
            throw new ErrorHandler('Impossible d\'avoir l\'historique', 500, error)
        })
    return historiques
}