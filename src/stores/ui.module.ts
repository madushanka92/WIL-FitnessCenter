import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    showOverLay: false,
  }),
  actions: {
    setShowOverLay(show: boolean) {
      this.showOverLay = show
    },
  },
  getters: {
    getShowOverLay: (state) => state.showOverLay,
  },
})
