<template>
  <Tooltip>
    <template #trigger>
      <Badge 
        :label="formatStatus(status)" 
        :variant="getStatusVariant(status)" 
      />
    </template>
    <template #content>
      {{ getStatusDescription(status) }}
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import Badge from '~/components/ui-library/badge/Badge.vue'
import Tooltip from '~/components/ui-library/tooltip/Tooltip.vue'
import type { BadgeVariant } from '~/components/ui-library/badge/Badge.vue'

interface Props {
  status: string
}

const props = defineProps<Props>()

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusVariant = (status: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'SUBMITTED': 'yellow',
    'IN_PROGRESS': 'blue',
    'PICKUP_SCHEDULED': 'orange',
    'PICKED_UP': 'cyan',
    'IN_TRANSIT': 'purple',
    'DELIVERED': 'green'
  }
  return variants[status] || 'gray'
}

const getStatusDescription = (status: string): string => {
  const descriptions: Record<string, string> = {
    'SUBMITTED': 'The transportation request has been submitted and is pending review by our logistics team.',
    'IN_PROGRESS': 'The request is being processed and we are working to assign a carrier for your shipment.',
    'PICKUP_SCHEDULED': 'Pickup has been scheduled with the carrier. You will receive pickup details shortly.',
    'PICKED_UP': 'Your items have been successfully picked up from the origin location and are ready for transport.',
    'IN_TRANSIT': 'Your shipment is currently being transported to the destination location.',
    'DELIVERED': 'Your shipment has been successfully delivered to the destination location.'
  }
  return descriptions[status] || 'Status information not available.'
}
</script>
