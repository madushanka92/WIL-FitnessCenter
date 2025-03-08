import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const TestimonialService = {
  // Get all testimonials with optional filter
  async getTestimonials(filter: any) {
    let url = 'viewTestimonials'

    if (filter) {
      if (filter.search) url += '?search=' + filter.search
      if (filter.role) url += '&role=' + filter.role
    }

    return await ApiService.get(url)
  },

  // Get a single testimonial by ID
  async getTestimonial(id: any) {
    const url = `viewTestimonial/${id}`

    return await ApiService.get(url)
  },

  // Create a new testimonial
  async createTestimonial(payload: any) {
    const url = 'createTestimonial'

    return await ApiService.post(url, payload)
  },

  // Update an existing testimonial
  async updateTestimonial(id: any, payload: any) {
    const url = `updateTestimonial`

    return await ApiService.put(url, id, payload)
  },

  // Approve a testimonial
  async approveTestimonial(id: any, payload:any) {
    const url = `approveTestimonial`

    return await ApiService.put(url , id, payload)
  },

  // Delete a testimonial
  async deleteTestimonial(id: any) {
    const url = `removeTestimonial`

    return await ApiService.delete(url, id)
  }
}

export { TestimonialService }
