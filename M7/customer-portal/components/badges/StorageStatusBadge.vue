<template>
  <Tooltip>
    <template #trigger>
      <Badge 
        :label="getStatusLabel(status)" 
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
import type { BadgeVariant } from '~/components/ui-library/badge/Badge.vue'
import Tooltip from '~/components/ui-library/tooltip/Tooltip.vue'

interface Props {
  status: string
}

const props = defineProps<Props>()

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'SUBMITTED': 'Submitted',
    'UNDER_REVIEW': 'Under Review',
    'APPROVED': 'Approved',
    'PENDING_ARRIVAL': 'Pending Arrival',
    'RECEIVED': 'Received',
    'STORED': 'Stored',
    'COMPLETED': 'Completed'
  }
  return labels[status] || status
}

const getStatusVariant = (status: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'SUBMITTED': 'yellow',
    'UNDER_REVIEW': 'blue',
    'APPROVED': 'green',
    'PENDING_ARRIVAL': 'purple',
    'RECEIVED': 'cyan',
    'STORED': 'blue',
    'COMPLETED': 'gray'
  }
  return variants[status] || 'gray'
}

const getStatusDescription = (status: string): string => {
  const descriptions: Record<string, string> = {
    'SUBMITTED': 'The warehousing request has been submitted and is pending review.',
    'UNDER_REVIEW': 'The request is under review by our warehousing team.',
    'APPROVED': 'The request has been approved and is ready for processing.',
    'PENDING_ARRIVAL': 'Awaiting arrival of goods at the warehouse.',
    'RECEIVED': 'The goods have been received into storage.',
    'STORED': 'The goods are now stored in the warehouse.',
    'COMPLETED': 'The warehousing request has been completed.'
  }
  return descriptions[status] || 'Status information not available.'
}
</script>
