import { Schema, model } from "mongoose"

export interface IReaction {
    profile: Schema.Types.ObjectId,
    reaction: string,
    date: Date
}

const ReactionSchema = new Schema<IReaction>({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profiles'
    },
    reaction: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const ReactionModel = model('reactions', ReactionSchema);
