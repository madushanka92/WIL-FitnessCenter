import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const PaymentService = {
  async createPayment(user: any) {
    const payload = user
    const url = 'payment'

    return await ApiService.post(url, payload)
  },

  async updateMembershipPayment(payload: any) {
    const url = 'payment/membership'

    return await ApiService.post(url, payload)
  },

  async getPaymentsForUser() {
    const url = 'payment/for-user'
    return await ApiService.get(url)
  },
}

export { PaymentService }
