import appConfig from '@/views/app-config'
import ApiService from '../api.service'
import Cookies from 'js-cookie'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const UserService = {
  async userSignUp(user: any) {
    const payload = user
    const url = 'auth/register'

    return await ApiService.post(url, payload)
  },

  async emailTokenVerification(token: any) {
    const url = 'auth/verify-email/' + token

    return await ApiService.get(url)
  },

  async resetEmailVerification(token: any, email?: any) {
    const url = 'auth/resend-verify-email/' + token

    return await ApiService.get(url)
  },
  async userLogin(user: any) {
    const payload = user
    const url = 'auth/login'

    return await ApiService.post(url, payload)
  },

  async forGotPassword(email: any) {
    const payload = {
      email: email,
    }
    const url = 'password/request-password-reset'

    return await ApiService.post(url, payload)
  },

  async resetPassword(newPassword: any, token: any) {
    const payload = {
      newPassword: newPassword,
    }
    const url = 'password/reset-password/' + token

    return await ApiService.post(url, payload)
  },

  async refreshUserToken() {
    const payload = {
      refreshToken: `${Cookies.get('refreshToken')}`,
    }

    const url = 'auth/refresh-token'
    return await ApiService.post(url, payload)
  },

  async getAllUsersForTrainer() {
    const url = 'displayusers/for-trainer'

    return await ApiService.get(url)
  },

  async updateUserData(id: any, payload: any) {
    const url = 'user'

    return await ApiService.put(url, id, payload)
  },
}

export { UserService }
