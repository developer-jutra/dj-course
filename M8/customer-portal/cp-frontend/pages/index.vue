<template>
  <div>
    <LogisticsSection />
    <!-- Hero Section -->
    <section class="relative overflow-hidden" v-if="false">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="/deliveroo-containers.webp"
          alt="Modern European logistics trucks on highway"
          class="w-full h-full object-cover"
        />
        <!-- Green overlay with gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-success-800/85 via-success-700/80 to-success-900/90"></div>
        <!-- Additional subtle pattern overlay for texture -->
        <div class="absolute inset-0 bg-black/10"></div>
      </div>
      
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg animate-slide-up animation-delay-300">
            <span class="block">Seamless Logistics</span>
            <span class="block text-accent-300 animation-delay-500 animate-slide-up">Across Europe</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-100 drop-shadow-md animate-fade-in animation-delay-700">
            Connecting East and West with reliable road transportation and secure warehousing. 
            From Poland to every corner of Europe, we deliver excellence.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <NuxtLink
              to="/quote"
              class="rounded-md bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Quote
            </NuxtLink>
            <a
              href="#services"
              class="text-base font-semibold leading-6 text-white hover:text-accent-300 transition-colors drop-shadow-md"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Confetti layer -->
      <div ref="confettiContainer" class="absolute inset-0 pointer-events-none overflow-hidden"></div>

      <!-- Floating & clickable truck icon -->
      <div
        ref="truckElement"
        class="absolute top-1/4 left-10 cursor-pointer floating-around"
        @click="triggerConfetti($event, truckColors)"
      >
        <div class="glass-effect rounded-lg p-4 shadow-lg hover:scale-110 transition-transform duration-300">
          <TruckIcon class="h-8 w-8 text-white drop-shadow-sm animate-wiggle" />
        </div>
      </div>

      <!-- Floating & clickable warehouse icon -->
      <div
        ref="warehouseElement"
        class="absolute bottom-1/4 right-10 cursor-pointer floating-around-reverse"
        @click="triggerConfetti($event, warehouseColors)"
        style="animation-delay:1s;"
      >
        <div class="glass-effect rounded-lg p-4 shadow-lg hover:scale-110 transition-transform duration-300">
          <BuildingStorefrontIcon class="h-8 w-8 text-white drop-shadow-sm animate-wiggle-reverse" />
        </div>
      </div>
    </section>

    <!-- Services Overview -->
    <section id="services" class="py-24 bg-gray-50 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Our Services
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Comprehensive logistics solutions tailored to your business needs
          </p>
        </div>
        
        <div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="service in services"
            :key="service.name"
            class="group relative card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center justify-center w-16 h-16 bg-success-100 dark:bg-success-900 rounded-lg mb-6 group-hover:bg-success-200 dark:group-hover:bg-success-800 transition-colors">
              <component :is="getIconComponent(service.icon)" class="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {{ service.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ service.description }}
            </p>
            <ul class="space-y-2">
              <li
                v-for="feature in service.features"
                :key="feature"
                class="flex items-center text-sm text-gray-500 dark:text-gray-400"
              >
                <CheckIcon class="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us with Video -->
    <section id="about" class="py-24 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Why Choose Deliveroo
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Years of experience connecting Eastern and Western Europe
          </p>
        </div>
        
        <div class="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Rotating Features -->
          <Rotator :items="features" :items-to-show="3" />
          
          <div class="relative">
            <video 
              class="rounded-lg shadow-xl w-full h-auto" 
              controls
            >
              <source src="/deliveroo-promo-drivers.mp4" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="relative py-24 overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Professional logistics team and operations"
          class="w-full h-full object-cover"
        />
        <!-- White overlay with gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/95"></div>
        <!-- Additional subtle overlay for better text readability -->
        <div class="absolute inset-0 bg-gray-50/30"></div>
      </div>
      
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl drop-shadow-sm">
            Ready to Streamline Your Logistics?
          </h2>
          <p class="mt-4 text-lg text-gray-700 drop-shadow-sm">
            Get started with a free quote today and experience the difference
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/quote"
              class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-success-600 hover:bg-success-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
            >
              Request Quote
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
            >
              Sign In
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories -->
    <SuccessStories />

    <!-- Statistics -->
    <section class="relative py-24 overflow-hidden" ref="statsSection">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="European logistics trucks and transportation network"
          class="w-full h-full object-cover"
        />
        <!-- Dark overlay with gradient for better text contrast -->
        <div class="absolute inset-0 bg-gradient-to-br from-success-900/90 via-success-800/85 to-success-950/95"></div>
        <!-- Additional overlay for enhanced readability -->
        <div class="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-white mb-12 drop-shadow-lg">
            Trusted by Businesses Across Europe
          </h2>
        </div>
        
        <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div
            v-for="stat in stats"
            :key="stat.name"
            class="text-center"
          >
            <div class="text-4xl font-bold text-accent-400 mb-2 drop-shadow-lg">
              {{ animatedStats[stat.name] || '0' }}{{ stat.suffix || '' }}
            </div>
            <div class="text-lg text-gray-300 drop-shadow-md">
              {{ stat.name }}
            </div>
          </div>
        </div>

        <!-- Video Player -->
        <div class="mt-12 max-w-3xl mx-auto">
          <video 
            class="rounded-lg shadow-xl w-full h-auto" 
            controls
          >
            <source src="/deliveroo-promo-fresh-food.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-gray-50 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Contact Us for More Information
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Ready to optimize your logistics? Get in touch with our experts today
          </p>
        </div>
        
        <div class="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Contact Information -->
          <div class="space-y-8">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h3>
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <PhoneIcon class="w-6 h-6 text-success-600 dark:text-success-400 mt-1" />
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                      Phone
                    </h4>
                    <p class="text-gray-600 dark:text-gray-300">
                      +48 123 456 789
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Monday - Friday, 8:00 AM - 6:00 PM CET
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <EnvelopeIcon class="w-6 h-6 text-success-600 dark:text-success-400 mt-1" />
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                      Email
                    </h4>
                    <p class="text-gray-600 dark:text-gray-300">
                      contact@deliveroo.pl
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      We respond within 2 hours during business hours
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <MapPinIcon class="w-6 h-6 text-success-600 dark:text-success-400 mt-1" />
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                      Headquarters
                    </h4>
                    <p class="text-gray-600 dark:text-gray-300">
                      ul. Logistyczna 123<br>
                      00-001 Warsaw, Poland
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <ClockIcon class="w-6 h-6 text-success-600 dark:text-success-400 mt-1" />
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                      24/7 Emergency Support
                    </h4>
                    <p class="text-gray-600 dark:text-gray-300">
                      +48 987 654 321
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      For urgent shipment issues
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h4>
              <div class="space-y-3">
                <NuxtLink
                  to="/quote"
                  class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span class="text-gray-900 dark:text-white">Request a Quote</span>
                  <ArrowRightIcon class="w-5 h-5 text-gray-400" />
                </NuxtLink>
                <NuxtLink
                  to="/login"
                  class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span class="text-gray-900 dark:text-white">Access Customer Portal</span>
                  <ArrowRightIcon class="w-5 h-5 text-gray-400" />
                </NuxtLink>
                <a
                  href="tel:+48123456789"
                  class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span class="text-gray-900 dark:text-white">Call Now</span>
                  <PhoneIcon class="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <ContactForm />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  TruckIcon,
  BuildingStorefrontIcon,
  CheckIcon,
  GlobeEuropeAfricaIcon,
  ClockIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

