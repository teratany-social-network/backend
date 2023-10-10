export type TEditProfile = {
    _id: string,
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    address: {
        value: string,
        isPrivate: boolean
    },
    walletId: {
        value: string,
        isPrivate: boolean
    }
}