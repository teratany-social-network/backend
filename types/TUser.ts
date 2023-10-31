export type TEditProfile = {
    _id: string,
    displayName: string,
    email: string,
    address: {
        value: string,
        isPublic: boolean
    },
    walletId: {
        value: string,
        isPublic: boolean
    },
    country: {
        value: string,
        isPublic: boolean
    },
    coordonates: {
        latitude?: number,
        longitude?: number,
        isPublic: boolean
    }
}

export type TPrivateInfo = {
    coordonates: boolean,
    address: boolean,
    country: boolean,
    walletId: boolean,
}

export type TCoordonates = {
    longitude: number,
    latitude: number,
}