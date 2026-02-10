<template>
  <div class="card p-8">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Send us a Message
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name *
          </label>
          <input
            v-model="contactForm.firstName"
            type="text"
            required
            class="input"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name *
          </label>
          <input
            v-model="contactForm.lastName"
            type="text"
            required
            class="input"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address *
        </label>
        <input
          v-model="contactForm.email"
          type="email"
          required
          class="input"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Company Name
        </label>
        <input
          v-model="contactForm.company"
          type="text"
          class="input"
          placeholder="Enter your company name"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subject *
        </label>
        <select v-model="contactForm.subject" required class="input">
          <option value="">Select a subject</option>
          <option value="quote">Request a Quote</option>
          <option value="partnership">Partnership Opportunities</option>
          <option value="support">Customer Support</option>
          <option value="general">General Inquiry</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Message *
        </label>
        <textarea
          v-model="contactForm.message"
          rows="4"
          required
          class="input"
          placeholder="Tell us about your logistics needs..."
        ></textarea>
      </div>

      <button type="submit" :disabled="contactLoading" class="w-full btn-primary">
        <span v-if="!contactLoading">Send Message</span>
        <span v-else class="flex items-center justify-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Sending...
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const contactLoading = ref(false)

const contactForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  subject: '',
  message: ''
})

const handleSubmit = async () => {
  contactLoading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('Thank you for your message! We will get back to you within 2 business hours.')

    // Reset form
    Object.keys(contactForm).forEach((key) => {
      // @ts-ignore
      contactForm[key] = ''
    })
  } catch (error) {
    console.error('Contact form submission failed:', error)
    alert('There was an error sending your message. Please try again or contact us directly.')
  } finally {
    contactLoading.value = false
  }
}
</script>
