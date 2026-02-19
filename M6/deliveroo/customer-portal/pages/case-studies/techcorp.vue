<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-600 to-primary-700 py-16">
      <div class="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="TechCorp Manufacturing"
          class="w-full h-full object-cover opacity-20"
        />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center mb-6">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="TechCorp Logo"
              class="h-16 w-16 rounded-lg bg-white p-2 shadow-lg mr-4"
            />
            <div class="text-left">
              <h1 class="text-3xl font-bold text-white">TechCorp Manufacturing</h1>
              <p class="text-primary-100">Electronics Manufacturing Leader</p>
            </div>
          </div>
          <h2 class="text-4xl font-bold text-white mb-4">
            Scaling Electronics Distribution Across Europe
          </h2>
          <p class="text-xl text-primary-100 max-w-3xl mx-auto">
            How TechCorp reduced logistics costs by 30% while expanding to 5 new European markets 
            through strategic partnership with Deliveroo Logistics.
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">30%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Cost Reduction</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">99.2%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">On-Time Delivery</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">5</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">New Markets</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">€2.5M</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Annual Savings</div>
        </div>
      </div>

      <!-- Case Study Content -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <!-- Company Overview -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Company Overview</h3>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              TechCorp Manufacturing is a leading electronics manufacturer based in Warsaw, Poland, 
              specializing in high-precision components for the automotive and telecommunications industries. 
              Founded in 2010, the company has grown from a local supplier to a major player in the European market, 
              serving customers across 15 countries.
            </p>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 my-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Facts</h4>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-300">
                <li><strong>Founded:</strong> 2010</li>
                <li><strong>Headquarters:</strong> Warsaw, Poland</li>
                <li><strong>Employees:</strong> 850+</li>
                <li><strong>Annual Revenue:</strong> €120M</li>
                <li><strong>Markets Served:</strong> 15 European countries</li>
                <li><strong>Product Lines:</strong> Automotive & Telecom components</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- The Challenge -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Challenge</h3>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              As TechCorp's business grew rapidly, their logistics operations became increasingly complex and costly. 
              The company faced several critical challenges that threatened their expansion plans:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">Rising Logistics Costs</h4>
                <p class="text-red-700 dark:text-red-300 text-sm">
                  Transportation costs were increasing by 15% annually, eating into profit margins and making 
                  expansion to new markets financially challenging.
                </p>
              </div>
              
              <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Delivery Inconsistency</h4>
                <p class="text-yellow-700 dark:text-yellow-300 text-sm">
                  On-time delivery rates varied between 75-85%, causing customer satisfaction issues and 
                  potential contract penalties.
                </p>
              </div>
              
              <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Limited Visibility</h4>
                <p class="text-orange-700 dark:text-orange-300 text-sm">
                  Lack of real-time tracking and visibility into shipment status made it difficult to 
                  provide accurate delivery updates to customers.
                </p>
              </div>
              
              <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Scalability Issues</h4>
                <p class="text-purple-700 dark:text-purple-300 text-sm">
                  Existing logistics infrastructure couldn't support planned expansion into 5 new European markets 
                  without significant capital investment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- The Solution -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Deliveroo Solution</h3>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Deliveroo Logistics partnered with TechCorp to design and implement a comprehensive logistics solution 
              that addressed all their challenges while supporting their ambitious expansion plans.
            </p>
            
            <div class="space-y-8">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <TruckIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Optimized Transportation Network</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Implemented a hub-and-spoke distribution model with strategic consolidation points in Warsaw, 
                    Berlin, and Vienna, reducing overall transportation costs by leveraging economies of scale.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                  <ClockIcon class="w-6 h-6 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Advanced Tracking Technology</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Deployed real-time GPS tracking and IoT sensors for all shipments, providing complete visibility 
                    and enabling proactive issue resolution.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-lg flex items-center justify-center">
                  <BuildingStorefrontIcon class="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Strategic Warehousing</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Established regional distribution centers in key markets, reducing delivery times and enabling 
                    just-in-time delivery for critical components.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Implementation Timeline -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Implementation Timeline</h3>
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div class="space-y-8">
              <div class="relative flex items-start space-x-6">
                <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Month 1-2: Assessment & Planning</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Comprehensive logistics audit, route optimization analysis, and solution design phase.
                  </p>
                </div>
              </div>
              
              <div class="relative flex items-start space-x-6">
                <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Month 3-4: Infrastructure Setup</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Establishment of distribution hubs and implementation of tracking technology.
                  </p>
                </div>
              </div>
              
              <div class="relative flex items-start space-x-6">
                <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Month 5-6: Pilot Launch</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Gradual rollout starting with existing markets, followed by expansion to new territories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Results -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Outstanding Results</h3>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              The partnership with Deliveroo Logistics delivered exceptional results that exceeded TechCorp's expectations:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Cost Optimization</h4>
                <ul class="text-green-700 dark:text-green-300 text-sm space-y-2">
                  <li>• 30% reduction in overall logistics costs</li>
                  <li>• €2.5M annual savings achieved</li>
                  <li>• 40% improvement in cost per shipment</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Service Excellence</h4>
                <ul class="text-blue-700 dark:text-blue-300 text-sm space-y-2">
                  <li>• 99.2% on-time delivery rate</li>
                  <li>• 50% reduction in delivery complaints</li>
                  <li>• 95% customer satisfaction score</li>
                </ul>
              </div>
              
              <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Business Growth</h4>
                <ul class="text-purple-700 dark:text-purple-300 text-sm space-y-2">
                  <li>• Successful expansion to 5 new markets</li>
                  <li>• 25% increase in order volume capacity</li>
                  <li>• 60% faster market entry time</li>
                </ul>
              </div>
              
              <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Operational Efficiency</h4>
                <ul class="text-orange-700 dark:text-orange-300 text-sm space-y-2">
                  <li>• 100% shipment visibility achieved</li>
                  <li>• 70% reduction in manual processes</li>
                  <li>• Real-time inventory optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Customer Testimonial -->
        <section class="mb-12">
          <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
            <div class="flex items-start space-x-6">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="Anna Kowalski"
                class="w-16 h-16 rounded-full border-4 border-white/20"
              />
              <div>
                <blockquote class="text-lg italic mb-4">
                  "Partnering with Deliveroo Logistics was a game-changer for TechCorp. Not only did we achieve 
                  significant cost savings, but their technology platform gave us the confidence to expand into 
                  new markets. The real-time visibility and reliability of their service has strengthened our 
                  relationships with customers across Europe."
                </blockquote>
                <footer>
                  <div class="font-semibold">Anna Kowalski</div>
                  <div class="text-primary-200">Supply Chain Director, TechCorp Manufacturing</div>
                </footer>
              </div>
            </div>
          </div>
        </section>

        <!-- Future Plans -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Looking Forward</h3>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Building on the success of their European expansion, TechCorp and Deliveroo are now planning 
              the next phase of growth:
            </p>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">2024-2025 Roadmap</h4>
              <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                <li class="flex items-start space-x-3">
                  <span class="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  <span>Expansion into Nordic markets (Sweden, Norway, Denmark)</span>
                </li>
                <li class="flex items-start space-x-3">
                  <span class="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  <span>Implementation of AI-powered demand forecasting</span>
                </li>
                <li class="flex items-start space-x-3">
                  <span class="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  <span>Carbon-neutral logistics initiative with electric vehicle fleet</span>
                </li>
                <li class="flex items-start space-x-3">
                  <span class="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  <span>Integration of blockchain technology for supply chain transparency</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-12">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Transform Your Logistics?
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          See how Deliveroo can help your business achieve similar results. 
          Let's discuss your logistics challenges and growth opportunities.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/quote"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Get Your Custom Quote
          </NuxtLink>
          <NuxtLink
            to="/case-studies"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            View More Case Studies
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TruckIcon,
  ClockIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'TechCorp Manufacturing Case Study - Deliveroo Logistics',
  description: 'Learn how TechCorp Manufacturing reduced logistics costs by 30% and expanded to 5 new European markets with Deliveroo Logistics solutions.'
})
</script>