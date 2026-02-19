<template>
  <div>
    <RegisterAccount 
      @success="handleRegisterSuccess"
      @error="handleRegisterError"
    />
    
    <!-- Success Modal -->
    <SuccessModal
      :show="showSuccessModal"
      title="Account Created Successfully!"
      message="Welcome to Deliveroo Logistics! Your company account has been created and you now have access to our full platform."
      :next-steps="[
        'Complete your company profile in the settings section',
        'Add team members and assign appropriate roles',
        'Start creating transportation and warehousing requests',
        'Set up billing information and payment methods'
      ]"
      :primary-action="{
        label: 'Go to Dashboard',
        action: () => navigateTo('/dashboard')
      }"
      close-label="Complete Profile Later"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup lang="ts">
import RegisterAccount from '~/features/auth/register/RegisterAccount.vue'

const authStore = useAuthStore()
const showSuccessModal = ref(false)

const handleRegisterSuccess = async (data: { user: any; company: any }) => {
  try {
    // Update the auth store with the registration data
    authStore.user = data.user
    authStore.company = data.company
    authStore.isAuthenticated = true
    
    // Save to localStorage only on client side
    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      localStorage.setItem('auth_company', JSON.stringify(data.company))
      localStorage.setItem('auth_isAuthenticated', 'true')
    }
    
    showSuccessModal.value = true
  } catch (error) {
    console.error('Error handling register success:', error)
  }
}

const handleRegisterError = (error: string) => {
  // Handle error (show toast notification or alert)
  console.error('Registration error:', error)
  // You could add a toast notification here
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  navigateTo('/dashboard')
}

definePageMeta({
  layout: 'auth'
})
</script>