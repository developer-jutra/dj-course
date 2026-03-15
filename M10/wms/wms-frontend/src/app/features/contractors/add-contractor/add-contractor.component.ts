import { Component, inject, effect, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import {
  Heading3Component,
} from '../../../ui-library/Typography/Typography.component';
import { ContractorsListingStore } from '../contractor-listing/contractors-listing.store';
import { ModalComponent } from '../../../ui-library/Modal.component';
import { listenTo } from '../../../broker/listenTo';
import { AddContractorFormComponent } from './add-contractor-form.component';

@Component({
  selector: 'wms-add-contractor',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    Heading3Component,
    ModalComponent,
    AddContractorFormComponent,
  ],
  template: `
    <ui-modal [(isOpen)]="isOpen">
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700"
      >
        <ui-heading3>Add New Contractor</ui-heading3>
        <button
          (click)="closeModal()"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <lucide-icon [img]="XIcon" size="24"></lucide-icon>
        </button>
      </div>

      <wms-add-contractor-form
        #addContractorForm
        (validityChange)="isFormValid.set($event)"
      />

      <div
        class="flex items-center justify-end p-6 border-t border-gray-200 dark:border-dark-700"
      >
        <button
          type="button"
          (click)="closeModal()"
          class="btn btn-secondary mr-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          (click)="onSubmit()"
          [disabled]="!isFormValid() || store.isAdding()"
          class="btn btn-primary"
        >
          @if (store.isAdding()) {
          <span>Saving...</span>
          } @else {
          <span>Save Contractor</span>
          }
        </button>
      </div>
    </ui-modal>
  `,
})
export class AddContractorComponent {
  readonly store = inject(ContractorsListingStore);

  private wasAdding = false;
  isOpen = signal(false);
  isFormValid = signal(false);

  XIcon = X;

  @ViewChild('addContractorForm')
  addContractorForm!: AddContractorFormComponent;

  constructor() {
    effect(() => {
      const isAdding = this.store.isAdding();
      if (this.wasAdding && !isAdding && !this.store.error()) {
        this.closeModal();
      }
      this.wasAdding = isAdding;
    });

    listenTo('modal:open:add-contractor', () => {
      this.isOpen.set(true);
    });
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }
    this.store.addContractor(this.addContractorForm.formData);
  }
}
