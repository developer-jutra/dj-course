import { defineStore } from 'pinia'
import { login } from '~/features/auth/signin/signin-api'
import { register } from '~/features/auth/register/register-api'
import type { User, Company } from '~/features/auth/signin/signin.model'

interface AuthState {
  user: User | null
  company: Company | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    company: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    userRole: (state) => state.user?.role,
    hasPermission: (state) => (permission: string) => {
      return state.user?.permissions.includes(permission as any) || false
    },
    isCompanyAdmin: (state) => state.user?.role === 'COMPANY_ADMIN',
    isEmployee: (state) => state.user?.role === 'EMPLOYEE'
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true
      try {
        const { user, company } = await login(credentials)
        
        this.user = user
        this.company = company
        this.isAuthenticated = true
        
        // Save to localStorage only on client side
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(this.user))
          localStorage.setItem('auth_company', JSON.stringify(this.company))
          localStorage.setItem('auth_isAuthenticated', 'true')
        }
        
        // Redirect to dashboard
        await navigateTo('/dashboard')
      } catch (error) {
        throw new Error('Invalid credentials')
      } finally {
        this.loading = false
      }
    },

    async register(data: any) {
      this.loading = true
      try {
        const { user, company } = await register(data)
        
        this.user = user
        this.company = company
        this.isAuthenticated = true
        
        // Save to localStorage only on client side
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(this.user))
          localStorage.setItem('auth_company', JSON.stringify(this.company))
          localStorage.setItem('auth_isAuthenticated', 'true')
        }
      } catch (error) {
        throw new Error('Registration failed')
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.company = null
      this.isAuthenticated = false
      
      // Clear localStorage only on client side
      if (process.client) {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_company')
        localStorage.removeItem('auth_isAuthenticated')
      }
      
      await navigateTo('/login')
    },

    async initializeAuth() {
      // Restore auth state from localStorage on client side
      if (process.client) {
        const user = localStorage.getItem('auth_user')
        const company = localStorage.getItem('auth_company')
        const isAuthenticated = localStorage.getItem('auth_isAuthenticated')
        
        if (user && company && isAuthenticated === 'true') {
          this.user = JSON.parse(user)
          this.company = JSON.parse(company)
          this.isAuthenticated = true
        }
      }
    }
  }
})