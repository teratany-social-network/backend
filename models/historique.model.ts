import { Schema, model } from "mongoose";

export interface IHistorique {
    _id?: Schema.Types.ObjectId,
    owner: Schema.Types.ObjectId,
    profileId?: string,
    pictureUrl?: string,
    text?: string,
    date?: Date
}
const HistoriqueSchema = new Schema<IHistorique>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'profiles'
    },
    profileId: {
        type: String,
    },
    pictureUrl: {
        type: String,
    },
    text: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

export const HistoriqueModel = model('Historiques', HistoriqueSchema)
