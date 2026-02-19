import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MapPin, Thermometer, Shield, Package, Settings, Plus, Edit, Eye } from 'lucide-angular';
import { Heading4Component, SectionHeadingComponent } from '../../ui-library/Typography/Typography.component';

interface Zone {
  id: number;
  name: string;
  type: 'standard' | 'refrigerated' | 'frozen' | 'hazardous' | 'secure';
  capacity: number;
  used: number;
  temperature?: { min: number; max: number; unit: string };
  status: 'active' | 'maintenance' | 'inactive';
  aisles: number;
  racks: number;
  shelves: number;
}

@Component({
  selector: 'app-warehouse-operations-zone-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, Heading4Component, SectionHeadingComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center pb-4">
        <ui-section-heading>Zone Management</ui-section-heading>
        <button class="btn btn-primary">
          <lucide-icon [img]="PlusIcon" size="18" class="mr-2"></lucide-icon>
          Add Zone
        </button>
      </div>

      <!-- Zone Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-primary-100 rounded-lg">
              <lucide-icon [img]="MapPinIcon" size="24" class="text-primary-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Zones</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ zones.length }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-success-100 rounded-lg">
              <lucide-icon [img]="PackageIcon" size="24" class="text-success-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Zones</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getActiveZones() }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-warning-100 rounded-lg">
              <lucide-icon [img]="SettingsIcon" size="24" class="text-warning-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Under Maintenance</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getMaintenanceZones() }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-secondary-100 rounded-lg">
              <lucide-icon [img]="ThermometerIcon" size="24" class="text-secondary-600"></lucide-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Climate Controlled</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getClimateControlledZones() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (zone of zones; track zone.id) {
          <div class="card p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div [class]="getZoneIconClass(zone.type)" class="p-2 rounded-lg mr-3">
                  <lucide-icon [img]="getZoneIcon(zone.type)" size="20"></lucide-icon>
                </div>
                <div>
                  <ui-heading4>{{ zone.name }}</ui-heading4>
                  <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ zone.type }}</p>
                </div>
              </div>
              <span [class]="getStatusClass(zone.status)" 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                {{ zone.status | titlecase }}
              </span>
            </div>

            <!-- Zone Details -->
            <div class="space-y-3">
              <!-- Capacity -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600 dark:text-gray-400">Capacity</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getUtilization(zone) }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                  <div [class]="getCapacityBarClass(getUtilization(zone))" 
                      class="h-2 rounded-full transition-all"
                      [style.width.%]="getUtilization(zone)"></div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ zone.used }} / {{ zone.capacity }} m³
                </div>
              </div>

              <!-- Temperature (if applicable) -->
              @if (zone.temperature) {
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ zone.temperature.min }}° - {{ zone.temperature.max }}°{{ zone.temperature.unit }}
                  </span>
                </div>
              }

              <!-- Storage Structure -->
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-gray-50 dark:bg-dark-700 rounded p-2">
                  <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ zone.aisles }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Aisles</div>
                </div>
                <div class="bg-gray-50 dark:bg-dark-700 rounded p-2">
                  <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ zone.racks }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Racks</div>
                </div>
                <div class="bg-gray-50 dark:bg-dark-700 rounded p-2">
                  <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ zone.shelves }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Shelves</div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600 flex space-x-2">
              <button class="btn btn-secondary flex-1">
                <lucide-icon [img]="EyeIcon" size="16" class="mr-2"></lucide-icon>
                View
              </button>
              <button class="btn btn-primary flex-1">
                <lucide-icon [img]="EditIcon" size="16" class="mr-2"></lucide-icon>
                Configure
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class WarehouseOperationsZoneManagementComponent implements OnInit {
  zones: Zone[] = [
    {
      id: 1,
      name: 'Zone A - Standard',
      type: 'standard',
      capacity: 10000,
      used: 7500,
      status: 'active',
      aisles: 8,
      racks: 32,
      shelves: 128
    },
    {
      id: 2,
      name: 'Zone B - Refrigerated',
      type: 'refrigerated',
      capacity: 5000,
      used: 3200,
      temperature: { min: 2, max: 8, unit: 'C' },
      status: 'active',
      aisles: 4,
      racks: 16,
      shelves: 64
    },
    {
      id: 3,
      name: 'Zone C - Frozen',
      type: 'frozen',
      capacity: 3000,
      used: 1500,
      temperature: { min: -20, max: -18, unit: 'C' },
      status: 'active',
      aisles: 3,
      racks: 12,
      shelves: 48
    },
    {
      id: 4,
      name: 'Zone D - Hazardous',
      type: 'hazardous',
      capacity: 2000,
      used: 800,
      status: 'maintenance',
      aisles: 2,
      racks: 8,
      shelves: 32
    }
  ];

  // Lucide icons
  MapPinIcon = MapPin;
  ThermometerIcon = Thermometer;
  ShieldIcon = Shield;
  PackageIcon = Package;
  SettingsIcon = Settings;
  PlusIcon = Plus;
  EditIcon = Edit;
  EyeIcon = Eye;

  ngOnInit(): void {}

  getActiveZones(): number {
    return this.zones.filter(z => z.status === 'active').length;
  }

  getMaintenanceZones(): number {
    return this.zones.filter(z => z.status === 'maintenance').length;
  }

  getClimateControlledZones(): number {
    return this.zones.filter(z => z.temperature).length;
  }

  getUtilization(zone: Zone): number {
    return Math.round((zone.used / zone.capacity) * 100);
  }

  getZoneIcon(type: string) {
    switch (type) {
      case 'refrigerated':
      case 'frozen':
        return this.ThermometerIcon;
      case 'hazardous':
      case 'secure':
        return this.ShieldIcon;
      default:
        return this.PackageIcon;
    }
  }

  getZoneIconClass(type: string): string {
    switch (type) {
      case 'refrigerated': return 'bg-blue-100 text-blue-600';
      case 'frozen': return 'bg-cyan-100 text-cyan-600';
      case 'hazardous': return 'bg-red-100 text-red-600';
      case 'secure': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'maintenance': return 'bg-warning-100 text-warning-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCapacityBarClass(utilization: number): string {
    if (utilization >= 90) return 'bg-error-500';
    if (utilization >= 75) return 'bg-warning-500';
    if (utilization >= 50) return 'bg-primary-500';
    return 'bg-success-500';
  }
}