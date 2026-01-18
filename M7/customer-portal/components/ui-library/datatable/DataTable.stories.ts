import type { Meta, StoryObj } from '@nuxtjs/storybook'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PlusIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { h } from 'vue'

import DataTable from './DataTable.vue'

// Mock data for stories
const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    joinDate: new Date('2023-01-15'),
    department: 'Engineering'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Inactive',
    joinDate: new Date('2023-03-22'),
    department: 'Marketing'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Moderator',
    status: 'Active',
    joinDate: new Date('2023-02-10'),
    department: 'Support'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'User',
    status: 'Pending',
    joinDate: new Date('2024-01-05'),
    department: 'Sales'
  }
]

const sampleRequests = [
  {
    id: 'REQ-001',
    trackingNumber: 'TRK123456',
    type: 'Transportation',
    details: 'Delivery to NYC',
    subDetails: '50 boxes, 500kg',
    status: 'In Transit',
    date: new Date('2024-01-20')
  },
  {
    id: 'REQ-002',
    trackingNumber: 'TRK123457',
    type: 'Warehousing',
    details: 'Storage request',
    subDetails: 'Long-term storage',
    status: 'Completed',
    date: new Date('2024-01-18')
  },
  {
    id: 'REQ-003',
    trackingNumber: null,
    type: 'Transportation',
    details: 'Local delivery',
    subDetails: '10 packages',
    status: 'Submitted',
    date: new Date('2024-01-22')
  }
]

// Helper function to format dates
const formatDate = (date: string | Date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

// Helper function to get badge colors
const getBadgeColor = (value: string, colorMap: Record<string, string>) => {
  return colorMap[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

// Column definitions - now without types
const userColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', subKey: 'email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'joinDate', label: 'Join Date' },
  { key: 'department', label: 'Department' }
]

const requestColumns = [
  { key: 'id', label: 'Request ID', subKey: 'trackingNumber' },
  { key: 'type', label: 'Type' },
  { key: 'details', label: 'Details', subKey: 'subDetails' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date Created' }
]

const meta = {
  title: 'UI Library/Datatable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A flexible and reusable data table component with slot-based column rendering for maximum flexibility.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title displayed at the top of the table'
    },
    description: {
      control: 'text',
      description: 'Optional description text below the title'
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state when true'
    },
    error: {
      control: 'boolean',
      description: 'Shows error state when true'
    },
    showPagination: {
      control: 'boolean',
      description: 'Whether to show pagination controls'
    }
  }
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

// Basic table story - default rendering
export const BasicTable: Story = {
  args: {
    title: 'Users',
    description: 'Basic table with default slot rendering',
    data: sampleUsers,
    columns: userColumns,
    showPagination: false
  }
}

// Story with custom slot rendering
export const WithCustomSlots: Story = {
  render: (args) => ({
    components: { DataTable },
    setup() {
      const roleColorMap = {
        Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        Moderator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        User: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      }
      
      const statusColorMap = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      }
      
      return { args, roleColorMap, statusColorMap, formatDate, getBadgeColor }
    },
    template: `
      <DataTable v-bind="args">
        <!-- Dual-line name + email -->
        <template #cell-name="{ item, value }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ value }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.email }}
            </div>
          </div>
        </template>
        
        <!-- Badge for role -->
        <template #cell-role="{ value }">
          <span :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getBadgeColor(value, roleColorMap)
          ]">
            {{ value }}
          </span>
        </template>
        
        <!-- Badge for status -->
        <template #cell-status="{ value }">
          <span :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getBadgeColor(value, statusColorMap)
          ]">
            {{ value }}
          </span>
        </template>
        
        <!-- Formatted date -->
        <template #cell-joinDate="{ value }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ formatDate(value) }}
          </span>
        </template>
      </DataTable>
    `
  }),
  args: {
    title: 'Users with Custom Rendering',
    description: 'Demonstrates slot-based custom rendering for badges, dates, and dual-line content',
    data: sampleUsers,
    columns: userColumns,
    showPagination: false
  }
}

