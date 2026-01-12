<template>
  <DataTable
    title="Storage Items"
    description="Inventory items in storage"
    :data="storageItems"
    :columns="columns"
    :loading="isLoading"
    :error="isError"
    loading-text="Loading storage items..."
    error-title="Error Loading Storage Items"
    error-message="There was a problem loading storage items."
    :row-actions="rowActions"
    @retry="fetchItems"
  >
    <template #cell-cargoType="{ value }">
      <StorageTypeBadge :storageType="value" />
    </template>
    <template #cell-status="{ value }">
      <StorageStatusBadge :status="value" />
    </template>
    <template #cell-arrivalDate="{ value }">
      <span class="text-sm text-gray-900 dark:text-white">
        {{ formatDate(value) }}
      </span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from '~/components/ui-library/datatable/DataTable.vue';
import type { StorageItem } from './storage-listing.model';
import { getStorageItems } from './storage-listing-api';
import { ref, onMounted, watch } from 'vue';
import { EyeIcon } from '@heroicons/vue/24/outline';
import { navigateTo } from '#app';
import StorageTypeBadge from '~/components/badges/StorageTypeBadge.vue'
import StorageStatusBadge from '~/components/badges/StorageStatusBadge.vue'

const props = defineProps<{ filters: { status: string; cargoType: string } }>();
const storageItems = ref<StorageItem[]>([]);
const isLoading = ref(false);
const isError = ref(false);

const fetchItems = async () => {
  isLoading.value = true;
  isError.value = false;
  try {
    storageItems.value = await getStorageItems(props.filters);
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchItems);
watch(() => props.filters, fetchItems, { deep: true });

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'cargoType', label: 'Cargo Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'storageLocation', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'arrivalDate', label: 'Arrival Date' }
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

const rowActions = [
  {
    label: 'View',
    icon: EyeIcon,
    handler: async (item: StorageItem) => {
      console.log('View clicked - navigating to:', `/dashboard/warehousing/${item.id}`)
      try {
        await navigateTo(`/dashboard/warehousing/${item.id}`)
        console.log('Navigation completed')
      } catch (error) {
        console.error('Navigation error:', error)
      }
    },
  }
];
</script> 