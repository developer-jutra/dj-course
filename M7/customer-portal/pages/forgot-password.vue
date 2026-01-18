<template>
  <ForgotPassword
    @success="handleForgotPasswordSuccess"
    @error="handleForgotPasswordError"
  />
</template>

<script setup lang="ts">
import ForgotPassword from '~/features/auth/forgot-password/ForgotPassword.vue'

const handleForgotPasswordSuccess = (message: string) => {
  console.log('Password reset email sent:', message)
  // You could add a toast notification here
}

const handleForgotPasswordError = (error: string) => {
  console.error('Forgot password error:', error)
  // You could add a toast notification here
}

definePageMeta({
  layout: 'auth'
})
</script> 