// With header actions
export const WithHeaderActions: Story = {
  args: {
    title: 'Users',
    description: 'Table with header action buttons',
    data: sampleUsers,
    columns: userColumns,
    headerActions: [
      {
        label: 'Add User',
        handler: () => alert('Add user clicked'),
        icon: PlusIcon,
        variant: 'primary' as const
      },
      {
        label: 'Export',
        handler: () => alert('Export clicked'),
        icon: DocumentMagnifyingGlassIcon,
        variant: 'outline' as const
      }
    ],
    showPagination: false
  }
}

// With row actions
export const WithRowActions: Story = {
  args: {
    title: 'Users',
    description: 'Table with row-level action buttons',
    data: sampleUsers,
    columns: userColumns,
    rowActions: [
      {
        label: 'View',
        handler: (item: any) => alert(`View user: ${item.name}`),
        icon: EyeIcon
      },
      {
        label: 'Edit',
        handler: (item: any) => alert(`Edit user: ${item.name}`),
        icon: PencilIcon
      },
      {
        label: 'Delete',
        handler: (item: any) => alert(`Delete user: ${item.name}`),
        icon: TrashIcon,
        class: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200',
        condition: (item: any) => item.role !== 'Admin'
      }
    ],
    showPagination: false
  }
}

// Loading state
export const LoadingState: Story = {
  args: {
    title: 'Users',
    description: 'Loading user data...',
    data: [],
    columns: userColumns,
    loading: true,
    loadingText: 'Fetching users from server...',
    showPagination: false
  }
}

// Error state
export const ErrorState: Story = {
  args: {
    title: 'Users',
    description: 'Table with error state',
    data: [],
    columns: userColumns,
    error: true,
    errorTitle: 'Failed to Load Users',
    errorMessage: 'There was a problem connecting to the server. Please try again.',
    showPagination: false
  }
}

// Empty state
export const EmptyState: Story = {
  args: {
    title: 'Users',
    description: 'Table with empty state',
    data: [],
    columns: userColumns,
    emptyTitle: 'No Users Found',
    emptyMessage: 'There are no users in the system yet. Add your first user to get started.',
    emptyIcon: UserIcon,
    showPagination: false
  }
}

// With pagination
export const WithPagination: Story = {
  args: {
    title: 'Users',
    description: 'Table with pagination controls',
    data: sampleUsers,
    columns: userColumns,
    showPagination: true,
    pagination: {
      currentPage: 2,
      totalPages: 5,
      total: 45,
      startIndex: 10,
      endIndex: 20,
      visiblePages: [1, 2, 3, 4, 5]
    }
  }
}

