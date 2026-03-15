import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.interfaces';
import { LucideAngularModule, ArrowLeft, User, Mail, Phone, Calendar, MapPin, Shield, Building, Clock, Edit } from 'lucide-angular';
import { Heading1Component, Heading3Component, Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Heading1Component, Heading3Component, Heading4Component],
  template: `
    @if (employee) {
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button routerLink="/employees" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <lucide-icon [img]="ArrowLeftIcon" size="20"></lucide-icon>
            </button>
            <div>
              <ui-heading1>{{ employee.fullName }}</ui-heading1>
              <p class="text-gray-600 dark:text-gray-400">Employee Details</p>
            </div>
            <span [class]="getStatusClass(employee.isActive)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              {{ employee.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="flex space-x-3">
            <button class="btn btn-secondary">
              <lucide-icon [img]="EditIcon" size="18" class="mr-2"></lucide-icon>
              Edit Employee
            </button>
          </div>
        </div>

        <!-- Employee Information Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Basic Information -->
          <div class="card p-6">
            <ui-heading3 class="mb-4">
              <lucide-icon [img]="UserIcon" size="20"></lucide-icon>
              Personal Information
            </ui-heading3>
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-16 w-16">
                  <div class="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-xl font-medium text-primary-600">{{ employee.fullName.charAt(0) }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <ui-heading4>{{ employee.fullName }}</ui-heading4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Employee ID: #{{ employee.id }}</p>
                </div>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <div class="flex items-center mt-1">
                  <lucide-icon [img]="MailIcon" size="16" class="mr-2 text-gray-400"></lucide-icon>
                  <a href="mailto:{{ employee.email }}"
                     class="text-sm text-primary-600 hover:text-primary-500">{{ employee.email }}</a>
                </div>
              </div>

              @if (employee.phone) {
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <div class="flex items-center mt-1">
                    <lucide-icon [img]="PhoneIcon" size="16" class="mr-2 text-gray-400"></lucide-icon>
                    <p class="text-sm text-gray-900 dark:text-white">{{ employee.phone }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Employment Information -->
          <div class="card p-6">
            <ui-heading3 class="mb-4">
              <lucide-icon [img]="CalendarIcon" size="20"></lucide-icon>
              Employment Information
            </ui-heading3>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Hire Date</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ employee.hireDate | date:'MMM d, y' }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Employment Status</label>
                <span [class]="getStatusClass(employee.isActive)"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1">
                  {{ employee.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>

              @if (employee.lastLogin) {
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                  <div class="flex items-center mt-1">
                    <lucide-icon [img]="ClockIcon" size="16" class="mr-2 text-gray-400"></lucide-icon>
                    <p class="text-sm text-gray-900 dark:text-white">{{ employee.lastLogin | date:'MMM d, y h:mm a' }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Roles and Permissions -->
        <div class="card p-6">
          <ui-heading3 class="mb-4">
            <lucide-icon [img]="ShieldIcon" size="20"></lucide-icon>
            Roles and Permissions
          </ui-heading3>
          <div class="space-y-4">
            @for (role of employee.roles; track role.roleName) {
              <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <ui-heading4>{{ role.roleName }}</ui-heading4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Assigned on {{ role.assignedDate | date:'MMM d, y' }}
                      @if (role.assignedByName) {
                        <span> by {{ role.assignedByName }}</span>
                      }
                    </p>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Active
                  </span>
                </div>
              </div>
            } @empty {
              <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <lucide-icon [img]="ShieldIcon" size="48" class="mx-auto mb-4 text-gray-400"></lucide-icon>
                <p class="text-sm">No roles assigned to this employee</p>
              </div>
            }
          </div>
        </div>

        <!-- Warehouse Assignments -->
        <div class="card p-6">
          <ui-heading3 class="mb-4">
            <lucide-icon [img]="BuildingIcon" size="20"></lucide-icon>
            Warehouse Assignments
          </ui-heading3>
          <div class="space-y-4">
            @for (assignment of employee.warehouseAssignments; track assignment.warehouseName) {
              <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <ui-heading4>{{ assignment.warehouseName }}</ui-heading4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Assigned from {{ assignment.assignedFrom | date:'MMM d, y' }}
                      @if (assignment.assignedUntil) {
                        <span> until {{ assignment.assignedUntil | date:'MMM d, y' }}</span>
                      }
                    </p>
                  </div>
                  <span [class]="assignment.isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ assignment.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            } @empty {
              <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <lucide-icon [img]="BuildingIcon" size="48" class="mx-auto mb-4 text-gray-400"></lucide-icon>
                <p class="text-sm">No warehouse assignments for this employee</p>
              </div>
            }
          </div>
        </div>

        <!-- Account Details -->
        <div class="card p-6">
          <ui-heading3 class="mb-4">
            <lucide-icon [img]="ClockIcon" size="20"></lucide-icon>
            Account Details
          </ui-heading3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Account Created</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">{{ employee.createdAt | date:'MMM d, y h:mm a' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">{{ employee.updatedAt | date:'MMM d, y h:mm a' }}</p>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <lucide-icon [img]="UserIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
          <ui-heading4 class="mt-2">Employee not found</ui-heading4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The requested employee could not be found.</p>
        </div>
      </div>
    }
  `
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  employeeId: number = 0;

  // Lucide icons
  ArrowLeftIcon = ArrowLeft;
  UserIcon = User;
  MailIcon = Mail;
  PhoneIcon = Phone;
  CalendarIcon = Calendar;
  MapPinIcon = MapPin;
  ShieldIcon = Shield;
  BuildingIcon = Building;
  ClockIcon = Clock;
  EditIcon = Edit;

  private route = inject(ActivatedRoute);
  private employeesService = inject(EmployeesService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = parseInt(params['id']);
      this.loadEmployeeDetails();
    });
  }

  loadEmployeeDetails(): void {
    this.employeesService.getEmployee(this.employeeId).subscribe(employee => {
      this.employee = employee || null;
    });
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800';
  }
}