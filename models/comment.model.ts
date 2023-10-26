import { Schema, model } from "mongoose";


export interface IComment {
    user: Schema.Types.ObjectId,
    publication: Schema.Types.ObjectId,
    content: string,
    date: Date
}
const CommentaireSchema = new Schema<IComment>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'publication'
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

const CommentaireModel = model('commentaire', CommentaireSchema)

module.exports = { CommentaireModel }