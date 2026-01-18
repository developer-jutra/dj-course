<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClasses
    ]"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
export type BadgeVariant = 
  | 'blue'
  | 'yellow' 
  | 'orange'
  | 'cyan'
  | 'purple'
  | 'green'
  | 'gray'

interface Props {
  label: string
  variant?: BadgeVariant
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'blue'
})

const colorClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return colors[props.variant]
})
</script>
