import { Component, inject } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { MessageBroker } from '../../../broker/MessageBroker';

@Component({
  selector: 'wms-contractors-listing-actions',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <button
      (click)="broker.publish('modal:open:add-contractor', {})"
      class="btn btn-primary"
    >
      <lucide-icon [img]="PlusIcon" size="18" class="mr-2"></lucide-icon>
      Add Contractor
    </button>
  `,
})
export class ContractorsListingActionsComponent {
  readonly broker = inject(MessageBroker);
  PlusIcon = Plus;
}
