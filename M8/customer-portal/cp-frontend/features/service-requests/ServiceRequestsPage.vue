<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Service Requests
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your transportation and warehousing requests
        </p>
      </div>

    </div>

    <!-- Tabs -->
    <Tabs
      :tabs="SERVICE_REQUESTS_TABS"
      :default-tab="activeTab"
      @tab-change="onTabChange"
    >
      <!-- Transportation Requests Tab Content -->
      <template #transportation>
        <TransportationRequestsListing />
      </template>

      <!-- Warehousing Requests Tab Content -->
      <template #warehousing>
        <WarehousingRequestsPage />
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Tabs from '~/components/ui-library/tabs/Tabs.vue'
import TransportationRequestsListing from '../transportation/transportation-requests-listing/TransportationRequestsPage.vue'
import WarehousingRequestsPage from '~/features/warehousing/warehousing-requests-listing/WarehousingRequestsPage.vue'

interface ServiceRequestsTab {
  id: string;
  name: string;
  icon?: any;
}

type ServiceRequestsTabId = 'transportation' | 'warehousing';

const SERVICE_REQUESTS_TABS: ServiceRequestsTab[] = [
  {
    id: 'transportation',
    name: 'Transportation Requests'
  },
  {
    id: 'warehousing',
    name: 'Warehousing Requests'
  }
]; 

const route = useRoute()
const router = useRouter()

// Determine active tab from route
const activeTab = computed<ServiceRequestsTabId>(() => {
  const path = route.path
  if (path.includes('/warehousing')) {
    return 'warehousing'
  }
  // Default to transportation
  return 'transportation'
})

// Handle tab change - update URL
const onTabChange = (tabId: string) => {
  const tab = tabId as ServiceRequestsTabId
  if (tab === 'warehousing') {
    router.push('/dashboard/requests/warehousing')
  } else {
    router.push('/dashboard/requests/transportation')
  }
}

// Watch for route changes and redirect if needed
watch(() => route.path, (newPath) => {
  // If someone goes to /dashboard/requests (without tab), redirect to transportation
  if (newPath === '/dashboard/requests') {
    router.replace('/dashboard/requests/transportation')
  }
}, { immediate: true })
</script> 