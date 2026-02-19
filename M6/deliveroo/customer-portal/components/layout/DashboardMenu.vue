<template>
  <div>
    <!-- Mobile sidebar -->
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="$emit('update:open', false)">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="$emit('update:open', false)">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center">
                  <NuxtLink to="/dashboard" class="flex items-center gap-2">
                    <AppLogo size="h-8" />
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">Customer Portal</span>
                  </NuxtLink>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <NuxtLink
                            :to="item.href"
                            :class="[
                              item.current
                                ? 'bg-gray-50 dark:bg-gray-800 text-success-600 dark:text-success-400'
                                : 'text-gray-700 dark:text-gray-300 hover:text-success-600 dark:hover:text-success-400 hover:bg-gray-50 dark:hover:bg-gray-800',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            ]"
                          >
                            <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                            {{ item.name }}
                          </NuxtLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div :class="[
      'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out',
      collapsed ? 'lg:w-20' : 'lg:w-60'
    ]">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center justify-center">
          <NuxtLink to="/dashboard" class="flex items-center gap-x-2">
            <AppLogo size="h-8" />
            <span v-if="!collapsed" class="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">Customer Portal</span>
          </NuxtLink>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <NuxtLink
                    :to="item.href"
                    :class="[
                      item.current
                        ? 'bg-gray-50 dark:bg-gray-800 text-success-600 dark:text-success-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-success-600 dark:hover:text-success-400 hover:bg-gray-50 dark:hover:bg-gray-800',
                      'group flex items-center rounded-md p-2 text-sm leading-6 font-semibold transition-colors relative',
                      collapsed ? 'justify-center' : 'gap-x-3'
                    ]"
                    :title="collapsed ? item.name : ''"
                  >
                    <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span v-if="!collapsed" class="truncate">
                      {{ item.name }}
                    </span>
                    
                    <!-- Tooltip for collapsed state -->
                    <div v-if="collapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {{ item.name }}
                    </div>
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  XMarkIcon,
  ChartBarIcon,
  TruckIcon,
  MapIcon,
  CogIcon,
  UsersIcon,
  CreditCardIcon,
  InboxStackIcon,
  ArchiveBoxIcon
} from '@heroicons/vue/24/outline'

defineEmits(['update:open', 'update:collapsed'])
defineProps<{
  open: boolean
  collapsed: boolean
}>()

const route = useRoute()

const navigation = computed(() => [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon, current: route.path === '/dashboard' },
  { name: 'Service Requests', href: '/dashboard/requests', icon: InboxStackIcon, current: route.path.startsWith('/dashboard/requests') },
  { name: 'Storage', href: '/dashboard/warehousing', icon: ArchiveBoxIcon, current: route.path.startsWith('/dashboard/warehousing') },
  { name: 'Shipments', href: '/dashboard/transportation', icon: TruckIcon, current: route.path.startsWith('/dashboard/transportation') },
  { name: 'Tracking', href: '/dashboard/tracking', icon: MapIcon, current: route.path.startsWith('/dashboard/tracking') },
  { name: 'Billing & Payments', href: '/dashboard/billing', icon: CreditCardIcon, current: route.path.startsWith('/dashboard/billing') },
  { name: 'Team', href: '/dashboard/team', icon: UsersIcon, current: route.path.startsWith('/dashboard/team') },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, current: route.path.startsWith('/dashboard/settings') },
])
</script>