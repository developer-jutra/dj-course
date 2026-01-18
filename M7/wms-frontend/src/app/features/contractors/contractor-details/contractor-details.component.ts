import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContractorsService } from '../contractors.service';
import { ContractorDetails } from '../../../contract/contract';
import { ContractorDetailsActionsComponent } from './contractor-details-actions.component';
import { ContractorDetailsCardsComponent } from './contractor-details-cards.component';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { Heading1Component } from '../../../ui-library/Typography/Typography.component';
import { NotFoundComponent } from '../contractor-listing/not-found.component';
import { LoaderComponent } from '../../../ui-library/Loader.component';

@Component({
  selector: 'wms-contractor-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    LucideAngularModule,
    ContractorDetailsActionsComponent,
    ContractorDetailsCardsComponent,
    Heading1Component,
    NotFoundComponent,
    LoaderComponent
  ],
  template: `
    @if (isLoading) {
      <wms-loader />
    } @else if (contractor) {
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4">
          <div class="flex items-center space-x-4">
            <button routerLink="/contractors" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <lucide-icon [img]="ArrowLeftIcon" size="20"></lucide-icon>
            </button>
            <div>
              <ui-heading1>{{ contractor.name }}</ui-heading1>
              <p class="text-gray-600 dark:text-gray-400">Contractor Details</p>
            </div>
          </div>
          
          <!-- Actions Component -->
          <wms-contractor-details-actions [contractor]="contractor" />
        </div>

        <!-- Details Cards Component -->
        <wms-contractor-details-cards [contractor]="contractor" />
      </div>
    } @else {
      <wms-not-found title="Contractor Not Found" message="The contractor you are looking for does not exist." />
    }
  `
})
export class ContractorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contractorsService = inject(ContractorsService);

  contractor: ContractorDetails | null = null;
  contractorId: number = 0;
  isLoading = true;

  ArrowLeftIcon = ArrowLeft;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contractorId = parseInt(params['id']);
      this.loadContractorDetails();
    });
  }

  loadContractorDetails(): void {
    this.isLoading = true;
    this.contractorsService.getContractorDetails(this.contractorId).subscribe({
      next: (contractor) => {
      this.contractor = contractor || null;
        this.isLoading = false;
      },
      error: () => {
        this.contractor = null;
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success-100 text-success-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
} 