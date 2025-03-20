import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const MembershipService = {
  async getAll() {
    const url = 'memberships/all'
    return await ApiService.get(url)
  },

  async create(payload: any) {
    const url = 'memberships/create'
    return await ApiService.post(url, payload)
  },

  async update(id: any, payload: any) {
    const url = 'memberships/update'
    return await ApiService.put(url, id, payload)
  },

  async delete(id: any) {
    const url = 'memberships/delete'
    return await ApiService.delete(url, id)
  },
}

export { MembershipService }
