import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const ClassService = {
  async getAllClass(filter: any) {
    let url = 'class'
    let queryParams = []

    if (filter) {
      if (filter.search) queryParams.push('search=' + filter.search)
      if (filter.start_time) queryParams.push('start_time=' + filter.start_time)
    }

    if (queryParams.length) {
      url += '?' + queryParams.join('&')
    }

    return await ApiService.get(url)
  },

  //

  async createClass(payload: any) {
    const url = 'class'

    return await ApiService.post(url, payload)
  },

  async updateClass(id: any, payload: any) {
    const url = 'class'

    return await ApiService.put(url, id, payload)
  },

  async deleteClass(id: any, payload?: any) {
    const url = 'class'

    return await ApiService.delete(url, id)
  },
}

export { ClassService }
