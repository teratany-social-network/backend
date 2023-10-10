import Jwt from 'jsonwebtoken';

export function generateToken(id: string, username: string, email: string, role: number) {
    const payload: Object = { id, username, email, role }
    const token: string = Jwt.sign(payload, process.env.SECRET || '', { expiresIn: '100000m' })
    return token;
}