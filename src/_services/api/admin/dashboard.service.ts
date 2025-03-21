import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const DashboardService = {
  async getStats() {
    const url = 'dashboard/stats'
    return await ApiService.get(url)
  },

  async getPaymentBreakdown() {
    const url = 'dashboard/payment-breakdown'
    return await ApiService.get(url)
  },
}

export { DashboardService }
