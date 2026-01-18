<template>
  <Tooltip>
    <template #trigger>
      <Badge 
        :label="formatPriority(priority)" 
        :variant="getPriorityVariant(priority)" 
      />
    </template>
    <template #content>
      {{ getPriorityDescription(priority) }}
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import Badge from '~/components/ui-library/badge/Badge.vue'
import type { BadgeVariant } from '~/components/ui-library/badge/Badge.vue'
import Tooltip from '~/components/ui-library/tooltip/Tooltip.vue'

interface Props {
  priority: string
}

const props = defineProps<Props>()

const formatPriority = (priority: string): string => {
  return priority.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getPriorityVariant = (priority: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'LOW': 'gray',
    'NORMAL': 'blue',
    'HIGH': 'orange',
    'URGENT': 'yellow'
  }
  return variants[priority] || 'gray'
}

const getPriorityDescription = (priority: string): string => {
  const descriptions: Record<string, string> = {
    'LOW': 'Low priority: Standard processing time applies.',
    'NORMAL': 'Normal priority: Standard processing.',
    'HIGH': 'High priority: Expedited processing.',
    'URGENT': 'Urgent priority: Immediate processing is required.'
  }
  return descriptions[priority] || 'Priority information not available.'
}
</script>
