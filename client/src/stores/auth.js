import { defineStore } from 'pinia'
import { getMe, login, logout, signup } from '@/api/auth'
import qsh from '@/utils/queryStateHandler'

export default defineStore('auth', {
  state: () => ({
    loading: false,
    error: null,
    user: null,
    isInitialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    queryStateCleaning() {
      this.loading = false
      this.error = null
    },

    async login(credentials) {
      await qsh(this, async () => {
        const res = await login(credentials)
        this.user = res.data.user
        window.location.reload()
      })
    },

    async logout() {
      await qsh(this, async () => {
        await logout()
        this.$reset()
      })
    },

    async signup(formData) {
      await qsh(this, async () => {
        const res = await signup(formData)
        this.user = res.data.user
        window.location.reload()
      })
    },

    async checkAuth() {
      await qsh(this, async () => {
        try {
          const res = await getMe()
          this.user = res.data.user
        } catch (_err) {
          this.user = null
        } finally {
          this.isInitialized = true // initialization de l'authStore terminé (nécessaire pour le route guard)
        }
      })
    },
  },
})
