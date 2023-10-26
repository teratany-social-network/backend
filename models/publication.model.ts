import mongoose, { Types, Schema } from 'mongoose';
export interface IPub {
    publicator: Types.ObjectId,
    content: string,
    images: Array<string>,
    date?: Date,
    reaction?: Array<Types.ObjectId>,
    commentaire?: Array<Types.ObjectId>,
}


const PublicationSchema: Schema = new Schema<IPub>({
    publicator: {
        type: Schema.Types.ObjectId,
        ref: 'publicators'
    },
    content: String,
    images: [{
        type: String
    }],
    date: {
        type: Date,
        default: Date.now
    },
    commentaire: [{
        type: Schema.Types.ObjectId,
        ref: 'commentaire'
    }],
    reaction: [{
        type: Schema.Types.ObjectId,
        ref: 'reaction'
    }]
})

export const PublicationModel = mongoose.model('publication', PublicationSchema)

