import { Schema, model } from "mongoose"

export interface IReaction {
    user: Schema.Types.ObjectId,
    reaction: string,
    date: Date
}

const ReactionSchema = new Schema<IReaction>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
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