// Requests table example with slots
export const RequestsTable: Story = {
  render: (args) => ({
    components: { DataTable },
    setup() {
      const typeColorMap = {
        Transportation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        Warehousing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }
      
      const statusColorMap = {
        Submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'In Transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }
      
      return { args, typeColorMap, statusColorMap, formatDate, getBadgeColor }
    },
    template: `
      <DataTable v-bind="args">
        <!-- Request ID with tracking number -->
        <template #cell-id="{ item, value }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ value }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.trackingNumber || 'Not assigned' }}
            </div>
          </div>
        </template>
        
        <!-- Type badge -->
        <template #cell-type="{ value }">
          <span :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getBadgeColor(value, typeColorMap)
          ]">
            {{ value }}
          </span>
        </template>
        
        <!-- Details with sub-details -->
        <template #cell-details="{ item, value }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">
              {{ value }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.subDetails }}
            </div>
          </div>
        </template>
        
        <!-- Status badge -->
        <template #cell-status="{ value }">
          <span :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getBadgeColor(value, statusColorMap)
          ]">
            {{ value }}
          </span>
        </template>
        
        <!-- Formatted date -->
        <template #cell-date="{ value }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ formatDate(value) }}
          </span>
        </template>
      </DataTable>
    `
  }),
  args: {
    title: 'Your Requests',
    description: 'Transportation and warehousing requests with custom slot rendering',
    data: sampleRequests,
    columns: requestColumns,
    headerActions: [
      {
        label: 'New Transportation',
        handler: () => alert('New transportation request'),
        icon: TruckIcon,
        variant: 'primary' as const
      },
      {
        label: 'New Warehousing',
        handler: () => alert('New warehousing request'),
        icon: BuildingStorefrontIcon,
        variant: 'secondary' as const
      }
    ],
    rowActions: [
      {
        label: 'View',
        handler: (item: any) => alert(`View request: ${item.id}`),
        icon: EyeIcon
      },
      {
        label: 'Track',
        handler: (item: any) => alert(`Track shipment: ${item.trackingNumber}`),
        icon: MapPinIcon,
        condition: (item: any) => item.trackingNumber && item.type === 'Transportation'
      }
    ],
    showPagination: false
  }
}

// Full featured example
export const FullFeatured: Story = {
  render: (args) => ({
    components: { DataTable },
    setup() {
      const roleColorMap = {
        Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        Moderator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        User: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      }
      
      const statusColorMap = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      }
      
      return { args, roleColorMap, statusColorMap, formatDate, getBadgeColor }
    },
    template: `
      <DataTable v-bind="args">
        <template #cell-name="{ item, value }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ value }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.email }}</div>
          </div>
        </template>
        <template #cell-role="{ value }">
          <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getBadgeColor(value, roleColorMap)]">{{ value }}</span>
        </template>
        <template #cell-status="{ value }">
          <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getBadgeColor(value, statusColorMap)]">{{ value }}</span>
        </template>
        <template #cell-joinDate="{ value }">
          <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(value) }}</span>
        </template>
      </DataTable>
    `
  }),
  args: {
    title: 'User Management',
    description: 'Complete user management with all DataTable features',
    data: sampleUsers,
    columns: userColumns,
    headerActions: [
      {
        label: 'Add User',
        handler: () => alert('Add user clicked'),
        icon: PlusIcon,
        variant: 'primary' as const
      },
      {
        label: 'Export',
        handler: () => alert('Export clicked'),
        variant: 'outline' as const
      }
    ],
    rowActions: [
      {
        label: 'View',
        handler: (item: any) => alert(`View user: ${item.name}`),
        icon: EyeIcon
      },
      {
        label: 'Edit',
        handler: (item: any) => alert(`Edit user: ${item.name}`),
        icon: PencilIcon
      },
      {
        label: 'Delete',
        handler: (item: any) => alert(`Delete user: ${item.name}`),
        icon: TrashIcon,
        class: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200',
        condition: (item: any) => item.role !== 'Admin'
      }
    ],
    showPagination: true,
    pagination: {
      currentPage: 1,
      totalPages: 3,
      total: 12,
      startIndex: 0,
      endIndex: 4,
      visiblePages: [1, 2, 3]
    }
  }
}

// Slot rendering showcase
export const SlotRendering: Story = {
  render: (args) => ({
    components: { DataTable },
    setup() {
      const badgeColorMap = {
        Success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }
      
      return { args, badgeColorMap, formatDate, getBadgeColor }
    },
    template: `
      <DataTable v-bind="args">
        <!-- Simple text (uses default rendering) -->
        
        <!-- Dual-line content -->
        <template #cell-complex="{ item, value }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ value }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.subtext }}
            </div>
          </div>
        </template>
        
        <!-- Badge rendering -->
        <template #cell-badge="{ value }">
          <span :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getBadgeColor(value, badgeColorMap)
          ]">
            {{ value }}
          </span>
        </template>
        
        <!-- Date formatting -->
        <template #cell-date="{ value }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ formatDate(value) }}
          </span>
        </template>
      </DataTable>
    `
  }),
  args: {
    title: 'Slot Rendering Demo',
    description: 'Demonstrates different slot-based rendering: text, dual-line, badge, and date',
    data: [
      {
        id: 1,
        simple: 'Simple text',
        complex: 'Primary text',
        subtext: 'Secondary text',
        badge: 'Success',
        date: new Date('2024-01-15')
      },
      {
        id: 2,
        simple: 'Another text',
        complex: 'More primary text',
        subtext: 'More secondary text',
        badge: 'Warning',
        date: new Date('2024-01-20')
      }
    ],
    columns: [
      { key: 'simple', label: 'Text Column' },
      { key: 'complex', label: 'Dual-line Column', subKey: 'subtext' },
      { key: 'badge', label: 'Badge Column' },
      { key: 'date', label: 'Date Column' }
    ],
    showPagination: false
  }
} 