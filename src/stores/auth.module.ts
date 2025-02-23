import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useUserAuthStore = defineStore('userAuth', {
  state: () => ({
    isAuthenticated: !!Cookies.get('token'), // Initialize from cookie
  }),
  actions: {
    setIsAuthenticated(auth: boolean) {
      this.isAuthenticated = auth
      if (!auth) Cookies.remove('token') // Ensure token is removed on logout
    },
    checkAuthFromCookie() {
      this.isAuthenticated = !!Cookies.get('token') // Update state dynamically
    },
  },
  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated, // Use state directly
  },
})
