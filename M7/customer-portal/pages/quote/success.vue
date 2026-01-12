<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-success-100 dark:bg-success-900">
          <CheckCircleIcon class="h-12 w-12 text-success-600 dark:text-success-400" />
        </div>
        
        <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Quote Request Submitted
        </h2>
        
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Reference #QR{{ Date.now().toString().slice(-6) }}
        </p>
      </div>
      
      <div class="text-left bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          What happens next?
        </h3>
        
        <ul class="space-y-3">
          <li class="flex items-start">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 text-xs font-medium text-primary-600 dark:text-primary-400">
                1
              </div>
            </div>
            <p class="ml-3 text-sm text-gray-600 dark:text-gray-300">
              Our team will review your requirements within 2 business hours
            </p>
          </li>
          
          <li class="flex items-start">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 text-xs font-medium text-primary-600 dark:text-primary-400">
                2
              </div>
            </div>
            <p class="ml-3 text-sm text-gray-600 dark:text-gray-300">
              We'll contact you to discuss your specific needs and provide a detailed quote
            </p>
          </li>
          
          <li class="flex items-start">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 text-xs font-medium text-primary-600 dark:text-primary-400">
                3
              </div>
            </div>
            <p class="ml-3 text-sm text-gray-600 dark:text-gray-300">
              Upon approval, we'll schedule your service and provide tracking information
            </p>
          </li>
        </ul>
      </div>
      
      <div class="space-y-3">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Need immediate assistance?
        </div>
        
        <div class="space-y-2">
          <a
            href="tel:+48123456789"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            📞 +48 123 456 789
          </a>
          
          <a
            href="mailto:contact@deliveroo.pl"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ✉️ contact@deliveroo.pl
          </a>
        </div>
      </div>
      
      <div class="pt-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Return to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

definePageMeta({
  layout: 'default'
})
</script>