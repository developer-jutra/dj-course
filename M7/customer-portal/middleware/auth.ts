export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client-side to ensure auth plugin has initialized
  if (process.server) return
  
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})