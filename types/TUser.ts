export type TEditProfile = {
    _id: string,
    displayName: string,
    email: string,
    address: {
        value: string,
        isPrivate: boolean
    },
    walletId: {
        value: string,
        isPrivate: boolean
    },
    country: {
        value: string,
        isPrivate: boolean
    },
    coordonates: {
        latitude?: number,
        longitude?: number,
        isPrivate: boolean
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