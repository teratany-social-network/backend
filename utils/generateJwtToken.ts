import Jwt from 'jsonwebtoken'

export function generateToken(id: string, name: string, email: string, role: number) {
    const payload: Object = { id, name, email, role }
    const token: string = Jwt.sign(payload, process.env.SECRET || '', { expiresIn: '100000m' })
    return token
}