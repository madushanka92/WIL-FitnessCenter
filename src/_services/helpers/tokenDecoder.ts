import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
}

export function isTokenExpired(token: string): boolean {
  if (!token) return true
  const decoded: DecodedToken = jwtDecode(token)
  return decoded.exp * 1000 < Date.now() // Convert to milliseconds
}
