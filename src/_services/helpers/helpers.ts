import Cookies from 'js-cookie'
import { decodeUserId, isTokenExpired, isUserAdmin, isUseraMember } from './tokenDecoder'

export function getToken(): string | null {
  return Cookies.get('token') || null
}

export function isCurrentUserAdmin(): boolean {
  return isUserAdmin(getToken() ?? '')
}

export function isCurrentTokenExpired(): boolean {
  return isTokenExpired(getToken() ?? '')
}

export function getUserID() {
  return decodeUserId(getToken() ?? '')
}

export function getUserMembership() {
  return isUseraMember(getToken() ?? '')
}
