import { 
  mockDashboardStats, 
  mockQuickActions, 
  mockRecentRequests, 
  mockMetrics, 
  mockRoutePerformance 
} from '../dashboard.mocks'
import type { 
  DashboardStat, 
  QuickAction, 
  RecentRequest, 
  Metrics, 
  RoutePerformance 
} from '../dashboard.model'

// Helper to map icon names from MongoDB to actual icon components
import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon,
  ScaleIcon
} from '@heroicons/vue/24/outline'

const iconMap: Record<string, any> = {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon,
  ScaleIcon
}

/**
 * Composable for fetching dashboard data
 * Can use either mocks or real API endpoints
 */
export function useDashboardData() {
  const USE_MOCKS = false // Set to true to use mocks instead of MongoDB

  async function fetchDashboardStats(): Promise<DashboardStat[]> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockDashboardStats
    }

    const data = await $fetch('/api/dashboard/stats')
    // Map iconName strings to actual icon components
    return data.map(stat => ({
      ...stat,
      icon: iconMap[stat.iconName] || TruckIcon
    }))
  }

  async function fetchQuickActions(): Promise<QuickAction[]> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockQuickActions
    }

    const data = await $fetch('/api/dashboard/quick-actions')
    // Map iconName strings to actual icon components
    return data.map(action => ({
      ...action,
      icon: iconMap[action.iconName] || TruckIcon
    }))
  }

  async function fetchRecentRequests(): Promise<RecentRequest[]> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 600))
      return mockRecentRequests
    }

    const data = await $fetch('/api/dashboard/recent-requests')
    // Dates are serialized as strings, convert back to Date objects
    return data.map(req => ({
      ...req,
      date: new Date(req.date)
    }))
  }

  async function fetchMetrics(): Promise<Metrics> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 800))
      return mockMetrics
    }

    return await $fetch('/api/dashboard/metrics')
  }

  async function fetchRoutePerformance(): Promise<RoutePerformance[]> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 700))
      return mockRoutePerformance
    }

    return await $fetch('/api/dashboard/route-performance')
  }

  return {
    fetchDashboardStats,
    fetchQuickActions,
    fetchRecentRequests,
    fetchMetrics,
    fetchRoutePerformance
  }
}
