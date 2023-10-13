import jwtDecode from 'jwt-decode'

export function decodeAuthorization(token: string): any {
    if (token.includes("Bearer")) token = token.split(" ")[1]
    try { return jwtDecode(token) }
    catch { throw new Error(`Le token n'est pas un token JWT valide`) }
}