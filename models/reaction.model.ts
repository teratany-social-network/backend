import { Schema, model } from "mongoose"

export interface IReaction {
    user: Schema.Types.ObjectId,
    publication: Schema.Types.ObjectId,
    reaction: string,
    date: Date
}

const ReactionSchema = new Schema<IReaction>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'publication'
    },
    reaction: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const ReactionModel = model('reaction', ReactionSchema);
