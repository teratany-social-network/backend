import mongoose, { Types, Schema } from 'mongoose';
export interface IPub {
    publicator: Types.ObjectId,
    content: string,
    images: Array<string>,
    date?: Date,
    reactions?: Array<Types.ObjectId>,
    commentaires?: Array<Types.ObjectId>,
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
    commentaires: [{
        type: Schema.Types.ObjectId,
        ref: 'commentaires'
    }],
    reactions: [{
        type: Schema.Types.ObjectId,
        ref: 'reactions'
    }]
})

export const PublicationModel = mongoose.model('publications', PublicationSchema)

