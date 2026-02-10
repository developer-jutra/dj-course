<template>
  <header class="bg-transparent absolute top-0 left-0 right-0 z-10">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <div class="flex items-center">
          <NuxtLink to="/">
            <AppLogo />
          </NuxtLink>
          <div class="ml-10 hidden space-x-8 lg:block">
            <NuxtLink
              v-for="link in navigation"
              :key="link.name"
              :to="link.href"
              @click="handleNavClick(link)"
              class="text-base font-medium text-gray-300 hover:text-success-600 dark:hover:text-success-400 transition-colors cursor-pointer"
            >
              {{ link.name }}
            </NuxtLink>
          </div>
        </div>
        
        <div class="ml-10 space-x-4 flex items-center">
          <ThemeToggle />
          
          <NuxtLink
            to="/login"
            class="inline-block bg-success-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-success-700 transition-colors"
          >
            Sign in
          </NuxtLink>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div class="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
        <NuxtLink
          v-for="link in navigation"
          :key="link.name"
          :to="link.href"
          @click="handleNavClick(link)"
          class="text-base font-medium text-gray-900 dark:text-gray-300 hover:text-success-600 dark:hover:text-success-400 transition-colors cursor-pointer"
        >
          {{ link.name }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// Explicit imports for components
import AppLogo from '~/components/layout/AppLogo.vue'
import ThemeToggle from '~/components/ui-library/ThemeToggle.vue'

const route = useRoute()

const navigation = [
  { name: 'Services', href: '/#services', section: 'services' },
  { name: 'About', href: '/#about', section: 'about' },
  { name: 'Contact', href: '/#contact', section: 'contact' },
  { name: 'Get Quote', href: '/quote' },
]

const handleNavClick = (link: any) => {
  // If we're not on the home page and the link has a section, navigate to home first
  if (link.section && route.path !== '/') {
    navigateTo('/')
    // Wait for navigation to complete, then scroll to section
    nextTick(() => {
      setTimeout(() => {
        scrollToSection(link.section)
      }, 100)
    })
  } else if (link.section) {
    // We're already on home page, just scroll to section
    scrollToSection(link.section)
  }
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script> 