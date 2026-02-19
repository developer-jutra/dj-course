import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon
} from '@heroicons/vue/24/outline'
import { mockDashboardStats, mockQuickActions, mockRecentRequests, mockMetrics, mockRoutePerformance } from './dashboard.mocks'
import type {
  DashboardStat,
  QuickAction,
  RecentRequest,
  Metrics,
  RoutePerformance
} from './dashboard.model'

const iconNameToComponent: Record<string, any> = {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon
}

async function fetchFromApi<T>(url: string): Promise<T | null> {
  try {
    return await $fetch<T>(url)
  } catch {
    return null
  }
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const raw = await fetchFromApi<Array<{ name: string; value: string; iconName: string; color: string }>>('/api/dashboard/stats')
  if (raw?.length) {
    return raw.map((s) => ({
      name: s.name,
      value: s.value,
      icon: iconNameToComponent[s.iconName] ?? ClockIcon,
      color: s.color
    }))
  }
  return mockDashboardStats
}

export async function getQuickActions(): Promise<QuickAction[]> {
  const raw = await fetchFromApi<Array<{ name: string; description: string; iconName: string; href: string }>>('/api/dashboard/quick-actions')
  if (raw?.length) {
    return raw.map((a) => ({
      name: a.name,
      description: a.description,
      icon: iconNameToComponent[a.iconName] ?? MapIcon,
      href: a.href
    }))
  }
  return mockQuickActions
}

export async function getRecentRequests(): Promise<RecentRequest[]> {
  const raw = await fetchFromApi<Array<{ id: string; type: string; status: string; route: string; date: string }>>('/api/dashboard/recent-requests')
  if (raw?.length) {
    return raw.map((r) => ({
      id: r.id,
      type: r.type,
      status: r.status,
      route: r.route,
      date: new Date(r.date)
    }))
  }
  return mockRecentRequests
}

export async function getMetrics(): Promise<Metrics> {
  const raw = await fetchFromApi<Metrics>('/api/dashboard/metrics')
  if (raw) {
    return raw
  }
  return mockMetrics
}

export async function getRoutePerformance(): Promise<RoutePerformance[]> {
  const raw = await fetchFromApi<RoutePerformance[]>('/api/dashboard/route-performance')
  if (raw?.length) {
    return raw
  }
  return mockRoutePerformance
}

export async function generateReports(dateRange: { from: string; to: string }) {
  if (process.server) return

  const [metrics, routePerformance] = await Promise.all([
    getMetrics(),
    getRoutePerformance()
  ])

  const { generateReportsPDF } = await import('~/lib/pdf/reportsPdfGenerator')

  await generateReportsPDF({
    dateRange,
    metrics,
    routePerformance
  })

  return { success: true }
}

export async function exportReport(format: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  console.log(`Exporting report in ${format} format`)
  return { success: true }
}
