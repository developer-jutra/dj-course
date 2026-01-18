<template>
  <footer class="bg-gray-800 dark:bg-black">
    <div class="mx-auto max-w-7xl overflow-hidden py-12 px-6 lg:px-8">
      <nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
        <div class="px-5 py-2">
          <NuxtLink to="/quote" class="text-base text-gray-400 hover:text-white">Get a Quote</NuxtLink>
        </div>
        <div class="px-5 py-2">
          <NuxtLink to="/case-studies" class="text-base text-gray-400 hover:text-white">Success Stories</NuxtLink>
        </div>
        <div class="px-5 py-2">
          <NuxtLink to="/#contact" class="text-base text-gray-400 hover:text-white">Contact Us</NuxtLink>
        </div>
        <div class="px-5 py-2">
          <NuxtLink to="/login" class="text-base text-gray-400 hover:text-white">Client Login</NuxtLink>
        </div>
      </nav>
      <div class="mt-8 flex justify-center">
        <AppLogo />
      </div>
      <p class="mt-8 text-center text-base text-gray-400">&copy; 2023 Deliveroo. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Explicit import for AppLogo
import AppLogo from '~/components/layout/AppLogo.vue'
</script>