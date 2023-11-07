import { Schema, model, ObjectId, Types } from "mongoose"
import { IContact, ILocalisation, IConfirmation } from "../types/profile"



export interface IProfile {
    _id: ObjectId,
    name: string,
    image: string,
    password: string,
    description: string,
    categories: string,
    deviantWalletId: string,
    newNotificationCount: number,
    profileType: string,
    confirmation: IConfirmation,
    localisation: ILocalisation,
    contact: IContact,
    administratedProfiles: ObjectId[],
    admins: ObjectId[],
    notifications: ObjectId[],
    publications: ObjectId[],
    following: string[],
    followers: string[],
    role: number
}

const profileSchema = new Schema<IProfile>({
    name: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    password: String,
    description: { type: String, default: '' },
    categories: { type: String, default: '' },
    deviantWalletId: { type: String, default: '' },
    newNotificationCount: { type: Number, default: 0 },
    role: { type: Number, default: 0 },
    profileType: { type: String, default: 'user' },
    confirmation: {
        recoveryCode: { type: String, default: '' },
        sendRecoveryCount: Number,
        sendRecoveryLastTime: Date,
        accountStatus: String
    },
    localisation: {
        address: {
            value: { type: String, default: '' },
            isPublic: { type: Boolean, default: true },
        },
        country: {
            value: { type: String, default: '' },
            isPublic: { type: Boolean, default: true },
        },
        coordonates: {
            longitude: { type: Number, default: 0 },
            latitude: { type: Number, default: 0 },
            isPublic: { type: Boolean, default: true }
        }
    },
    contact: {
        phone: { type: String, default: '' },
        website: { type: String, default: '' },
        email: { type: String, default: '', unique: true }
    },
    administratedProfiles: [{
        type: Types.ObjectId,
        ref: 'profiles'
    }],
    admins: [{
        type: Types.ObjectId,
        ref: 'profiles'
    }],
    publications: [{
        type: Types.ObjectId,
        ref: 'publications'
    }],
    notifications: [{
        type: Types.ObjectId,
        ref: 'notifications'
    }],
    following: [{
        type: Types.ObjectId,
        ref: 'profiles'
    }],
    followers: [{
        type: Types.ObjectId,
        ref: 'profiles'
    }]
})

export const ProfileModel = model('profiles', profileSchema)