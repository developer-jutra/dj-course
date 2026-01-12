<template>
  <div>
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          :class="[
            activeTab === tab.id
              ? 'border-success-500 text-success-600 dark:text-success-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          <component
            v-if="tab.icon"
            :is="tab.icon"
            class="w-5 h-5 mr-2 inline"
          />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="space-y-8">
      <template v-for="tab in tabs" :key="tab.id">
        <div v-show="activeTab === tab.id">
          <slot :name="tab.id" :tab="tab" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

export interface Tab {
  id: string
  name: string
  icon?: any
}

export interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

const props = withDefaults(defineProps<TabsProps>(), {
  defaultTab: ''
})

const emit = defineEmits<{
  tabChange: [tabId: string]
}>()

const activeTab = ref(props.defaultTab || (props.tabs.length > 0 ? props.tabs[0].id : ''))

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  emit('tabChange', tabId)
}

// Watch for changes in defaultTab prop
watch(() => props.defaultTab, (newDefaultTab) => {
  if (newDefaultTab) {
    activeTab.value = newDefaultTab
  }
})

// Set initial active tab on mount
onMounted(() => {
  if (props.defaultTab) {
    activeTab.value = props.defaultTab
  } else if (props.tabs.length > 0) {
    activeTab.value = props.tabs[0].id
  }
})
</script>
