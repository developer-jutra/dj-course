<template>
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Member
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Permissions
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Active
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="member in teamMembers"
            :key="member.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    class="h-10 w-10 rounded-full"
                    :src="`https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&seed=${member.id}`"
                    :alt="member.firstName + ' ' + member.lastName"
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ member.firstName }} {{ member.lastName }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ member.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getRoleColor(member.role)
                ]"
              >
                {{ formatRole(member.role) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="permission in member.permissions.slice(0, 2)"
                  :key="permission"
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {{ formatPermission(permission) }}
                </span>
                <span
                  v-if="member.permissions.length > 2"
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  +{{ member.permissions.length - 2 }} more
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  member.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]"
              >
                {{ member.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(member.updatedAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-3">
                <button
                  @click="$emit('edit', member)"
                  class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Edit member"
                >
                  <PencilIcon class="h-5 w-5 mr-1" />
                  <span>Edit</span>
                </button>
                <button
                  v-if="member.role !== 'COMPANY_ADMIN'"
                  @click="$emit('remove', member)"
                  class="flex items-center text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  title="Remove member"
                >
                  <TrashIcon class="h-5 w-5 mr-1" />
                  <span>Remove</span>
                </button>
                <button
                  v-else
                  disabled
                  class="flex items-center text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  title="Cannot remove company admin"
                >
                  <TrashIcon class="h-5 w-5 mr-1" />
                  <span>Remove</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { User } from '~/model/user'
import { roleColorMap } from './team.mocks'

interface Props {
  teamMembers: User[]
}

interface Emits {
  (e: 'edit', member: User): void
  (e: 'remove', member: User): void
}

defineProps<Props>()
defineEmits<Emits>()

const formatRole = (role: string) => {
  return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatPermission = (permission: string) => {
  return permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getRoleColor = (role: string) => {
  return roleColorMap[role as keyof typeof roleColorMap] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}
</script> 