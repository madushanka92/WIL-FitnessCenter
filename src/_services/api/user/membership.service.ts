import appConfig from '@/views/app-config'
import ApiService from '../api.service'

ApiService.init(appConfig.VUE_APP_ROOT_API)

const MembershipService = {
  async getAllMemberships(filter?: any) {
    let url = 'memberships/all'
    if (filter) {
      if (filter.search) url += '?search=' + filter.search
    }
    return await ApiService.get(url)
  },

  async getMemberShipInfo() {
    const url = 'memberships/get-user-membership'

    return await ApiService.get(url)
  },
}

export { MembershipService }
