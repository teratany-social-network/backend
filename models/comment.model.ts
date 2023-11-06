import { Schema, model } from "mongoose";
import { PublicationModel } from "./publication.model";


export interface IComment {
    _id?: Schema.Types.ObjectId,
    profile: Schema.Types.ObjectId,
    content: string,
    date: Date
}
const CommentSchema = new Schema<IComment>({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profiles'
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})



export const CommentModel = model('comments', CommentSchema)
