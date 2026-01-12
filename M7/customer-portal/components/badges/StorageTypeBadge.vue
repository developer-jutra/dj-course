<template>
  <Tooltip>
    <template #trigger>
      <Badge 
        :label="formatStorageType(storageType)" 
        :variant="getStorageTypeVariant(storageType)" 
      />
    </template>
    <template #content>
      {{ getStorageTypeDescription(storageType) }}
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import Badge from '~/components/ui-library/badge/Badge.vue'
import type { BadgeVariant } from '~/components/ui-library/badge/Badge.vue'
import Tooltip from '~/components/ui-library/tooltip/Tooltip.vue'

interface Props {
  storageType: string
}

const props = defineProps<Props>()

const formatStorageType = (type: string): string => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getStorageTypeVariant = (type: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'AMBIENT': 'gray',
    'REFRIGERATED': 'cyan',
    'FROZEN': 'blue',
    'CLIMATE_CONTROLLED': 'green',
    'HAZARDOUS': 'orange',
    'SECURE': 'purple'
  }
  return variants[type] || 'gray'
}

const getStorageTypeDescription = (type: string): string => {
  const descriptions: Record<string, string> = {
    'AMBIENT': 'Ambient storage: no temperature control.',
    'PERISHABLE': 'Refrigerated in 2–8°C.',
    'FROZEN': 'Frozen storage: -18°C or below.',
    'DRY': 'Dry storage: regulated temperature and humidity.',
    'HAZARDOUS': 'Hazardous storage: Compliance with safety regulations.',
    'SECURE': 'Secure storage: Restricted access and enhanced security.'
  }
  return descriptions[type] || 'Storage type information not available.'
}
</script>