import Rotator from '~/components/landing/Rotator.vue'
import SuccessStories from '~/components/landing/SuccessStories.vue'
import ContactForm from '~/components/landing/ContactForm.vue'
import LogisticsSection from '~/components/landing/LogisticsSection.vue'

import { ref, onMounted, nextTick } from 'vue'

const statsSection = ref(null)
const animatedStats = ref<Record<string, string>>({})
const hasAnimated = ref(false)

// Inlined mock data
const services = [
  {
    name: 'Road Transportation',
    description: 'Europe-wide freight delivery with real-time tracking and guaranteed delivery times.',
    icon: 'TruckIcon',
    features: [
      'Full & partial loads',
      'Express delivery',
      'Temperature controlled',
      'Hazardous materials'
    ]
  },
  {
    name: 'Warehousing Solutions',
    description: 'Secure storage facilities with advanced inventory management systems.',
    icon: 'BuildingStorefrontIcon',
    features: [
      'Climate controlled',
      'Inventory management',
      'Pick & pack services',
      'Cross-docking'
    ]
  },
  {
    name: 'Customs Clearance',
    description: 'Simplified cross-border procedures and documentation handling.',
    icon: 'ShieldCheckIcon',
    features: [
      'EU compliance',
      'Documentation support',
      'Fast processing',
      'Expert guidance'
    ]
  },
  {
    name: 'Technology Platform',
    description: 'Advanced tracking and management systems for complete visibility.',
    icon: 'CpuChipIcon',
    features: [
      'Real-time tracking',
      'Digital documentation',
      'API integration',
      'Mobile access'
    ]
  }
]

