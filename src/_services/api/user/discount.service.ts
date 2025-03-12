import appConfig from '@/views/app-config'
import ApiService from '../api.service'
import Cookies from 'js-cookie'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const DiscountService = {

  async getAllDiscounts() {
    const url = "promotion/displayPromotions";

    return await ApiService.get(url);
  }
}

export { DiscountService }

