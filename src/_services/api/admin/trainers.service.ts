import appConfig from '@/views/app-config';
import ApiService from '../api.service';

ApiService.init(appConfig.VUE_APP_ROOT_API);

const TrainersService = {
  async getAllTrainers() {
    const url = 'trainers'
    return await ApiService.get(url)
  },

  async updateTrainer(id: any, payload: any) {
    const url = 'trainers'
    return await ApiService.put(url, id, payload)
  },

  async deleteTrainer(id: any, payload?: any) {
    const url = 'trainers'
    return await ApiService.delete(url, id)
  },

  async createTrainer(payload: any) {
    const url = 'trainers'
    return await ApiService.post(url, payload)
  },
}

export { TrainersService }