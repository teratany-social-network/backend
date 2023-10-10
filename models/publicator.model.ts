import { Schema, Types, ObjectId, model } from "mongoose"

export enum PublicatorType {
    page = "page",
    user = "user"
}

export interface IPublicator {
    _id?: string,
    type: PublicatorType,
    userId?: ObjectId,
    pageId?: ObjectId,
    followers?: Number
}

const PublicatorSchema: Schema = new Schema<IPublicator>({
    type: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'users'
    },
    pageId: {
        type: Types.ObjectId,
        ref: 'pages'
    },
    followers: {
        type: Number,
        default: 0
    }
})

export const PublicatorModel = model<IPublicator>('publicators', PublicatorSchema)