<template>
  <section id="success-stories" class="py-24 bg-white dark:bg-gray-900">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Success Stories
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Real results from businesses that trust us with their logistics
        </p>
      </div>

      <div class="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div
          v-for="story in stories"
          :key="story.id"
          class="card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex items-center mb-6">
            <img
              :src="story.logo"
              :alt="story.company"
              class="h-12 w-12 rounded-lg object-cover mr-4"
            />
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ story.company }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ story.industry }}
              </p>
            </div>
          </div>

          <blockquote class="text-gray-600 dark:text-gray-300 mb-6 italic">
            "{{ story.testimonial }}"
          </blockquote>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-success-600 dark:text-success-400">
                {{ story.metrics.improvement }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Cost Reduction
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-success-600 dark:text-success-400">
                {{ story.metrics.delivery }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                On-Time Delivery
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img
                :src="story.contact.avatar"
                :alt="story.contact.name"
                class="h-8 w-8 rounded-full mr-3"
              />
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ story.contact.name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ story.contact.position }}
                </div>
              </div>
            </div>
            <NuxtLink
              :to="story.caseStudyLink"
              class="text-success-600 hover:text-success-500 dark:text-success-400 text-sm font-medium"
            >
              Read Case Study →
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <NuxtLink
          to="/case-studies"
          class="inline-flex items-center px-6 py-3 border border-success-600 text-base font-medium rounded-md text-success-600 bg-white hover:bg-success-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        >
          View All Case Studies
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

import { ArrowRightIcon } from '@heroicons/vue/24/outline'

interface StoryMetrics {
  improvement: string
  delivery: string
}

interface StoryContact {
  name: string
  position: string
  avatar: string
}

interface Story {
  id: number
  company: string
  industry: string
  logo: string
  testimonial: string
  metrics: StoryMetrics
  contact: StoryContact
  caseStudyLink: string
}

const defaultStories: Story[] = [
  {
    id: 1,
    company: 'TechCorp Manufacturing',
    industry: 'Electronics Manufacturing',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    testimonial:
      'Deliveroo transformed our supply chain efficiency. Their real-time tracking and reliable delivery schedules helped us reduce inventory costs by 30% while improving customer satisfaction.',
    metrics: {
      improvement: '30%',
      delivery: '99.2%'
    },
    contact: {
      name: 'Anna Kowalski',
      position: 'Supply Chain Director',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    caseStudyLink: '/case-studies/techcorp'
  },
  {
    id: 2,
    company: 'AutoParts Europe',
    industry: 'Automotive Parts',
    logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    testimonial:
      'The cross-border logistics expertise of Deliveroo enabled us to expand into 5 new European markets. Their customs clearance service is exceptional.',
    metrics: {
      improvement: '25%',
      delivery: '98.8%'
    },
    contact: {
      name: 'Marcus Weber',
      position: 'Logistics Manager',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    caseStudyLink: '/case-studies/autoparts'
  },
  {
    id: 3,
    company: 'FreshFood Distribution',
    industry: 'Food & Beverage',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    testimonial:
      'Temperature-controlled transportation and warehousing solutions from Deliveroo helped us maintain product quality while expanding our distribution network across Central Europe.',
    metrics: {
      improvement: '40%',
      delivery: '99.5%'
    },
    contact: {
      name: 'Sofia Novak',
      position: 'Operations Director',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    caseStudyLink: '/case-studies/freshfood'
  }
]

const props = defineProps<{ stories?: Story[] }>()

// Use provided stories or fallback to default ones
const stories = props.stories ?? defaultStories
</script>
