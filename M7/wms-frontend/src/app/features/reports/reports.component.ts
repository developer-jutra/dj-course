import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from './reports.service';
import { 
  OperationalMetrics, 
  UtilizationReport, 
  FinancialReport, 
  AuditTrail 
} from './reports.model';
import { DropdownComponent } from '../../ui-library/Dropdown.component';
import { Heading1Component, Heading3Component, Heading4Component, SectionHeadingComponent, SubtitleComponent } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent, Heading1Component, SubtitleComponent, Heading3Component, Heading4Component, SectionHeadingComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <ui-heading1>Reports & Analytics</ui-heading1>
        <ui-subtitle>View warehouse performance reports and analytics</ui-subtitle>
      </div>

      <!-- Report Type Tabs -->
      <div class="card">
        <div class="border-b border-gray-200 dark:border-dark-700">
          <nav class="-mb-px flex space-x-8 px-6">
            @for (tab of reportTabs; track tab.id) {
              <button (click)="activeTab = tab.id"
                      [class]="getTabClass(tab.id)"
                      class="py-4 px-1 border-b-2 font-medium text-sm transition-colors">
                <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path [attr.d]="tab.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
                {{ tab.name }}
              </button>
            }
          </nav>
        </div>

        <!-- Operational Metrics Tab -->
        @if (activeTab === 'operational') {
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <ui-heading3>Operational Metrics & KPIs</ui-heading3>
              <div class="flex space-x-3">
                <ui-dropdown
                  label="Period"
                  [options]="[
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' },
                    { value: 'quarter', label: 'This Quarter' }
                  ]"
                  [value]="operationalPeriod"
                  (valueChange)="operationalPeriod = $event; loadOperationalMetrics()"
                />
                <button (click)="exportReport('operational')" class="btn btn-secondary">
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            <!-- KPI Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="card p-6">
                <div class="flex items-center">
                  <div class="p-2 bg-primary-100 rounded-lg">
                    <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Throughput</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ operationalMetrics?.throughput || 0 }}</p>
                    <p class="text-xs text-gray-500">items/hour</p>
                  </div>
                </div>
              </div>

              <div class="card p-6">
                <div class="flex items-center">
                  <div class="p-2 bg-success-100 rounded-lg">
                    <svg class="h-6 w-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Order Accuracy</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ operationalMetrics?.orderAccuracy || 0 }}%</p>
                    <p class="text-xs text-gray-500">accuracy rate</p>
                  </div>
                </div>
              </div>

              <div class="card p-6">
                <div class="flex items-center">
                  <div class="p-2 bg-warning-100 rounded-lg">
                    <svg class="h-6 w-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Processing Time</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ operationalMetrics?.avgProcessingTime || 0 }}</p>
                    <p class="text-xs text-gray-500">minutes</p>
                  </div>
                </div>
              </div>

              <div class="card p-6">
                <div class="flex items-center">
                  <div class="p-2 bg-error-100 rounded-lg">
                    <svg class="h-6 w-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Error Rate</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ operationalMetrics?.errorRate || 0 }}%</p>
                    <p class="text-xs text-gray-500">error rate</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="card p-6">
                <ui-section-heading>Daily Throughput Trend</ui-section-heading>
                <div class="h-64 bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  @if (operationalMetrics?.dailyThroughputTrend) {
                    <svg class="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
                      <!-- Grid lines -->
                      <line x1="40" y1="20" x2="40" y2="160" stroke="#e5e7eb" stroke-width="2"/>
                      <line x1="40" y1="160" x2="480" y2="160" stroke="#e5e7eb" stroke-width="2"/>
                      
                      <!-- Horizontal grid lines -->
                      @for (line of [0, 1, 2, 3, 4]; track line) {
                        <line [attr.x1]="40" [attr.y1]="20 + line * 35" [attr.x2]="480" [attr.y2]="20 + line * 35" 
                              stroke="#f3f4f6" stroke-width="1" stroke-dasharray="5,5"/>
                      }
                      
                      <!-- Y-axis labels -->
                      @for (label of getChartYAxisLabels(); track label.value) {
                        <text [attr.x]="30" [attr.y]="label.y + 5" 
                              class="text-xs fill-gray-600 dark:fill-gray-400" text-anchor="end">
                          {{ label.value }}
                        </text>
                      }
                      
                      <!-- Line path -->
                      <polyline [attr.points]="getChartLinePath()" 
                                fill="none" stroke="#3B82F6" stroke-width="3" stroke-linejoin="round"/>
                      
                      <!-- Data points -->
                      @for (point of getChartDataPoints(); track point.x) {
                        <circle [attr.cx]="point.x" [attr.cy]="point.y" r="5" 
                                fill="#3B82F6" class="hover:fill-primary-700 cursor-pointer"/>
                      }
                      
                      <!-- X-axis labels -->
                      @for (item of operationalMetrics?.dailyThroughputTrend; track item.date; let i = $index) {
                        <text [attr.x]="getChartXPosition(i)" [attr.y]="180" 
                              class="text-xs fill-gray-600 dark:fill-gray-400" text-anchor="middle">
                          {{ item.date }}
                        </text>
                      }
                      
                      <!-- Value labels on points -->
                      @for (point of getChartDataPoints(); track point.x) {
                        <text [attr.x]="point.x" [attr.y]="point.y - 10" 
                              class="text-xs fill-gray-900 dark:fill-white font-medium" text-anchor="middle">
                          {{ point.value }}
                        </text>
                      }
                    </svg>
                  } @else {
                    <div class="flex items-center justify-center h-full">
                      <p class="text-gray-500 dark:text-gray-400">No chart data available</p>
                    </div>
                  }
                </div>
              </div>

              <div class="card p-6">
                <ui-section-heading>Order Processing Performance</ui-section-heading>
                <div class="space-y-4">
                  @for (metric of operationalMetrics?.detailedMetrics; track metric.name) {
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ metric.name }}</span>
                      <div class="flex items-center space-x-2">
                        <div class="w-24 bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div class="bg-primary-600 h-2 rounded-full" [style.width.%]="metric.value"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ metric.value }}%</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Utilization Reports Tab -->
        @if (activeTab === 'utilization') {
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <ui-heading3>Utilization Reports</ui-heading3>
              <div class="flex space-x-3">
                <ui-dropdown
                  label="Period"
                  [options]="[
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' },
                    { value: 'quarter', label: 'This Quarter' },
                    { value: 'year', label: 'This Year' }
                  ]"
                  [value]="utilizationPeriod"
                  (valueChange)="utilizationPeriod = $event; loadUtilizationReports()"
                />
                <button (click)="exportReport('utilization')" class="btn btn-secondary">
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            <!-- Utilization Categories -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Space Utilization -->
              <div class="card p-6">
                <ui-heading4>Space Utilization</ui-heading4>
                <div class="space-y-4">
                  @for (zone of utilizationReport?.spaceUtilization; track zone.zoneName) {
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ zone.zoneName }}</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ zone.utilization }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                        <div [class]="getUtilizationBarClass(zone.utilization)"
                             class="h-2 rounded-full transition-all"
                             [style.width.%]="zone.utilization"></div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Equipment Utilization -->
              <div class="card p-6">
                <ui-heading4>Equipment Utilization</ui-heading4>
                <div class="space-y-4">
                  @for (equipment of utilizationReport?.equipmentUtilization; track equipment.equipmentType) {
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ equipment.equipmentType }}</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ equipment.utilization }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                        <div [class]="getUtilizationBarClass(equipment.utilization)"
                             class="h-2 rounded-full transition-all"
                             [style.width.%]="equipment.utilization"></div>
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ equipment.activeHours }}h active / {{ equipment.totalHours }}h total
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Personnel Utilization -->
              <div class="card p-6">
                <ui-heading4>Personnel Utilization</ui-heading4>
                <div class="space-y-4">
                  @for (personnel of utilizationReport?.personnelUtilization; track personnel.role) {
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ personnel.role }}</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ personnel.utilization }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                        <div [class]="getUtilizationBarClass(personnel.utilization)"
                             class="h-2 rounded-full transition-all"
                             [style.width.%]="personnel.utilization"></div>
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ personnel.activeEmployees }} / {{ personnel.totalEmployees }} employees
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Detailed Utilization Table -->
            <div class="card p-6 mt-6">
              <ui-heading4>Detailed Utilization Breakdown</ui-heading4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                  <thead class="bg-gray-50 dark:bg-dark-800">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Used</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Utilization</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                    @for (item of utilizationReport?.detailedBreakdown; track item.name) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.type }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.capacity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.used }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-16 bg-gray-200 dark:bg-dark-700 rounded-full h-2 mr-2">
                              <div [class]="getUtilizationBarClass(item.utilization)"
                                   class="h-2 rounded-full"
                                   [style.width.%]="item.utilization"></div>
                            </div>
                            <span class="text-sm text-gray-900 dark:text-white">{{ item.utilization }}%</span>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span [class]="getUtilizationStatusClass(item.utilization)"
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                            {{ getUtilizationStatus(item.utilization) }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }

        <!-- Financial Reports Tab -->
        @if (activeTab === 'financial') {
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <ui-heading3>Financial Reports</ui-heading3>
              <div class="flex space-x-3">
                <ui-dropdown
                  label="Period"
                  [options]="[
                    { value: 'month', label: 'This Month' },
                    { value: 'quarter', label: 'This Quarter' },
                    { value: 'year', label: 'This Year' },
                    { value: 'custom', label: 'Custom Range' }
                  ]"
                  [value]="financialPeriod"
                  (valueChange)="financialPeriod = $event; loadFinancialReports()"
                />
                <button (click)="exportReport('financial')" class="btn btn-secondary">
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            <!-- Financial Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="card p-6">
                <div class="flex items-center">
                  <div class="p-2 bg-success-100 rounded-lg">
                    <svg class="h-6 w-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">\${{ formatCurrency(financialReport?.totalRevenue) }}</p>
                    <p class="text-xs text-success-600">+{{ financialReport?.revenueGrowth }}% vs last period</p>
                  </div>
                </div>
              </div>

              <div class="card p-6">
                <div class="flex items-center">
                  <div class="p-2 bg-primary-100 rounded-lg">
                    <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Operating Costs</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">\${{ formatCurrency(financialReport?.operatingCosts) }}</p>
                    <p class="text-xs text-error-600">+{{ financialReport?.costIncrease }}% vs last period</p>
                  </div>
                </div>
              </div>

              <div class="card p-6">
                <div class="flex items-center">
                  <div class="p-2 bg-warning-100 rounded-lg">
                    <svg class="h-6 w-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">\${{ formatCurrency(financialReport?.netProfit) }}</p>
                    <p class="text-xs text-success-600">{{ financialReport?.profitMargin }}% margin</p>
                  </div>
                </div>
              </div>

              <div class="card p-6">
                <div class="flex items-center">
                  <div class="p-2 bg-secondary-100 rounded-lg">
                    <svg class="h-6 w-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Outstanding Invoices</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">\${{ formatCurrency(financialReport?.outstandingInvoices) }}</p>
                    <p class="text-xs text-gray-500">{{ financialReport?.overdueCount }} overdue</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Revenue Breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="card p-6">
                <ui-heading4>Revenue by Service Type</ui-heading4>
                <div class="space-y-4">
                  @for (service of financialReport?.revenueByService; track service.serviceName) {
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full mr-3" [style.background-color]="service.color"></div>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ service.serviceName }}</span>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">\${{ formatCurrency(service.revenue) }}</div>
                        <div class="text-xs text-gray-500">{{ service.percentage }}%</div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="card p-6">
                <ui-heading4>Monthly Billing Summary</ui-heading4>
                <div class="overflow-x-auto">
                  <table class="min-w-full">
                    <thead>
                      <tr class="border-b border-gray-200 dark:border-dark-600">
                        <th class="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">Contractor</th>
                        <th class="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">Amount</th>
                        <th class="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-dark-600">
                      @for (billing of financialReport?.billingDetails; track billing.contractorName) {
                        <tr class="py-2">
                          <td class="text-sm text-gray-900 dark:text-white py-2">{{ billing.contractorName }}</td>
                          <td class="text-sm text-gray-900 dark:text-white text-right py-2">\${{ formatCurrency(billing.amount) }}</td>
                          <td class="text-right py-2">
                            <span [class]="getBillingStatusClass(billing.status)"
                                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                              {{ billing.status | titlecase }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Audit Trails Tab -->
        @if (activeTab === 'audit') {
          <div class="p-6">
            <div class="flex flex-col space-y-4 mb-6">
              <div class="flex justify-between items-center">
                <ui-heading3>Audit Trails</ui-heading3>
                <button (click)="exportReport('audit')" class="btn btn-secondary">
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
              
              <!-- Filter Controls -->
              <div class="flex flex-wrap gap-3">
                <div class="w-full sm:w-64">
                  <ui-dropdown
                    label="Filter"
                    [options]="[
                      { value: 'all', label: 'All Activities' },
                      { value: 'user', label: 'User Actions' },
                      { value: 'system', label: 'System Events' },
                      { value: 'security', label: 'Security Events' },
                      { value: 'data', label: 'Data Changes' }
                    ]"
                    [value]="auditFilter"
                    (valueChange)="auditFilter = $event; loadAuditTrails()"
                  />
                </div>
                <div class="flex-1 min-w-[200px]">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
                  <input type="date" [(ngModel)]="auditDateFrom" (change)="loadAuditTrails()" class="input w-full">
                </div>
                <div class="flex-1 min-w-[200px]">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
                  <input type="date" [(ngModel)]="auditDateTo" (change)="loadAuditTrails()" class="input w-full">
                </div>
              </div>
            </div>

            <!-- Audit Summary -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div class="card p-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ auditTrails?.summary?.totalEvents || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
                </div>
              </div>
              <div class="card p-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary-600">{{ auditTrails?.summary?.userActions || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">User Actions</div>
                </div>
              </div>
              <div class="card p-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-warning-600">{{ auditTrails?.summary?.securityEvents || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Security Events</div>
                </div>
              </div>
              <div class="card p-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-success-600">{{ auditTrails?.summary?.systemEvents || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">System Events</div>
                </div>
              </div>
            </div>

            <!-- Audit Trail Table -->
            <div class="card overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                  <thead class="bg-gray-50 dark:bg-dark-800">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                    @for (event of auditTrails?.events; track event.id) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ event.timestamp | date:'MMM d, y h:mm:ss a' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">{{ event.userName }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{{ event.userRole }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span [class]="getActionTypeClass(event.actionType)"
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                            {{ event.actionType | titlecase }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ event.resourceType }}: {{ event.resourceId }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {{ event.details }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {{ event.ipAddress }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span [class]="getEventStatusClass(event.status)"
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                            {{ event.status | titlecase }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="bg-white dark:bg-dark-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-dark-700">
                <div class="flex-1 flex justify-between sm:hidden">
                  <button class="btn btn-secondary">Previous</button>
                  <button class="btn btn-secondary">Next</button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of{{' '}}
                      <span class="font-medium">{{ auditTrails?.totalCount || 0 }}</span> results
                    </p>
                  </div>
                  <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button class="btn btn-secondary rounded-l-md">Previous</button>
                      <button class="btn btn-secondary">1</button>
                      <button class="btn btn-primary">2</button>
                      <button class="btn btn-secondary">3</button>
                      <button class="btn btn-secondary rounded-r-md">Next</button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  activeTab = 'operational';
  
  // Periods
  operationalPeriod = 'week';
  utilizationPeriod = 'month';
  financialPeriod = 'month';
  
  // Audit filters
  auditFilter = 'all';
  auditDateFrom = '';
  auditDateTo = '';

  // Data
  operationalMetrics: OperationalMetrics | null = null;
  utilizationReport: UtilizationReport | null = null;
  financialReport: FinancialReport | null = null;
  auditTrails: AuditTrail | null = null;

  reportTabs = [
    {
      id: 'operational',
      name: 'Operational Metrics',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    },
    {
      id: 'utilization',
      name: 'Utilization Reports',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16'
    },
    {
      id: 'financial',
      name: 'Financial Reports',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      id: 'audit',
      name: 'Audit Trails',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    }
  ];

  private reportsService = inject(ReportsService);

  ngOnInit(): void {
    this.loadOperationalMetrics();
    this.loadUtilizationReports();
    this.loadFinancialReports();
    this.loadAuditTrails();
  }

  loadOperationalMetrics(): void {
    this.reportsService.getOperationalMetrics(this.operationalPeriod).subscribe(metrics => {
      this.operationalMetrics = metrics;
    });
  }

  loadUtilizationReports(): void {
    this.reportsService.getUtilizationReport(this.utilizationPeriod).subscribe(report => {
      this.utilizationReport = report;
    });
  }

  loadFinancialReports(): void {
    this.reportsService.getFinancialReport(this.financialPeriod).subscribe(report => {
      this.financialReport = report;
    });
  }

  loadAuditTrails(): void {
    this.reportsService.getAuditTrails(this.auditFilter, this.auditDateFrom, this.auditDateTo).subscribe(trails => {
      this.auditTrails = trails;
    });
  }

  exportReport(type: string): void {
    this.reportsService.exportReport(type, this.getReportPeriod(type)).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  getReportPeriod(type: string): string {
    switch (type) {
      case 'operational': return this.operationalPeriod;
      case 'utilization': return this.utilizationPeriod;
      case 'financial': return this.financialPeriod;
      default: return 'month';
    }
  }

  getTabClass(tabId: string): string {
    return tabId === this.activeTab
      ? 'border-primary-500 text-primary-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  getUtilizationBarClass(utilization: number): string {
    if (utilization >= 90) return 'bg-error-500';
    if (utilization >= 75) return 'bg-warning-500';
    if (utilization >= 50) return 'bg-primary-500';
    return 'bg-success-500';
  }

  getUtilizationStatusClass(utilization: number): string {
    if (utilization >= 90) return 'bg-error-100 text-error-800';
    if (utilization >= 75) return 'bg-warning-100 text-warning-800';
    if (utilization >= 50) return 'bg-primary-100 text-primary-800';
    return 'bg-success-100 text-success-800';
  }

  getUtilizationStatus(utilization: number): string {
    if (utilization >= 90) return 'Critical';
    if (utilization >= 75) return 'High';
    if (utilization >= 50) return 'Moderate';
    return 'Low';
  }

  getBillingStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'overdue': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getActionTypeClass(actionType: string): string {
    switch (actionType) {
      case 'create': return 'bg-success-100 text-success-800';
      case 'update': return 'bg-primary-100 text-primary-800';
      case 'delete': return 'bg-error-100 text-error-800';
      case 'login': return 'bg-secondary-100 text-secondary-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getEventStatusClass(status: string): string {
    switch (status) {
      case 'success': return 'bg-success-100 text-success-800';
      case 'failed': return 'bg-error-100 text-error-800';
      case 'warning': return 'bg-warning-100 text-warning-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(value: number | undefined): string {
    if (!value) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  }

  // Chart helper methods
  getChartXPosition(index: number): number {
    const chartWidth = 440; // 480 - 40 (left margin)
    const dataPoints = this.operationalMetrics?.dailyThroughputTrend?.length || 1;
    const spacing = chartWidth / (dataPoints - 1);
    return 40 + (index * spacing);
  }

  getChartYPosition(value: number): number {
    const maxValue = Math.max(...(this.operationalMetrics?.dailyThroughputTrend?.map(d => d.value) || [100]));
    const minValue = Math.min(...(this.operationalMetrics?.dailyThroughputTrend?.map(d => d.value) || [0]));
    const range = maxValue - minValue;
    const chartHeight = 140; // 160 - 20 (top margin)
    const normalizedValue = (value - minValue) / range;
    return 160 - (normalizedValue * chartHeight);
  }

  getChartLinePath(): string {
    if (!this.operationalMetrics?.dailyThroughputTrend) return '';
    
    return this.operationalMetrics.dailyThroughputTrend
      .map((item, index) => {
        const x = this.getChartXPosition(index);
        const y = this.getChartYPosition(item.value);
        return `${x},${y}`;
      })
      .join(' ');
  }

  getChartDataPoints(): { x: number; y: number; value: number }[] {
    if (!this.operationalMetrics?.dailyThroughputTrend) return [];
    
    return this.operationalMetrics.dailyThroughputTrend.map((item, index) => ({
      x: this.getChartXPosition(index),
      y: this.getChartYPosition(item.value),
      value: item.value
    }));
  }

  getChartYAxisLabels(): { value: number; y: number }[] {
    if (!this.operationalMetrics?.dailyThroughputTrend) return [];
    
    const maxValue = Math.max(...this.operationalMetrics.dailyThroughputTrend.map(d => d.value));
    const minValue = Math.min(...this.operationalMetrics.dailyThroughputTrend.map(d => d.value));
    const range = maxValue - minValue;
    const step = range / 4;
    
    return [0, 1, 2, 3, 4].map(i => ({
      value: Math.round(maxValue - (i * step)),
      y: 20 + (i * 35)
    }));
  }
}