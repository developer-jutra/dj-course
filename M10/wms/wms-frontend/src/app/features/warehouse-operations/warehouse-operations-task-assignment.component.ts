import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Users, User, Clock, CheckCircle, AlertCircle, Plus, Eye, Edit } from 'lucide-angular';
import { Task } from './warehouse-operations.model';
import { WarehouseOperationsService } from './warehouse-operations.service';
import { DropdownComponent } from '../../ui-library/Dropdown.component';
import { Heading3Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-warehouse-operations-task-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DropdownComponent, Heading3Component],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <ui-heading3>Task Assignment</ui-heading3>
        <button class="btn btn-primary">
          <lucide-icon [img]="PlusIcon" size="18" class="mr-2"></lucide-icon>
          Create Task
        </button>
      </div>

      <!-- Task Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-primary-100 rounded-lg">
              <lucide-icon [img]="ClockIcon" size="24" class="text-primary-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pendingTasks() }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-warning-100 rounded-lg">
              <lucide-icon [img]="AlertCircleIcon" size="24" class="text-warning-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ inProgressTasks() }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-success-100 rounded-lg">
              <lucide-icon [img]="CheckCircleIcon" size="24" class="text-success-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Today</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ completedToday() }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-secondary-100 rounded-lg">
              <lucide-icon [img]="UsersIcon" size="24" class="text-secondary-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Workers</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeWorkers() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Filters -->
      <div class="card p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <ui-dropdown
              label="All Status"
              [options]="[
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' }
              ]"
              [value]="statusFilter()"
              (valueChange)="statusFilter.set($event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <ui-dropdown
              label="All Priorities"
              [options]="[
                { value: '', label: 'All Priorities' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
              ]"
              [value]="priorityFilter()"
              (valueChange)="priorityFilter.set($event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <ui-dropdown
              label="All Categories"
              [options]="[
                { value: '', label: 'All Categories' },
                { value: 'receiving', label: 'Receiving' },
                { value: 'shipping', label: 'Shipping' },
                { value: 'inventory', label: 'Inventory' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'quality', label: 'Quality' }
              ]"
              [value]="categoryFilter()"
              (valueChange)="categoryFilter.set($event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
            <ui-dropdown
              label="All Workers"
              [options]="[
                { value: '', label: 'All Workers' },
                { value: 'Mike Worker', label: 'Mike Worker' },
                { value: 'Sarah Coordinator', label: 'Sarah Coordinator' },
                { value: 'John Operator', label: 'John Operator' }
              ]"
              [value]="assigneeFilter()"
              (valueChange)="assigneeFilter.set($event)"
            />
          </div>
        </div>
      </div>

      <!-- Tasks Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead class="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned To
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              @for (task of filteredTasks(); track task.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ task.title }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ task.description }}</div>
                    <div class="mt-1">
                      <span [class]="getCategoryClass(task.category)" 
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                        {{ task.category | titlecase }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <lucide-icon [img]="UserIcon" size="16" class="text-primary-600"></lucide-icon>
                        </div>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ task.assignedTo }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ task.estimatedHours }}h estimated</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="getPriorityClass(task.priority)" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                      {{ task.priority | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ task.dueDate | date:'MMM d, y h:mm a' }}
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="getStatusClass(task.status)" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                      {{ task.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ task.location }}
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
    </div>
  `
})
export class WarehouseOperationsTaskAssignmentComponent implements OnInit {
  private warehouseOperationsService = inject(WarehouseOperationsService);

  statusFilter = signal('');
  priorityFilter = signal('');
  categoryFilter = signal('');
  assigneeFilter = signal('');
  
  tasks = signal<Task[]>([]);

  filteredTasks = computed(() => {
    const tasks = this.tasks();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const category = this.categoryFilter();
    const assignee = this.assigneeFilter();

    return tasks.filter(task => {
      if (status && task.status !== status) return false;
      if (priority && task.priority !== priority) return false;
      if (category && task.category !== category) return false;
      if (assignee && task.assignedTo !== assignee) return false;
      return true;
    });
  });

  pendingTasks = computed(() => this.tasks().filter(t => t.status === 'pending').length);
  inProgressTasks = computed(() => this.tasks().filter(t => t.status === 'in_progress').length);
  completedToday = computed(() => this.tasks().filter(t => t.status === 'completed').length);
  activeWorkers = computed(() => {
    const activeWorkers = new Set(this.tasks().filter(t => t.status === 'in_progress').map(t => t.assignedToId));
    return activeWorkers.size;
  });

  // Lucide icons
  UsersIcon = Users;
  UserIcon = User;
  ClockIcon = Clock;
  CheckCircleIcon = CheckCircle;
  AlertCircleIcon = AlertCircle;
  PlusIcon = Plus;
  EyeIcon = Eye;
  EditIcon = Edit;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.warehouseOperationsService.getTasks().subscribe(data => {
      this.tasks.set(data);
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-error-100 text-error-800';
      case 'high': return 'bg-warning-100 text-warning-800';
      case 'medium': return 'bg-primary-100 text-primary-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-800';
      case 'in_progress': return 'bg-primary-100 text-primary-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'cancelled': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'receiving': return 'bg-blue-100 text-blue-800';
      case 'shipping': return 'bg-green-100 text-green-800';
      case 'inventory': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'quality': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}