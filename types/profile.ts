export enum ProfileAccountStatus {
    pending = "pending",
    active = "active",
    locked = "locked"
}
export enum ProfileType {
    pending = "user",
    active = "association",
    locked = "entreprise"
}
export interface IConfirmation {
    recoveryCode: string,
    sendRecoveryCount: number,
    sendRecoveryLastTime: Date,
    accountStatus: ProfileAccountStatus
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