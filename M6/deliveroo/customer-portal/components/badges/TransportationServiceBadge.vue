<template>
  <Tooltip>
    <template #trigger>
      <Badge 
        :label="formatServiceType(serviceType)" 
        variant="blue" 
      />
    </template>
    <template #content>
      {{ getServiceDescription(serviceType) }}
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import Badge from '~/components/ui-library/badge/Badge.vue'
import Tooltip from '~/components/ui-library/tooltip/Tooltip.vue'
import type { TransportServiceType } from '~/features/transportation/transportation-requests-listing/transportation-request.model'

interface Props {
  serviceType: TransportServiceType
}

const props = defineProps<Props>()

const formatServiceType = (type: string) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getServiceDescription = (type: TransportServiceType): string => {
  const descriptions: Record<TransportServiceType, string> = {
    FULL_TRUCKLOAD: 'Dedicated full truck for your shipment, ensuring quickest transit and no shared space.',
    LESS_THAN_TRUCKLOAD: 'Consolidated shipping, sharing truck space with other shipments for cost savings.',
    EXPRESS_DELIVERY: 'Priority shipping guaranteeing faster delivery than standard options.',
    OVERSIZED_CARGO: 'Special handling for large or heavy items exceeding standard dimensions.',
    HAZARDOUS_MATERIALS: 'Specialized handling and compliance for dangerous or regulated materials.'
  }
  return descriptions[type] || 'Service information not available.'
}
</script>
