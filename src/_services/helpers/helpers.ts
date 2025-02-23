import Cookies from 'js-cookie'
import { isTokenExpired, isUserAdmin } from './tokenDecoder'

export function getToken(): string | null {
  return Cookies.get('token') || null
}

export function isCurrentUserAdmin(): boolean {
  return isUserAdmin(getToken() ?? '')
}

export function isCurrentTokenExpired(): boolean {
  return isTokenExpired(getToken() ?? '')
}
