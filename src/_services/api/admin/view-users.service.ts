import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const UserViewService = {
  async viewUsers(filter: any) {
    let url = 'viewUsers'
    if (filter) {
      if (filter.search) url += '?search=' + filter.search
    }
    return await ApiService.get(url)
  },

  /*--
  async updateClass(id: any, payload: any) {
    const url = 'users'

    return await ApiService.put(url, id, payload)
  },
--*/
  async deleteUser(id: any, payload?: any) {
    const url = 'removeUser'

    return await ApiService.delete(url, id)
  },
  
}

export { UserViewService }
