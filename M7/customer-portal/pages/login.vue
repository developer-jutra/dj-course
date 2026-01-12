<template>
  <SignIn 
    @success="handleLoginSuccess"
    @error="handleLoginError"
  />
</template>

<script setup lang="ts">
import SignIn from '~/features/auth/signin/SignIn.vue'

const authStore = useAuthStore()

const handleLoginSuccess = async (data: { user: any; company: any }) => {
  try {
    // Update the auth store with the login data
    authStore.user = data.user
    authStore.company = data.company
    authStore.isAuthenticated = true
    
    // Save to localStorage only on client side
    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      localStorage.setItem('auth_company', JSON.stringify(data.company))
      localStorage.setItem('auth_isAuthenticated', 'true')
    }
    
    // Redirect to dashboard
    await navigateTo('/dashboard')
  } catch (error) {
    console.error('Error handling login success:', error)
  }
}

const handleLoginError = (error: string) => {
  // Handle error (show toast notification or alert)
  console.error('Login error:', error)
  // You could add a toast notification here
}

definePageMeta({
  layout: 'auth'
})
</script>