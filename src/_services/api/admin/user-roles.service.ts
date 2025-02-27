import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const UserRolesService = {
  async getAllRoles() {
    const url = 'user-roles'

    return await ApiService.get(url)
  },

  async updateRole(id: any, payload: any) {
    const url = 'user-roles'

    return await ApiService.put(url, id, payload)
  },

  async deleteRole(id: any, payload?: any) {
    const url = 'user-roles'

    return await ApiService.delete(url, id)
  },

  async createRole(payload: any) {
    const url = 'user-roles'

    return await ApiService.post(url, payload)
  },
}

export { UserRolesService }
