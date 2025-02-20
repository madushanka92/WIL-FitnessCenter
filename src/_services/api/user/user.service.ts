import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const UserService = {
  async userSignUp(user: any) {
    const payload = user
    const url = 'auth/register'

    return await ApiService.post(url, payload)
  },
}

export { UserService }
