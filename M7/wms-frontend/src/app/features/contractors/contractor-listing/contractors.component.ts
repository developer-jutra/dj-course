import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractorsStatsComponent } from './contractors-stats.component';
import { ContractorsListingFiltersComponent } from './contractors-listing-filters.component';
import { ContractorsListingComponent } from './contractors-listing.component';
import { SectionComponent } from '../../../ui-library/Section.component';
import {
  Heading1Component,
  SubtitleComponent,
} from '../../../ui-library/Typography/Typography.component';
import { AddContractorComponent } from '../add-contractor/add-contractor.component';
import { ContractorsListingStore } from './contractors-listing.store';
import { ContractorsListingActionsComponent } from './contractors-listing-actions.component';

@Component({
  selector: 'wms-contractors',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ContractorsStatsComponent,
    ContractorsListingFiltersComponent,
    ContractorsListingComponent,
    SectionComponent,
    Heading1Component,
    SubtitleComponent,
    AddContractorComponent,
    ContractorsListingActionsComponent,
  ],
  // NO NEED TO inject this, we only provide it here
  providers: [ContractorsListingStore],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center pb-4">
        <div>
          <ui-heading1>Contractors</ui-heading1>
          <ui-subtitle>Manage your contractors and their details</ui-subtitle>
        </div>
        <wms-contractors-listing-actions />
      </div>

      <!-- Stats Section -->
      <ui-section>
        <wms-contractors-stats />
      </ui-section>

      <!-- Filters Section -->
      <ui-section>
        <wms-contractors-listing-filters />
      </ui-section>

      <!-- Listing Section -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <wms-contractors-listing />
        </div>
      </div>
    </div>
    <wms-add-contractor />
  `,
})
export class ContractorsComponent {} 