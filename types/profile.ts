export enum ProfileType {
    pending = "user",
    active = "association",
    locked = "entreprise"
}
export interface IConfirmation {
    recoveryCode: string,
    sendRecoveryCount: number,
    sendRecoveryLastTime: Date,
    accountStatus: string
}
export interface ILocalisation {
    address: {
        value: string,
        isPublic: boolean,
    },
    country: {
        value: string,
        isPublic: boolean,
    },
    coordonates: {
        longitude: Number,
        latitude: Number,
        isPublic: boolean
    }
}

export interface IContact {
    phone: string,
    website: string,
    email: string
}

export interface ICreateProfile {
    name: string,
    description: string,
    categories: string,
    profileType: string,
    localisation: {
        address: {
            value: string,
            isPublic: boolean,
        },
        country: {
            value: string,
            isPublic: boolean,
        },
        coordonates: {
            longitude: Number,
            latitude: Number,
            isPublic: boolean
        }
    },
    contact: {
        phone: string,
        website: string,
        email: string
    },
    admins?: string[]
}