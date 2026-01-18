<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-secondary-600 to-secondary-700 py-16">
      <div class="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="AutoParts Europe"
          class="w-full h-full object-cover opacity-20"
        />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center mb-6">
            <img
              src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="AutoParts Europe Logo"
              class="h-16 w-16 rounded-lg bg-white p-2 shadow-lg mr-4"
            />
            <div class="text-left">
              <h1 class="text-3xl font-bold text-white">AutoParts Europe</h1>
              <p class="text-secondary-100">Automotive Parts Distribution</p>
            </div>
          </div>
          <h2 class="text-4xl font-bold text-white mb-4">
            Streamlining Automotive Supply Chain
          </h2>
          <p class="text-xl text-secondary-100 max-w-3xl mx-auto">
            How AutoParts Europe achieved 25% cost savings and 98.8% delivery reliability 
            while expanding their just-in-time delivery network across Central Europe.
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">25%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Cost Savings</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">98.8%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Delivery Reliability</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">45min</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Avg Delivery Time</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">€1.8M</div>
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
              AutoParts Europe is a leading distributor of automotive parts and components, serving 
              automotive manufacturers, repair shops, and dealerships across Central and Eastern Europe. 
              Founded in 2008 in Prague, the company has built a reputation for reliable, fast delivery 
              of critical automotive components.
            </p>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 my-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Facts</h4>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-300">
                <li><strong>Founded:</strong> 2008</li>
                <li><strong>Headquarters:</strong> Prague, Czech Republic</li>
                <li><strong>Employees:</strong> 420+</li>
                <li><strong>Annual Revenue:</strong> €85M</li>
                <li><strong>SKUs:</strong> 50,000+ automotive parts</li>
                <li><strong>Customers:</strong> 2,500+ across 8 countries</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- The Challenge -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Challenge</h3>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              The automotive industry's shift towards just-in-time manufacturing created unprecedented 
              pressure on AutoParts Europe's logistics operations. They faced critical challenges:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">Time-Critical Deliveries</h4>
                <p class="text-red-700 dark:text-red-300 text-sm">
                  Manufacturing customers required parts delivery within 2-4 hours to avoid production line shutdowns, 
                  creating extreme pressure on logistics operations.
                </p>
              </div>
              
              <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Complex Inventory Management</h4>
                <p class="text-yellow-700 dark:text-yellow-300 text-sm">
                  Managing 50,000+ SKUs across multiple locations while maintaining optimal stock levels 
                  and minimizing carrying costs.
                </p>
              </div>
              
              <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Cross-Border Complexity</h4>
                <p class="text-orange-700 dark:text-orange-300 text-sm">
                  Navigating different customs procedures and regulations across 8 European countries 
                  while maintaining delivery speed.
                </p>
              </div>
              
              <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Cost Pressure</h4>
                <p class="text-purple-700 dark:text-purple-300 text-sm">
                  Increasing fuel costs and driver shortages were driving up logistics expenses while 
                  customers demanded lower prices.
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
              Deliveroo Logistics designed a specialized automotive supply chain solution that combined 
              strategic warehousing, express delivery capabilities, and advanced inventory management.
            </p>
            
            <div class="space-y-8">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
                  <ClockIcon class="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Express Delivery Network</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Established dedicated express delivery routes with guaranteed 2-hour delivery windows 
                    for critical automotive components, supported by real-time tracking and priority handling.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <BuildingStorefrontIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Strategic Micro-Fulfillment</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Deployed micro-fulfillment centers near major automotive manufacturing hubs, 
                    reducing last-mile delivery times and enabling same-day restocking.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-lg flex items-center justify-center">
                  <CpuChipIcon class="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Inventory Optimization</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Implemented predictive analytics to optimize inventory levels based on production schedules, 
                    seasonal patterns, and historical demand data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Implementation Process -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Implementation Process</h3>
          <div class="space-y-6">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Phase 1: Network Analysis (Month 1)</h4>
              <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Comprehensive analysis of existing delivery routes and customer locations</li>
                <li>• Identification of optimal micro-fulfillment center locations</li>
                <li>• Assessment of current inventory turnover and demand patterns</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Phase 2: Infrastructure Setup (Months 2-3)</h4>
              <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Establishment of 5 micro-fulfillment centers in key automotive regions</li>
                <li>• Implementation of automated sorting and picking systems</li>
                <li>• Integration of inventory management systems with customer ERP platforms</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Phase 3: Express Network Launch (Month 4)</h4>
              <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Launch of dedicated express delivery fleet with specialized vehicles</li>
                <li>• Training of drivers on automotive parts handling and urgency protocols</li>
                <li>• Go-live with real-time tracking and customer notification systems</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Results -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Exceptional Results</h3>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              The partnership delivered remarkable improvements across all key performance indicators:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Delivery Performance</h4>
                <ul class="text-green-700 dark:text-green-300 text-sm space-y-2">
                  <li>• 98.8% on-time delivery rate achieved</li>
                  <li>• Average delivery time reduced to 45 minutes</li>
                  <li>• Zero production line shutdowns due to parts shortage</li>
                  <li>• 99.5% order accuracy maintained</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Cost Optimization</h4>
                <ul class="text-blue-700 dark:text-blue-300 text-sm space-y-2">
                  <li>• 25% reduction in total logistics costs</li>
                  <li>• €1.8M annual savings achieved</li>
                  <li>• 30% improvement in fuel efficiency</li>
                  <li>• 20% reduction in inventory carrying costs</li>
                </ul>
              </div>
              
              <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Customer Satisfaction</h4>
                <ul class="text-purple-700 dark:text-purple-300 text-sm space-y-2">
                  <li>• 96% customer satisfaction score</li>
                  <li>• 40% increase in repeat orders</li>
                  <li>• 15% growth in customer base</li>
                  <li>• 90% reduction in delivery complaints</li>
                </ul>
              </div>
              
              <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Operational Excellence</h4>
                <ul class="text-orange-700 dark:text-orange-300 text-sm space-y-2">
                  <li>• 100% real-time inventory visibility</li>
                  <li>• 50% reduction in stockouts</li>
                  <li>• 35% improvement in order processing time</li>
                  <li>• Automated 80% of routine logistics tasks</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Customer Testimonial -->
        <section class="mb-12">
          <div class="bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-xl p-8 text-white">
            <div class="flex items-start space-x-6">
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="Marcus Weber"
                class="w-16 h-16 rounded-full border-4 border-white/20"
              />
              <div>
                <blockquote class="text-lg italic mb-4">
                  "The transformation has been incredible. Deliveroo's express delivery network has made us 
                  the most reliable parts supplier in Central Europe. Our customers now see us as a strategic 
                  partner rather than just a vendor. The cost savings allowed us to invest in expanding our 
                  product range and entering new markets."
                </blockquote>
                <footer>
                  <div class="font-semibold">Marcus Weber</div>
                  <div class="text-secondary-200">Logistics Manager, AutoParts Europe</div>
                </footer>
              </div>
            </div>
          </div>
        </section>

        <!-- Technology Innovation -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Technology Innovation</h3>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              The solution leveraged cutting-edge technology to deliver unprecedented performance:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CpuChipIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Predictive Analytics
                </h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  AI algorithms predict demand patterns and optimize inventory placement
                </p>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapIcon class="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Route Optimization
                </h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  Dynamic routing algorithms minimize delivery times and fuel consumption
                </p>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DevicePhoneMobileIcon class="w-8 h-8 text-accent-600 dark:text-accent-400" />
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Mobile Integration
                </h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  Real-time mobile apps for drivers and customers with live tracking
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-12">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Optimize Your Automotive Supply Chain
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover how Deliveroo can help your automotive business achieve similar results with 
          our specialized just-in-time delivery solutions.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/quote"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 transition-colors"
          >
            Request Automotive Solution Quote
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
  ClockIcon,
  BuildingStorefrontIcon,
  CpuChipIcon,
  MapIcon,
  DevicePhoneMobileIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'AutoParts Europe Case Study - Deliveroo Logistics',
  description: 'Learn how AutoParts Europe achieved 25% cost savings and 98.8% delivery reliability with Deliveroo\'s just-in-time automotive logistics solutions.'
})
</script>