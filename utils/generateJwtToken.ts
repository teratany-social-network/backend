import Jwt from 'jsonwebtoken'

export function generateToken(id: string, displayName: string, email: string, role: number) {
    const payload: Object = { id, displayName, email, role }
    const token: string = Jwt.sign(payload, process.env.SECRET || '', { expiresIn: '100000m' })
    return token
}