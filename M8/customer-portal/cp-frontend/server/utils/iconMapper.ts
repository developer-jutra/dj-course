import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon
} from '@heroicons/vue/24/outline'

/**
 * Maps icon names stored in MongoDB to actual Vue icon components
 */
export const iconMap: Record<string, any> = {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon
}

/**
 * Gets the icon component by name
 */
export function getIconComponent(iconName: string) {
  return iconMap[iconName] || null
}