const features = [
  {
    name: 'European Coverage',
    description: 'Extensive network covering all major European routes with dedicated hubs in key locations.',
    icon: 'GlobeEuropeAfricaIcon'
  },
  {
    name: 'Reliability & Speed',
    description: '99%+ on-time delivery rate with express options for urgent shipments.',
    icon: 'ClockIcon'
  },
  {
    name: 'Advanced Technology',
    description: 'State-of-the-art tracking systems and digital platforms for complete transparency.',
    icon: 'CpuChipIcon'
  },
  {
    name: 'Trusted Partner',
    description: 'Years of experience with industry-leading safety standards and compliance.',
    icon: 'ShieldCheckIcon'
  },
  {
    name: 'Flexible B2B Service',
    description: 'Direct deliveries to any location in Europe, including remote areas, thanks to our extensive road network and adaptable fleet.',
    icon: 'CheckIcon'
  },
  {
    name: 'Versatile Cargo Solutions',
    description: 'Expertise in handling all types of goods—from perishable and hazardous materials to oversized and high-value shipments—with tailored transport options.',
    icon: 'CheckIcon'
  },
  {
    name: 'Cost-Efficient Logistics',
    description: 'Competitive pricing and optimised route planning ensure your shipments are delivered efficiently, saving you time and money.',
    icon: 'CheckIcon'
  }
]

const stats = [
  { name: 'Countries Served', value: 25, suffix: '+' },
  { name: 'Deliveries Completed', value: 100000, suffix: '+' },
  { name: 'Satisfied Customers', value: 1000, suffix: '+' },
  { name: 'Warehouse Capacity', value: 50000, suffix: ' m²' }
]

// Color arrays placeholders for legacy template refs
const truckColors: string[] = []
const warehouseColors: string[] = []

// Refs for interactive icons & confetti layer
const truckElement = ref<HTMLElement | null>(null)
const warehouseElement = ref<HTMLElement | null>(null)
const confettiContainer = ref<HTMLElement | null>(null)

// Helper function to get icon component from string name
const getIconComponent = (iconName: string) => {
  const iconMap = {
    'TruckIcon': TruckIcon,
    'BuildingStorefrontIcon': BuildingStorefrontIcon,
    'ShieldCheckIcon': ShieldCheckIcon,
    'CpuChipIcon': CpuChipIcon,
    'GlobeEuropeAfricaIcon': GlobeEuropeAfricaIcon,
    'ClockIcon': ClockIcon,
    'CheckIcon': CheckIcon
  }
  return iconMap[iconName as keyof typeof iconMap] || TruckIcon
}

// Animation function for counting numbers
const animateNumber = (target: number, key: string, duration: number = 2000) => {
  const start = 0
  const increment = target / (duration / 16) // 60fps
  let current = start
  
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    
    // Format the number based on its size
    if (target >= 1000) {
      animatedStats.value[key] = Math.floor(current).toLocaleString()
    } else {
      animatedStats.value[key] = Math.floor(current).toString()
    }
  }, 16)
}

// Intersection Observer to trigger animation when stats section is visible
const observeStatsSection = () => {
  if (!process.client || !statsSection.value) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated.value) {
          hasAnimated.value = true
          
          // Start animations for each stat with slight delays
          stats.forEach((stat, index) => {
            setTimeout(() => {
              animateNumber(stat.value, stat.name, 2000)
            }, index * 200)
          })
        }
      })
    },
    {
      threshold: 0.5 // Trigger when 50% of the section is visible
    }
  )
  
  observer.observe(statsSection.value)
}

/* ----------------------  SCROLL-REVEAL SETUP ---------------------- */
const setupScrollReveal = () => {
  if (!process.client) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el))
}

onMounted(() => {
  observeStatsSection()
  nextTick(() => {
    setupScrollReveal()
  })
})

definePageMeta({
  layout: 'default'
})

// Removed hero confetti logic – keep a stub for template refs
const triggerConfetti = (_e?: any, _colors?: string[]) => {}
</script>

<style scoped>
/* ------------ extra animations & utilities inspired by ALT.vue ------------ */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up { animation: slideUp 0.8s forwards; }
.animate-fade-in { animation: fadeIn 0.8s forwards; }

@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

/* Animation delay helpers */
.animation-delay-300 { animation-delay: .3s; }
.animation-delay-500 { animation-delay: .5s; }
.animation-delay-700 { animation-delay: .7s; }

/* Floating wiggle */
@keyframes wiggle { 0%,100%{transform:rotate(-3deg);} 50%{transform:rotate(3deg);} }
.animate-wiggle { animation: wiggle 1.5s ease-in-out infinite; }
.animate-wiggle-reverse { animation: wiggle 1.5s ease-in-out reverse infinite; }

/* Simple floating around keyframes */
@keyframes floatY { 0%,100%{transform: translateY(-6px);} 50%{transform: translateY(6px);} }
.floating-around { animation: floatY 4s ease-in-out infinite; }
.floating-around-reverse { animation: floatY 4s ease-in-out reverse infinite; }

/* Scroll reveal base */
.scroll-reveal { opacity:0; transform: translateY(40px); transition: opacity .6s ease, transform .6s ease; }
.scroll-reveal.revealed { opacity:1; transform:none; }

/* Confetti piece */
.confetti-piece { will-change: transform, opacity; }
</style>