import { Schema, model, ObjectId } from "mongoose"

export interface IUser {
    _id?: string,
    concat: string,
    name: string,
    email: string,
    password: string,
    authType: string,
    account_date: Date,
    role: number,
    image: string,
    recoveryCode: string,
    sendRecoveryCount: number,
    sendRecoveryLastTime: Date,
    admin: Array<String>,
    notification: Array<String>,
    notificationCount: number,
    reaction: Array<String>,
    isVerified: boolean,
    job: Array<String>,
    publicator?: ObjectId,
    status: string,
    address: {
        value: string,
        isPublic: boolean,
    },
    country: {
        value: string,
        isPublic: boolean,
    },
    walletId: {
        value: string,
        isPublic: boolean,
    },
    coordonates: {
        longitude: Number,
        latitude: Number,
        isPublic: boolean
    },

}


export enum AuthTypes {
    classic = "classic",
    facebook = "facebook",
    google = "google",
    metamask = "metamask"
}


const UserSchema: Schema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        value: {
            type: String,
            default: '',
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    },
    country: {
        value: {
            type: String,
            default: '',
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    walletId: {
        value: {
            type: String,
            default: '',
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    },
    authType: String,
    status: String,
    account_date: {
        type: Date,
        default: Date.now()
    },
    concat: String,
    role: {
        type: Number,
        default: 1
    },
    image: {
        type: String,
        default: "https://api.teratany.org/file/public/defaultImage.png"
    },
    recoveryCode: String,
    sendRecoveryCount: Number,
    sendRecoveryLastTime: Date,
    notification: Array<String>,
    notificationCount: Number,
    reaction: Array<String>,
    isVerified: Boolean,
    job: Array<String>,
    coordonates: {
        longitude: {
            type: Number,
            default: 0
        },
        latitude: {
            type: Number,
            default: 0
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    },
    publicator: {
        type: Schema.Types.ObjectId,
        ref: 'publicators'
    }
})

export const UserModel = model('users', UserSchema)