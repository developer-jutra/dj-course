<template>
  <div>
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        Reset your password
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

    <div v-if="!emailSent">
      <form @submit.prevent="handleForgotPassword" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="input"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!loading">Send reset instructions</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/login" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            ← Back to sign in
          </NuxtLink>
        </div>
      </form>
    </div>

    <!-- Success State -->
    <div v-else class="text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
        <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Check your email
      </h3>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        We've sent password reset instructions to <strong>{{ form.email }}</strong>
      </p>
      
      <div class="space-y-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Didn't receive the email? Check your spam folder or
        </p>
        
        <button
          @click="resetForm"
          class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          Try again with a different email
        </button>
        
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <NuxtLink to="/login" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            ← Back to sign in
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { forgotPassword } from './forgot-password-api'
import type { ForgotPasswordFormData } from './forgot-password.model'

interface Emits {
  (e: 'success', message: string): void
  (e: 'error', error: string): void
}

const emit = defineEmits<Emits>()

const loading = ref(false)
const emailSent = ref(false)

const form = reactive<ForgotPasswordFormData>({
  email: ''
})

const handleForgotPassword = async () => {
  loading.value = true
  
  try {
    const result = await forgotPassword(form)
    emailSent.value = true
    emit('success', result.message)
  } catch (error) {
    emit('error', error instanceof Error ? error.message : 'Failed to send reset email')
    console.error('Forgot password failed:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  emailSent.value = false
  form.email = ''
}
</script>
