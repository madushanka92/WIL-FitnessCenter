import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp?: number
  role?: string
  _id: any
  membership_id: any
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

export function decodeUserId(token: string) {
  return decodeToken(token)?._id
}

export function isUseraMember(token: string) {
  return decodeToken(token)?.membership_id
}

export function isUserTrainer(token: string): boolean {
  return decodeToken(token)?.role === 'trainer'
}
