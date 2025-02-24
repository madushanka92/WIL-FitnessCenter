import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp?: number
  role?: string
}

function decodeToken(token: string | null): DecodedToken | null {
  if (!token) return null
  try {
    return jwtDecode<DecodedToken>(token)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  return !decoded?.exp || decoded.exp * 1000 < Date.now()
}

export function isUserAdmin(token: string): boolean {
  return decodeToken(token)?.role === 'admin'
}
