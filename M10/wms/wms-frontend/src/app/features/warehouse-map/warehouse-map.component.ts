import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseMapService } from './warehouse-map.service';
import { Warehouse, Zone } from '../warehouse/warehouse.model';
import { renderWarehouse } from './warehouse-visualization';
import { warehouseStructureGenerator } from './warehouse-structure-generator';
import { WarehouseStructure } from './warehouse.types';
import { DropdownComponent } from '../../ui-library/Dropdown.component';
import { Heading1Component, Heading3Component, Heading4Component, SubtitleComponent } from '../../ui-library/Typography/Typography.component';
import { SectionComponent } from '../../ui-library/Section.component';

@Component({
  selector: 'app-warehouse-map',
  standalone: true,
  imports: [CommonModule, DropdownComponent, Heading1Component, Heading4Component, Heading3Component, SubtitleComponent, SectionComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center pb-4">
        <div>
          <ui-heading1>Warehouse Map</ui-heading1>
          <ui-subtitle>Visual layout and capacity overview</ui-subtitle>
        </div>
      </div>

      <!-- Warehouse Selection & Legend -->
      <ui-section>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ui-dropdown label="Warehouse" [options]="warehouseOptions()" [value]="selectedWarehouseId()" (valueChange)="selectWarehouseId($event)" />
          <ui-dropdown label="Visualization" [options]="strategyOptions" [value]="selectedStrategy()" (valueChange)="selectStrategyValue($event)" />
        </div>
        
        <div class="border-t border-gray-200 dark:border-dark-700 pt-4">
          <ui-heading4 class="text-gray-700 dark:text-gray-300 mb-3 block">Zone Types</ui-heading4>
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-gray-200 border border-gray-300 rounded mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Standard</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-blue-200 border border-blue-300 rounded mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Refrigerated</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-cyan-200 border border-cyan-300 rounded mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Frozen</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-red-200 border border-red-300 rounded mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Hazardous</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Secure</span>
            </div>
          </div>
        </div>
      </ui-section>

      <!-- Warehouse Visualization -->
      <ui-section>
        <div class="mb-4">
          <ui-heading3 class="mb-2">Warehouse Layout</ui-heading3>
          <p class="text-gray-600 dark:text-gray-400">Interactive grid visualization with real-time capacity monitoring</p>
        </div>
        
        <div 
          #visualizationContainer
          class="w-full overflow-x-auto border-2 border-gray-200 rounded-lg bg-white"
          style="min-height: 500px;">
        </div>
      </ui-section>

      <!-- Main Warehouse Content -->
      @if (selectedWarehouse) {
        <ui-section>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Warehouse Info -->
            <div class="lg:col-span-1">
              <ui-heading3 class="mb-4">{{ selectedWarehouse.name }}</ui-heading3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedWarehouse.location.address }}<br>
                    {{ selectedWarehouse.location.city }}, {{ selectedWarehouse.location.postalCode }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Capacity</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ formatNumber(selectedWarehouse.capacity.value) }} {{ selectedWarehouse.capacity.unit }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Utilization</p>
                  <div class="flex items-center space-x-2">
                    <div class="flex-1 bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <div class="bg-primary-600 h-2 rounded-full" 
                           [style.width.%]="selectedWarehouse.capacity.utilizationPercentage"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ selectedWarehouse.capacity.utilizationPercentage }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Warehouse Layout -->
            <div class="lg:col-span-2">
              <ui-heading4 class="mb-4">Layout</ui-heading4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (zone of selectedWarehouse.zones; track zone.id) {
                  <div class="relative p-4 border-2 rounded-lg transition-all hover:shadow-md cursor-pointer"
                       [class]="getZoneClass(zone)"
                       (click)="selectZone(zone)">
                    <div class="flex items-start justify-between">
                      <div>
                        <h5 class="font-medium text-gray-900 dark:text-white">{{ zone.name }}</h5>
                        <p class="text-sm text-gray-600 dark:text-gray-400 capitalize">{{ zone.zoneType }}</p>
                        @if (zone.temperature) {
                          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {{ zone.temperature.min }}° - {{ zone.temperature.max }}°{{ zone.temperature.unit }}
                          </div>
                        }
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ zone.capacity.utilizationPercentage }}%
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatNumber(zone.capacity.usedCapacity) }} / {{ formatNumber(zone.capacity.value) }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Capacity indicator -->
                    <div class="mt-3">
                      <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                        <div [class]="getCapacityBarClass(zone.capacity.utilizationPercentage || 0)" 
                             class="h-2 rounded-full transition-all"
                             [style.width.%]="zone.capacity.utilizationPercentage"></div>
                      </div>
                    </div>

                    <!-- Zone type indicator -->
                    <div class="absolute top-2 right-2">
                      <span [class]="getZoneTypeClass(zone.zoneType)" 
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                        <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          @switch (zone.zoneType) {
                            @case ('standard') { <circle cx="10" cy="10" r="8" /> }
                            @case ('refrigerated') { <path d="M10 2L3 7v11l7 5 7-5V7l-7-5z" /> }
                            @case ('frozen') { <path d="M10 1L2 6v12l8 5 8-5V6l-8-5z" /> }
                            @case ('hazardous') { <path d="M10 3L3 8v9l7 4 7-4V8l-7-5z" /> }
                          }
                        </svg>
                        {{ zone.zoneType }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </ui-section>
      }

      <!-- Zone Details -->
      @if (selectedZone) {
        <ui-section>
          <div class="flex items-center justify-between mb-4">
            <ui-heading3>{{ selectedZone.name }} Details</ui-heading3>
            <button (click)="selectedZone = null" 
                    class="text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zone Information</p>
              <div class="space-y-2">
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white capitalize">{{ selectedZone.zoneType }}</span>
                </div>
                @if (selectedZone.temperature) {
                  <div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Temperature Range:</span>
                    <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      {{ selectedZone.temperature.min }}° - {{ selectedZone.temperature.max }}°{{ selectedZone.temperature.unit }}
                    </span>
                  </div>
                }
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Aisles:</span>
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ selectedZone.aisles.length }}</span>
                </div>
              </div>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity</p>
              <div class="space-y-2">
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatNumber(selectedZone.capacity.value) }} {{ selectedZone.capacity.unit }}
                  </span>
                </div>
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Used:</span>
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatNumber(selectedZone.capacity.usedCapacity) }} {{ selectedZone.capacity.unit }}
                  </span>
                </div>
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Available:</span>
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatNumber(selectedZone.capacity.availableCapacity) }} {{ selectedZone.capacity.unit }}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Utilization</p>
              <div class="flex items-center space-x-3">
                <div class="flex-1">
                  <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3">
                    <div [class]="getCapacityBarClass(selectedZone.capacity.utilizationPercentage || 0)" 
                         class="h-3 rounded-full transition-all"
                         [style.width.%]="selectedZone.capacity.utilizationPercentage"></div>
                  </div>
                </div>
                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedZone.capacity.utilizationPercentage }}%
                </span>
              </div>
            </div>
          </div>
        </ui-section>
      }
    </div>
  `
})
export class WarehouseMapComponent implements OnInit, AfterViewInit {
  @ViewChild('visualizationContainer', { static: false }) visualizationContainer!: ElementRef<HTMLDivElement>;
  
  warehouses: Warehouse[] = [];
  selectedWarehouse: Warehouse | null = null;
  selectedZone: Zone | null = null;
  
  // Signals for warehouse visualization
  selectedStrategy = signal<string>('strategy2');
  warehouseStructure!: WarehouseStructure;
  
  // Strategy options
  strategyOptions = [
    { value: 'strategy1', label: 'Fades and Shades' },
    { value: 'strategy2', label: 'Bars' },
    { value: 'strategy3', label: 'Grids' },
    { value: 'none', label: 'No Strategy' },
  ];

  selectedWarehouseId = signal('');
  warehouseOptions = () => [
    ...this.warehouses.map(w => ({ value: w.id.toString(), label: w.name }))
  ];

  private warehouseMapService = inject(WarehouseMapService);

  ngOnInit(): void {
    this.loadWarehouses();
    // Generate warehouse structure
    this.warehouseStructure = warehouseStructureGenerator.getWarehouseStructure();
  }

  ngAfterViewInit(): void {
    // Initialize the warehouse visualization after the view is ready
    this.renderWarehouseVisualization();
  }

  private renderWarehouseVisualization(): void {
    if (this.visualizationContainer?.nativeElement && this.warehouseStructure) {
      console.log('Rendering warehouse visualization with strategy:', this.selectedStrategy());
      renderWarehouse(
        this.visualizationContainer.nativeElement,
        this.warehouseStructure,
        this.selectedStrategy()
      );
    }
  }

  selectStrategyValue(val: string) {
    this.selectedStrategy.set(val);
    this.renderWarehouseVisualization();
  }

  loadWarehouses(): void {
    this.warehouseMapService.getWarehouses().subscribe(warehouses => {
      this.warehouses = warehouses;
      if (warehouses.length > 0) {
        this.selectedWarehouse = warehouses[0];
      }
    });
  }

  selectWarehouseId(val: string) {
    this.selectedWarehouseId.set(val);
    this.selectedWarehouse = this.warehouses.find(w => w.id.toString() === val) || null;
    this.selectedZone = null;
  }

  selectZone(zone: Zone): void {
    this.selectedZone = zone;
  }

  getZoneClass(zone: Zone): string {
    const baseClass = 'border-2 rounded-lg p-4 transition-all hover:shadow-md cursor-pointer';
    switch (zone.zoneType) {
      case 'refrigerated': return `${baseClass} border-blue-300 bg-blue-50 dark:bg-blue-900/20`;
      case 'frozen': return `${baseClass} border-cyan-300 bg-cyan-50 dark:bg-cyan-900/20`;
      case 'hazardous': return `${baseClass} border-red-300 bg-red-50 dark:bg-red-900/20`;
      case 'secure': return `${baseClass} border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20`;
      default: return `${baseClass} border-gray-300 bg-gray-50 dark:bg-gray-900/20`;
    }
  }

  getZoneTypeClass(zoneType: string): string {
    switch (zoneType) {
      case 'refrigerated': return 'bg-blue-100 text-blue-800';
      case 'frozen': return 'bg-cyan-100 text-cyan-800';
      case 'hazardous': return 'bg-red-100 text-red-800';
      case 'secure': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCapacityBarClass(utilization: number): string {
    if (utilization >= 90) return 'bg-error-500';
    if (utilization >= 75) return 'bg-warning-500';
    if (utilization >= 50) return 'bg-primary-500';
    return 'bg-success-500';
  }

  formatNumber(value: number | undefined): string {
    if (!value) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  }
}