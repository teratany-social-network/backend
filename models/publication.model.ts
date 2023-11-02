import mongoose, { Types, Schema } from 'mongoose';
export interface IPub {
    profile: Types.ObjectId,
    content: string,
    images: Array<string>,
    date?: Date,
    reactions?: Array<Types.ObjectId>,
    comments?: Array<Types.ObjectId>,
}


const PublicationSchema: Schema = new Schema<IPub>({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profiles'
    },
    content: String,
    images: [{
        type: String
    }],
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],
    reactions: [{
        type: Schema.Types.ObjectId,
        ref: 'reactions'
    }]
})

export const PublicationModel = mongoose.model('publications', PublicationSchema)

