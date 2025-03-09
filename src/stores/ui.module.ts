import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    showOverLay: false,
    confirmationTitle: '' as string,
    confirmationMsg: '' as string,
    isConfirmVisible: false,
    confirmCallBack: null as unknown as () => Promise<void>,
  }),
  actions: {
    setShowOverLay(show: boolean) {
      this.showOverLay = show
    },
    showConfirmation(title: string, msg: string, callBack: () => Promise<void>) {
      this.isConfirmVisible = true
      this.confirmationTitle = title
      this.confirmationMsg = msg
      this.confirmCallBack = callBack
    },
    async confirmRequest() {
      if (this.confirmCallBack) {
        await this.confirmCallBack()
      }
      this.cancelConfirm()
    },
    cancelConfirm() {
      this.isConfirmVisible = false
      this.confirmationTitle = ''
      this.confirmationMsg = ''
      this.confirmCallBack = async () => {}
    },
  },
  getters: {
    getShowOverLay: (state) => state.showOverLay,
    getConfirmationTitle: (state) => state.confirmationTitle,
    getConfirmationMsg: (state) => state.confirmationMsg,
    getIsConfirmVisible: (state) => state.isConfirmVisible,
  },
})
