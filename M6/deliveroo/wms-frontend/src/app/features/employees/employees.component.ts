import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.interfaces';
import { LucideAngularModule, Users, Search, Plus, Eye, UserCheck, Mail, Phone, Calendar } from 'lucide-angular';
import { DropdownComponent } from '../../ui-library/Dropdown.component';
import { Heading1Component, SubtitleComponent, Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule, DropdownComponent, Heading1Component, SubtitleComponent, Heading4Component],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center pb-4">
        <div>
          <ui-heading1>Employees</ui-heading1>
          <ui-subtitle>Manage employee information and access</ui-subtitle>
        </div>
        <button class="btn btn-primary">
          <lucide-icon [img]="PlusIcon" size="18" class="mr-2"></lucide-icon>
          Add Employee
        </button>
      </div>

      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-primary-100 rounded-lg">
              <lucide-icon [img]="UsersIcon" size="24" class="text-primary-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ employees.length }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-success-100 rounded-lg">
              <lucide-icon [img]="UserCheckIcon" size="24" class="text-success-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Employees</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getActiveEmployees() }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-warning-100 rounded-lg">
              <lucide-icon [img]="CalendarIcon" size="24" class="text-warning-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getNewEmployeesThisMonth() }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-secondary-100 rounded-lg">
              <lucide-icon [img]="UsersIcon" size="24" class="text-secondary-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Roles Assigned</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getTotalRolesAssigned() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="card p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Employees</label>
            <div class="relative">
              <lucide-icon [img]="SearchIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
              <input type="text" 
                     [(ngModel)]="searchTerm"
                     (input)="applyFilters()"
                     placeholder="Search by name, email, or role..."
                     class="input pl-10 h-10">
            </div>
          </div>
          <div>
            <ui-dropdown label="Status" [options]="statusOptions" [value]="statusFilter" (valueChange)="setStatusFilter($event)" />
          </div>
        </div>
      </div>

      <!-- Employees Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead class="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Warehouse
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hire Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
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
              @for (employee of filteredEmployees; track employee.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-primary-600">{{ employee.fullName.charAt(0) }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ employee.fullName }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center text-sm text-gray-900 dark:text-white mb-1">
                      <lucide-icon [img]="MailIcon" size="16" class="mr-2 text-gray-400"></lucide-icon>
                      {{ employee.email }}
                    </div>
                    @if (employee.phone) {
                      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <lucide-icon [img]="PhoneIcon" size="16" class="mr-2 text-gray-400"></lucide-icon>
                        {{ employee.phone }}
                      </div>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @for (role of employee.roles; track role.roleName) {
                      <div class="mb-1">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {{ role.roleName }}
                        </span>
                      </div>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @for (assignment of employee.warehouseAssignments; track assignment.warehouseName) {
                      <div class="text-sm">
                        <div class="text-gray-900 dark:text-white">{{ assignment.warehouseName }}</div>
                        <div class="text-gray-500 dark:text-gray-400">Since {{ assignment.assignedFrom | date:'MMM y' }}</div>
                      </div>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ employee.hireDate | date:'MMM d, y' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ employee.lastLogin | date:'MMM d, y h:mm a' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(employee.isActive)"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                      {{ employee.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex flex-col items-start space-y-2">
                      <button [routerLink]="['/employees', employee.id]"
                              class="text-primary-600 hover:text-primary-500 inline-flex items-center">
                        <lucide-icon [img]="EyeIcon" size="16" class="mr-1"></lucide-icon>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (filteredEmployees.length === 0) {
          <div class="text-center py-12">
            <lucide-icon [img]="UsersIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
            <ui-heading4 class="mt-2">No employees found</ui-heading4>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search criteria.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  statusFilter = '';

  // Lucide icons
  UsersIcon = Users;
  SearchIcon = Search;
  PlusIcon = Plus;
  EyeIcon = Eye;
  UserCheckIcon = UserCheck;
  MailIcon = Mail;
  PhoneIcon = Phone;
  CalendarIcon = Calendar;

  private employeesService = inject(EmployeesService);

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeesService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.filteredEmployees = employees;
    });
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      // Search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        if (!employee.fullName.toLowerCase().includes(searchLower) &&
            !employee.email.toLowerCase().includes(searchLower) &&
            !employee.roles.some(role => role.roleName.toLowerCase().includes(searchLower))) {
          return false;
        }
      }

      // Status filter
      if (this.statusFilter) {
        const isActive = this.statusFilter === 'active';
        if (employee.isActive !== isActive) {
          return false;
        }
      }

      return true;
    });
  }

  getActiveEmployees(): number {
    return this.employees.filter(e => e.isActive).length;
  }

  getNewEmployeesThisMonth(): number {
    const now = new Date();
    return this.employees.filter(e => {
      const hireDate = new Date(e.hireDate);
      return hireDate.getMonth() === now.getMonth() && 
             hireDate.getFullYear() === now.getFullYear();
    }).length;
  }

  getTotalRolesAssigned(): number {
    return this.employees.reduce((total, e) => total + e.roles.length, 0);
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800';
  }

  setStatusFilter(val: string) { this.statusFilter = val; this.applyFilters(); }
}