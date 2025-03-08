import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const PaymentService = {
  async createPayment(user: any) {
    const payload = user
    const url = 'payment'

    return await ApiService.post(url, payload)
  },
}

export { PaymentService }
