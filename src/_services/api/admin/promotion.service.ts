import ApiService from '../api.service'
import appConfig from '@/views/app-config'

// Initialize the API service with the app's base URL
ApiService.init(appConfig.VUE_APP_ROOT_API)

const PromotionService = {
  // Create a random promotion
  async createRandomPromotion(percentage: number, expiryDate: string) {
    const url = 'promotion/random'
    const payload = { percentage, expiryDate }

    return await ApiService.post(url, payload)
  },

  // Get all promotions
  async getAllPromotions() {
    const url = 'promotion/displayPromotions'

    return await ApiService.get(url)
  },

  // Get a promotion by ID
  async getPromotionById(id: string) {
    const url = `promotion/${id}`

    return await ApiService.get(url)
  },

  // Update a promotion
  async updatePromotion(id: string, promo_code: string, percentage: number, expiryDate: string, isActive: boolean) {
    const url = `promotion`
    const payload = { promo_code, percentage, expiryDate, isActive }

    return await ApiService.put(url, id, payload)
  },

  // Delete a promotion
  async deletePromotion(id: string) {
    const url = `promotion`

    return await ApiService.delete(url,id)
  },

  // Apply a promotion
  async applyPromotion(promo_code: string) {
    const url = 'promotion/apply'
    const payload = { promo_code }

    return await ApiService.post(url, payload)
  },
}

export { PromotionService }

