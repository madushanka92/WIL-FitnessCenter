import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { UserService } from '@/_services/api/user/user.service'
import { useRouter } from 'vue-router'

export const useUserAuthStore = defineStore('userAuth', {
  state: () => ({
    isAuthenticated: !!Cookies.get('token'), // Initialize from cookie
    token: Cookies.get('token') || undefined, // Store access token
    getRefreshToken: Cookies.get('refreshToken') || undefined,
  }),
  actions: {
    setIsAuthenticated(auth: boolean) {
      this.isAuthenticated = auth
      if (!auth) Cookies.remove('token') // Ensure token is removed on logout
    },
    checkAuthFromCookie() {
      this.isAuthenticated = !!Cookies.get('token') // Update state dynamically
    },
    async refreshToken() {
      try {
        const response = await UserService.refreshUserToken() // Your API endpoint

        this.token = response.data.token

        Cookies.set('token', this.token, { secure: true, sameSite: 'Strict' }) // Store new token
      } catch (error) {
        console.error('Failed to refresh token', error)
        this.logout()
      }
    },
    logout() {
      const router = useRouter()
      this.token = ''
      this.setIsAuthenticated(false)
      setTimeout(() => router.push('/'), 100)
      // Redirect to login page or handle logout flow
    },
  },
  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated, // Use state directly
  },
})
