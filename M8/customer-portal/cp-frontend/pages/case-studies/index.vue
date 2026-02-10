<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          Customer Success Stories
        </h1>
        <p class="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover how leading European companies have transformed their logistics operations with Deliveroo. 
          From cost savings to operational efficiency, see the real impact of our solutions.
        </p>
      </div>

      <!-- Featured Case Studies -->
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3 mb-16">
        <div
          v-for="caseStudy in featuredCaseStudies"
          :key="caseStudy.id"
          class="card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        >
          <div class="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700">
            <img
              :src="caseStudy.heroImage"
              :alt="caseStudy.company"
              class="w-full h-full object-cover opacity-20"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <img
                :src="caseStudy.logo"
                :alt="caseStudy.company"
                class="h-16 w-16 rounded-lg bg-white p-2 shadow-lg"
              />
            </div>
          </div>
          
          <div class="p-8">
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {{ caseStudy.industry }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ caseStudy.readTime }} min read
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {{ caseStudy.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
              {{ caseStudy.excerpt }}
            </p>
            
            <!-- Key Metrics -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="text-2xl font-bold text-success-600 dark:text-success-400">
                  {{ caseStudy.metrics.primary.value }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ caseStudy.metrics.primary.label }}
                </div>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ caseStudy.metrics.secondary.value }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ caseStudy.metrics.secondary.label }}
                </div>
              </div>
            </div>
            
            <NuxtLink
              :to="caseStudy.link"
              class="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Read Full Case Study
              <ArrowRightIcon class="ml-2 h-4 w-4" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Industry Insights -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-8 mb-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Industry Impact Overview
        </h2>
        
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <TruckIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Transportation Excellence
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Average 25% reduction in transportation costs across all industries
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon class="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delivery Performance
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              98.5% average on-time delivery rate across all customer segments
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon class="w-8 h-8 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Business Growth
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Customers report 40% faster market expansion with our logistics support
            </p>
          </div>
        </div>
      </div>

      <!-- Testimonials -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white mb-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p class="text-primary-100">
            Real feedback from logistics leaders across Europe
          </p>
        </div>
        
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <blockquote class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <p class="text-lg italic mb-4">
              "Deliveroo's logistics platform has been instrumental in our European expansion. 
              Their technology and reliability gave us the confidence to enter new markets."
            </p>
            <footer class="flex items-center">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="Anna Kowalski"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <div class="font-semibold">Anna Kowalski</div>
                <div class="text-primary-200 text-sm">Supply Chain Director, TechCorp</div>
              </div>
            </footer>
          </blockquote>
          
          <blockquote class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <p class="text-lg italic mb-4">
              "The temperature-controlled logistics solutions have been game-changing for our 
              perishable goods distribution across Central Europe."
            </p>
            <footer class="flex items-center">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="Sofia Novak"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <div class="font-semibold">Sofia Novak</div>
                <div class="text-primary-200 text-sm">Operations Director, FreshFood</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Write Your Success Story?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of European companies that have transformed their logistics operations with Deliveroo. 
          Let's discuss how we can help optimize your supply chain.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/quote"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Get Your Quote
          </NuxtLink>
          <NuxtLink
            to="/#contact"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Contact Our Team
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  TruckIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const featuredCaseStudies = [
  {
    id: 1,
    company: 'TechCorp Manufacturing',
    title: 'Scaling Electronics Distribution Across Europe',
    industry: 'Electronics Manufacturing',
    excerpt: 'How TechCorp reduced logistics costs by 30% while expanding to 5 new European markets through strategic partnership with Deliveroo.',
    heroImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    metrics: {
      primary: { value: '30%', label: 'Cost Reduction' },
      secondary: { value: '99.2%', label: 'On-Time Delivery' }
    },
    readTime: 8,
    link: '/case-studies/techcorp'
  },
  {
    id: 2,
    company: 'AutoParts Europe',
    title: 'Streamlining Automotive Supply Chain',
    industry: 'Automotive Parts',
    excerpt: 'AutoParts Europe achieved 25% cost savings and 98.8% delivery reliability while expanding their just-in-time delivery network.',
    heroImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    metrics: {
      primary: { value: '25%', label: 'Cost Savings' },
      secondary: { value: '98.8%', label: 'Delivery Rate' }
    },
    readTime: 6,
    link: '/case-studies/autoparts'
  },
  {
    id: 3,
    company: 'FreshFood Distribution',
    title: 'Revolutionizing Cold Chain Logistics',
    industry: 'Food & Beverage',
    excerpt: 'FreshFood Distribution maintained 99.5% product quality while reducing spoilage by 40% through advanced temperature-controlled logistics.',
    heroImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    metrics: {
      primary: { value: '40%', label: 'Spoilage Reduction' },
      secondary: { value: '99.5%', label: 'Quality Rate' }
    },
    readTime: 7,
    link: '/case-studies/freshfood'
  }
]

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Customer Success Stories - Deliveroo Logistics',
  description: 'Discover how leading European companies have transformed their logistics operations with Deliveroo. Real case studies showing cost savings and operational improvements.'
})
</script>