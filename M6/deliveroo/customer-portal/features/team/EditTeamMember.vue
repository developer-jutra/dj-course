<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeModal"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
      @click.stop
    >
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Edit Team Member
        </h3>
        
        <form @submit.prevent="handleUpdate" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="input"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role *
            </label>
            <select
              v-model="form.role"
              required
              class="input"
              :disabled="member?.role === 'COMPANY_ADMIN'"
            >
              <option value="">Select role</option>
              <option
                v-for="role in roleOptions"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }}
              </option>
              <option
                v-if="member?.role === 'COMPANY_ADMIN'"
                value="COMPANY_ADMIN"
              >
                Company Admin
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permissions
            </label>
            <div class="space-y-2">
              <label
                v-for="permission in availablePermissions"
                :key="permission.value"
                class="flex items-center"
              >
                <input
                  v-model="form.permissions"
                  type="checkbox"
                  :value="permission.value"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {{ permission.name }}
                </span>
              </label>
            </div>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="form.isActive"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Active member
            </span>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary"
            >
              <span v-if="!loading">Update Member</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/model/user'
import type { EditTeamMemberForm, AvailablePermission } from './team.model'
import { roleOptions } from './team.mocks'

interface Props {
  show: boolean
  member: User | null
  availablePermissions: AvailablePermission[]
  loading: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'update', data: EditTeamMemberForm): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive<EditTeamMemberForm>({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  permissions: [],
  isActive: true
})

const closeModal = () => {
  emit('close')
}

const handleUpdate = () => {
  emit('update', form)
}

// Reset and populate form when member changes
watch(() => props.member, (newMember) => {
  if (newMember) {
    form.id = newMember.id
    form.firstName = newMember.firstName
    form.lastName = newMember.lastName
    form.email = newMember.email
    form.phone = newMember.phone
    form.role = newMember.role
    form.permissions = [...newMember.permissions]
    form.isActive = newMember.isActive
  }
}, { immediate: true })

// Reset form when modal closes
watch(() => props.show, (newShow) => {
  if (!newShow) {
    form.id = ''
    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.phone = ''
    form.role = ''
    form.permissions = []
    form.isActive = true
  }
})
</script>
