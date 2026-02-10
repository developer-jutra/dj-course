<template>
  <div class="relative inline-block">
    <!-- Trigger element -->
    <div 
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
      class="cursor-pointer"
    >
      <slot name="trigger" />
    </div>
    
    <!-- Tooltip content -->
    <div 
      v-show="isVisible"
      :class="[
        'absolute z-50 px-3 py-1.5 text-sm text-white bg-gray-900 rounded-md shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-150',
        'whitespace-nowrap',
        positionClasses
      ]"
      role="tooltip"
    >
      <slot name="content" />
      <!-- Tooltip arrow -->
      <div :class="arrowClasses"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  side: 'top',
  sideOffset: 8,
  disabled: false
})

const emit = defineEmits<{
  show: []
  hide: []
}>()

const isVisible = ref(false)

const showTooltip = () => {
  if (props.disabled) return
  isVisible.value = true
  emit('show')
}

const hideTooltip = () => {
  isVisible.value = false
  emit('hide')
}

const positionClasses = computed(() => {
  const offset = `${props.sideOffset}px`
  
  switch (props.side) {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    case 'right':
      return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
    case 'left':
      return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
    default:
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
  }
})

const arrowClasses = computed(() => {
  const base = 'absolute w-2 h-2 bg-gray-900 transform rotate-45'
  
  switch (props.side) {
    case 'top':
      return `${base} top-full left-1/2 -translate-x-1/2 -translate-y-1/2`
    case 'right':
      return `${base} right-full top-1/2 translate-x-1/2 -translate-y-1/2`
    case 'bottom':
      return `${base} bottom-full left-1/2 -translate-x-1/2 translate-y-1/2`
    case 'left':
      return `${base} left-full top-1/2 -translate-x-1/2 -translate-y-1/2`
    default:
      return `${base} top-full left-1/2 -translate-x-1/2 -translate-y-1/2`
  }
})
</script>

<style scoped>
.animate-in {
  animation-duration: 150ms;
  animation-fill-mode: both;
}

.fade-in-0 {
  animation: fadeIn 150ms ease-out;
}

.zoom-in-95 {
  animation: zoomIn 150ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<!--
USAGE EXAMPLES:

1. Basic tooltip:
<Tooltip variant="root">
  <Tooltip variant="trigger">
    <button>Hover me</button>
  </Tooltip>
  <Tooltip variant="content">
    This is a tooltip
  </Tooltip>
</Tooltip>

2. With custom styling:
<Tooltip variant="content" className="custom-class" :side-offset="8">
  Custom tooltip content
</Tooltip>

3. With provider (for multiple tooltips):
<Tooltip variant="provider">
  Multiple tooltips here 
</Tooltip>
-->
