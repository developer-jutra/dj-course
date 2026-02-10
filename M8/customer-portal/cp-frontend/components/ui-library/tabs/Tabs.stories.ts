import type { Meta, StoryObj } from '@storybook/vue3'
import Tabs from './Tabs.vue'
import type { Tab, TabsProps } from './Tabs.vue'
import {
  BuildingOfficeIcon,
  PhoneIcon,
  BellIcon,
  ShieldCheckIcon,
  UserIcon,
  CogIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'

const meta: Meta<typeof Tabs> = {
  title: 'UI Library/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible tabs component that supports icons and scoped slots for content.'
      }
    }
  },
  argTypes: {
    tabs: {
      control: { type: 'object' },
      description: 'Array of tab objects with id, name, and optional icon'
    },
    defaultTab: {
      control: { type: 'text' },
      description: 'ID of the tab to be active by default'
    },
    onTabChange: {
      action: 'tab-change',
      description: 'Event emitted when tab is changed'
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Tabs>

// Basic tabs without icons
export const Default: Story = {
  args: {
    tabs: [
      { id: 'tab1', name: 'First Tab' },
      { id: 'tab2', name: 'Second Tab' },
      { id: 'tab3', name: 'Third Tab' }
    ]
  },
  render: (args: TabsProps) => ({
    components: { Tabs },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args">
        <template #tab1>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">First Tab Content</h3>
            <p class="text-gray-600 dark:text-gray-400">This is the content for the first tab.</p>
          </div>
        </template>
        <template #tab2>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Second Tab Content</h3>
            <p class="text-gray-600 dark:text-gray-400">This is the content for the second tab.</p>
          </div>
        </template>
        <template #tab3>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Third Tab Content</h3>
            <p class="text-gray-600 dark:text-gray-400">This is the content for the third tab.</p>
          </div>
        </template>
      </Tabs>
    `
  })
}

// Tabs with icons
export const WithIcons: Story = {
  args: {
    tabs: [
      { id: 'profile', name: 'Profile', icon: UserIcon },
      { id: 'settings', name: 'Settings', icon: CogIcon },
      { id: 'documents', name: 'Documents', icon: DocumentIcon }
    ]
  },
  render: (args: TabsProps) => ({
    components: { Tabs },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args">
        <template #profile>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Profile Settings</h3>
            <p class="text-gray-600 dark:text-gray-400">Manage your profile information and preferences.</p>
          </div>
        </template>
        <template #settings>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Application Settings</h3>
            <p class="text-gray-600 dark:text-gray-400">Configure application-wide settings and preferences.</p>
          </div>
        </template>
        <template #documents>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Document Management</h3>
            <p class="text-gray-600 dark:text-gray-400">View and manage your uploaded documents.</p>
          </div>
        </template>
      </Tabs>
    `
  })
}

// Settings page example (similar to actual usage)
export const SettingsExample: Story = {
  args: {
    tabs: [
      { id: 'company', name: 'Company Information', icon: BuildingOfficeIcon },
      { id: 'contact', name: 'Contact Information', icon: PhoneIcon },
      { id: 'notifications', name: 'Notifications', icon: BellIcon },
      { id: 'security', name: 'Security', icon: ShieldCheckIcon }
    ],
    defaultTab: 'company'
  },
  render: (args: TabsProps) => ({
    components: { Tabs },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args">
        <template #company>
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Information</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="Enter company name">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Number</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="Enter registration number">
              </div>
            </div>
          </div>
        </template>
        <template #contact>
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Email</label>
                <input type="email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="Enter primary email">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Phone</label>
                <input type="tel" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="Enter primary phone">
              </div>
            </div>
          </div>
        </template>
        <template #notifications>
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input type="checkbox" class="rounded border-gray-300 dark:border-gray-600 text-success-600 focus:ring-success-500">
                <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">Email notifications</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="rounded border-gray-300 dark:border-gray-600 text-success-600 focus:ring-success-500">
                <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS notifications</label>
              </div>
            </div>
          </div>
        </template>
        <template #security>
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
            <div class="space-y-4">
              <button class="px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700 transition-colors">
                Change Password
              </button>
              <button class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </template>
      </Tabs>
    `
  })
}

// Custom default tab
export const CustomDefaultTab: Story = {
  args: {
    tabs: [
      { id: 'overview', name: 'Overview' },
      { id: 'details', name: 'Details' },
      { id: 'advanced', name: 'Advanced' }
    ],
    defaultTab: 'details'
  },
  render: (args: TabsProps) => ({
    components: { Tabs },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args">
        <template #overview>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Overview</h3>
            <p class="text-blue-700 dark:text-blue-300">This tab shows general overview information.</p>
          </div>
        </template>
        <template #details>
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 class="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Details (Default)</h3>
            <p class="text-green-700 dark:text-green-300">This tab is set as the default and shows detailed information.</p>
          </div>
        </template>
        <template #advanced>
          <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 class="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Advanced</h3>
            <p class="text-purple-700 dark:text-purple-300">This tab contains advanced configuration options.</p>
          </div>
        </template>
      </Tabs>
    `
  })
}

// Interactive example with event handling
export const WithEventHandling: Story = {
  args: {
    tabs: [
      { id: 'tab1', name: 'Tab 1', icon: UserIcon },
      { id: 'tab2', name: 'Tab 2', icon: CogIcon },
      { id: 'tab3', name: 'Tab 3', icon: DocumentIcon }
    ]
  },
  render: (args: TabsProps) => ({
    components: { Tabs },
    setup() {
      const currentTab = ref('tab1')
      
      const handleTabChange = (tabId: string) => {
        currentTab.value = tabId
        console.log('Tab changed to:', tabId)
      }
      
      return { args, currentTab, handleTabChange }
    },
    template: `
      <div>
        <div class="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Current active tab: <span class="font-semibold text-gray-900 dark:text-white">{{ currentTab }}</span>
          </p>
        </div>
        
        <Tabs v-bind="args" @tab-change="handleTabChange">
          <template #tab1>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tab 1 Content</h3>
              <p class="text-gray-600 dark:text-gray-400">This demonstrates tab change event handling.</p>
            </div>
          </template>
          <template #tab2>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tab 2 Content</h3>
              <p class="text-gray-600 dark:text-gray-400">Event is fired when switching to this tab.</p>
            </div>
          </template>
          <template #tab3>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tab 3 Content</h3>
              <p class="text-gray-600 dark:text-gray-400">Check the console for tab change events.</p>
            </div>
          </template>
        </Tabs>
      </div>
    `
  })
} 