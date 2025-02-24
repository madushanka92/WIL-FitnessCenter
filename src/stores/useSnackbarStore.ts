import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    message: '',
    color: 'success', // success, error, warning, info
    timeout: 3000,
    show: false,
  }),
  actions: {
    notify(message: string, color: string = 'success', timeout: number = 3000) {
      this.message = message
      this.color = color
      this.timeout = timeout
      this.show = true
    },
  },
})
