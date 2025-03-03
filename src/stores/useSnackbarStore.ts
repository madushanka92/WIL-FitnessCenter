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
    handleError(error: unknown, defaultMessage: string) {
      const message = (error as any)?.data?.message || defaultMessage
      this.notify(message, 'error')
    },
    showSuccess(message: string) {
      this.notify(message, 'success')
    },
  },
})
