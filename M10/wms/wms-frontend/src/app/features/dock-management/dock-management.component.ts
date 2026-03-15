import { Component, OnInit, inject } from '@angular/core';

import { LucideAngularModule, Plus } from 'lucide-angular';

import { Dock } from './dock.model';
import { DockStatsComponent } from './dock-stats.component';
import { DockListingComponent } from './dock-listing.component';
import { DockFormScheduleAppointmentComponent } from './dock-form-schedule-appointment.component';
import { DockService } from './dock.service';
import { Heading1Component, SubtitleComponent } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-dock-management',
  standalone: true,
  imports: [
    LucideAngularModule,
    DockStatsComponent,
    DockListingComponent,
    DockFormScheduleAppointmentComponent,
    Heading1Component,
    SubtitleComponent
],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center pb-4">
        <div>
          <ui-heading1>Dock Management</ui-heading1>
          <ui-subtitle>Schedule and manage dock operations</ui-subtitle>
        </div>
        <button (click)="showScheduleModal = true" class="btn btn-primary">
          <lucide-icon [img]="PlusIcon" size="18" class="mr-2"></lucide-icon>
          Schedule Appointment
        </button>
      </div>

      <!-- Stats Component -->
      <app-dock-stats [docks]="docks" />

      <!-- Listing Component -->
      <app-dock-listing [docks]="docks" class="inline-block mt-2" />

      <!-- Schedule Appointment Modal -->
      <app-dock-form-schedule-appointment
        [showModal]="showScheduleModal"
        [availableDocks]="getAvailableDocks()"
        (modalClosed)="showScheduleModal = false"
        (appointmentScheduled)="onAppointmentScheduled($event)" />
    </div>
  `
})
export class DockManagementComponent implements OnInit {
  docks: Dock[] = [];
  showScheduleModal = false;

  // Lucide icons
  PlusIcon = Plus;

  private dockService = inject(DockService);

  ngOnInit(): void {
    this.loadDockData();
  }

  loadDockData(): void {
    this.dockService.getDocks().subscribe(docks => {
      this.docks = docks;
    });
  }

  getAvailableDocks(): Dock[] {
    return this.docks.filter(dock => dock.status === 'available' || dock.status === 'reserved');
  }

  onAppointmentScheduled(appointmentData: any): void {
    console.log('New appointment scheduled:', appointmentData);
    // In a real app, you would update the dock status and refresh the data
    this.loadDockData();
  }
}