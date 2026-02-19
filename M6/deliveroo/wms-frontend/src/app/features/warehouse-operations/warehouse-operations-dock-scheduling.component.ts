import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calendar, Truck, Clock, Plus, Eye, Edit } from 'lucide-angular';
import { DockAppointment } from './warehouse-operations.model';
import { WarehouseOperationsService } from './warehouse-operations.service';
import { Heading3Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-warehouse-operations-dock-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, Heading3Component],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <ui-heading3>Dock Scheduling</ui-heading3>
        <button class="btn btn-primary">
          <lucide-icon [img]="PlusIcon" size="18" class="mr-2"></lucide-icon>
          Schedule Appointment
        </button>
      </div>

      <!-- Calendar View Toggle -->
      <div class="mb-6">
        <div class="flex space-x-4">
          <button [class]="viewMode() === 'calendar' ? 'btn btn-primary' : 'btn btn-secondary'"
                  (click)="viewMode.set('calendar')">
            <lucide-icon [img]="CalendarIcon" size="18" class="mr-2"></lucide-icon>
            Calendar View
          </button>
          <button [class]="viewMode() === 'list' ? 'btn btn-primary' : 'btn btn-secondary'"
                  (click)="viewMode.set('list')">
            <lucide-icon [img]="TruckIcon" size="18" class="mr-2"></lucide-icon>
            List View
          </button>
        </div>
      </div>

      <!-- Calendar View -->
      @if (viewMode() === 'calendar') {
        <div class="card p-6">
          <div class="grid grid-cols-7 gap-4 mb-4">
            @for (day of weekDays; track day) {
              <div class="text-center font-medium text-gray-700 dark:text-gray-300 py-2">
                {{ day }}
              </div>
            }
          </div>
          
          <div class="grid grid-cols-7 gap-4">
            @for (day of calendarDays(); track day.fullDate) {
              <div class="min-h-32 p-2 border border-gray-200 dark:border-dark-600 rounded-lg"
                  [class.bg-gray-50]="!day.isCurrentMonth"
                  [class.bg-blue-50]="day.isToday">
                <div class="text-sm font-medium text-gray-900 dark:text-white mb-2">{{ day.date }}</div>
                <div class="space-y-1">
                  @for (appointment of getAppointmentsForDay(day.fullDate); track appointment.id) {
                    <div class="text-xs p-1 rounded truncate"
                        [class]="getAppointmentClass(appointment.appointmentType)">
                      {{ appointment.carrierName }} - {{ appointment.dockName }}
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- List View -->
      @if (viewMode() === 'list') {
        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead class="bg-gray-50 dark:bg-dark-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Appointment
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dock
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Carrier & Truck
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                @for (appointment of appointments(); track appointment.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">#{{ appointment.id }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ appointment.cargoDescription }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">{{ appointment.dockName }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">{{ appointment.carrierName }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ appointment.truckLicense }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">
                        {{ appointment.scheduledStart | date:'MMM d, h:mm a' }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        to {{ appointment.scheduledEnd | date:'h:mm a' }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="getTypeClass(appointment.appointmentType)" 
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                        {{ appointment.appointmentType | titlecase }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="getStatusClass(appointment.status)" 
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                        {{ appointment.status | titlecase }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium space-x-2">
                      <button class="text-primary-600 hover:text-primary-500 inline-flex items-center">
                        <lucide-icon [img]="EyeIcon" size="16" class="mr-1"></lucide-icon>
                        View
                      </button>
                      <button class="text-secondary-600 hover:text-secondary-500 inline-flex items-center">
                        <lucide-icon [img]="EditIcon" size="16" class="mr-1"></lucide-icon>
                        Edit
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class WarehouseOperationsDockSchedulingComponent implements OnInit {
  private warehouseOperationsService = inject(WarehouseOperationsService);

  viewMode = signal<'calendar' | 'list'>('calendar');
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays = signal<any[]>([]);

  appointments = signal<DockAppointment[]>([]);

  // Lucide icons
  CalendarIcon = Calendar;
  TruckIcon = Truck;
  ClockIcon = Clock;
  PlusIcon = Plus;
  EyeIcon = Eye;
  EditIcon = Edit;

  ngOnInit(): void {
    this.generateCalendarDays();
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.warehouseOperationsService.getDockAppointments().subscribe(data => {
      this.appointments.set(data);
    });
  }

  generateCalendarDays(): void {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarDays: any[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      calendarDays.push({
        date: date.getDate(),
        fullDate: new Date(date),
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    this.calendarDays.set(calendarDays);
  }

  getAppointmentsForDay(date: Date): DockAppointment[] {
    return this.appointments().filter(appointment => {
      const appointmentDate = new Date(appointment.scheduledStart);
      return appointmentDate.toDateString() === date.toDateString();
    });
  }

  getAppointmentClass(type: string): string {
    return type === 'receiving' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  }

  getTypeClass(type: string): string {
    return type === 'receiving' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'bg-primary-100 text-primary-800';
      case 'in_progress': return 'bg-warning-100 text-warning-800';
      case 'completed': return 'bg-success-100 text-success-800';
      case 'cancelled': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}