import { ObjectId } from 'mongoose';
export enum Roles {
    owner = 2,
    admin = 1,
    none = 0
}

export enum PageType {
    association = "association",
    entreprise = "entreprise"
}
export interface IPageGeneral {
    email: string;
    phoneNumber: string;
    website: string;
    name: string;
    coordonates: {
        latitude: number,
        longitude: number
    }; // [latitude, longitude]
    description: string; // about the page
    address: string;
    country: string;
    deviantWalletID: string; // deviantcoin wallet ID, must be unique and must exist
    pageType: string; // association or entreprise
    category: string; // RSE if the pageType is entreprise and SDG if the page is an association
}

export interface IPage {
    _id?: string;
    email: string;
    phoneNumber: string;
    website: string;
    name: string;
    coordonates: {
        latitude: number,
        longitude: number

    }; // [latitude, longitude]
    image?: string; // profil picture filename
    description: string; // about the page
    followers?: number; // number of follower
    address: string;
    country: string;
    deviantWalletID: string; // deviantcoin wallet ID, must be unique and must exist
    posts: string[]; // list of the page posts
    admins: string[]; // list of admin and page collection
    pageType: string; // association or entreprise
    category: string; // RSE if the pageType is entreprise and SDG if the page is an association
    adminAndPage: ObjectId[],
    publicator: ObjectId
}

export interface IAdminAndPage {
    admin: ObjectId[];
    page: ObjectId[];
    role: Roles;
    date: Date;
}

import mongoose, { Schema, Types } from "mongoose";

const PageSchema: Schema = new Schema({
    name: String,
    image: String,
    description: String,
    category: String,
    address: String,
    country: String,
    email: String,
    phoneNumber: String,
    website: String,
    deviantWalletID: String,
    coordonates: {
        longitude: Number,
        latitude: Number,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publication'
    }],
    pageType: { default: "association", type: String },
    publicator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'publicators'
    }
})

const AdminAndPageSchema: Schema = new Schema({
    admin: { required: true, type: Types.ObjectId, ref: 'users' },
    page: { required: true, type: Types.ObjectId, ref: 'pages' },
    role: { required: true, type: Number },
    date: { type: Date, default: Date.now() }
})

export const PageModel = mongoose.model('pages', PageSchema)
export const AdminAndPageModel = mongoose.model('adminAndPages', AdminAndPageSchema)