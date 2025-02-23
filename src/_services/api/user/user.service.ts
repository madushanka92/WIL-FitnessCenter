import appConfig from '@/views/app-config'
import ApiService from '../api.service'

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
}

export { UserService }
