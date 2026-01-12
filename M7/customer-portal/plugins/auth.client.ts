export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage before any navigation
  authStore.initializeAuth()
}) 