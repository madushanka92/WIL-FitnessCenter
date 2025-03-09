import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const ClassBookingService = {
  async bookClass(payload: any) {
    const url = 'class-booking'

    return await ApiService.post(url, payload)
  },

  async cancelClassBooking(payload: any) {
    const url = 'class-booking/cancel'

    return await ApiService.post(url, payload)
  },

  async getAllClassForUser() {
    const url = 'class-booking/my-class'

    return await ApiService.get(url)
  },
}

export { ClassBookingService }
