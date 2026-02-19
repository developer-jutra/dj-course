import { Component, input } from '@angular/core';
import { ContractorDetails } from '../../../contract/contract';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Edit, CreditCard } from 'lucide-angular';

@Component({
  selector: 'wms-contractor-details-actions',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    @if (contractor()) {
      <div class="flex space-x-3">
        <button class="btn btn-secondary">
          <lucide-icon [img]="EditIcon" size="18" class="mr-2"></lucide-icon>
          Edit Contractor
        </button>
      </div>
    }
  `
})
export class ContractorDetailsActionsComponent {
  contractor = input<ContractorDetails | null>(null);

  EditIcon = Edit;
  CreditCardIcon = CreditCard;
} 