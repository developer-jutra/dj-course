<template>
  <Menu as="div" class="relative">
    <MenuButton class="-m-1.5 flex items-center p-1.5">
      <span class="sr-only">Open user menu</span>
      <img
        class="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800"
        src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
        alt="User avatar"
      />
      <span class="hidden lg:flex lg:items-center">
        <ClientOnly>
          <span class="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white" aria-hidden="true">
            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
          </span>
          <template #fallback>
            <span class="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white" aria-hidden="true">
              &nbsp;
            </span>
          </template>
        </ClientOnly>
        <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </span>
    </MenuButton>
    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none">
        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
          <button
            v-if="item.action"
            @click="item.action"
            :class="[active ? 'bg-gray-50 dark:bg-gray-700' : '', 'block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white']"
          >
            {{ item.name }}
          </button>
          <NuxtLink
            v-else
            :to="item.href"
            :class="[active ? 'bg-gray-50 dark:bg-gray-700' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white']"
          >
            {{ item.name }}
          </NuxtLink>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const authStore = useAuthStore()

const userNavigation = [
  { name: 'Settings', href: '/dashboard/settings' },
  { name: 'Sign out', action: () => authStore.logout() },
]
</script>