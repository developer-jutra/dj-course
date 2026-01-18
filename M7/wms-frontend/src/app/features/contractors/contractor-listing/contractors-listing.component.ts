import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../contract/contract';
import { LucideAngularModule, Eye, Phone, Mail, Building, Users, UserMinus, UserCheck } from 'lucide-angular';
import { ContractorsListingStore } from './contractors-listing.store';
import { LoaderComponent } from '../../../ui-library/Loader.component';
import { NotFoundComponent } from './not-found.component';

@Component({
  selector: 'wms-contractors-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, LoaderComponent, NotFoundComponent],
  template: `
    @if(store.isLoading()) {
      <wms-loader />
    } @else {
      <div class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead class="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contractor Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contacts
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tax ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                @for (contractor of store.filteredContractors(); track contractor.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-dark-700" [class.opacity-60]="contractor.status === 'INACTIVE'">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <lucide-icon [img]="BuildingIcon" size="20" class="text-primary-600"></lucide-icon>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ contractor.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                      @if (getEmailContact(contractor.contacts); as email) {
                    <div class="flex items-center text-sm text-gray-900 dark:text-white mb-1">
                      <lucide-icon [img]="MailIcon" size="16" class="mr-2 text-gray-400"></lucide-icon>
                          {{ email.details }}
                    </div>
                      }
                      @if (getPhoneContact(contractor.contacts); as phone) {
                    <div class="flex items-center text-sm text-gray-900 dark:text-white">
                      <lucide-icon [img]="PhoneIcon" size="16" class="mr-2 text-gray-400"></lucide-icon>
                          {{ phone.details }}
                    </div>
                      }
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-white">{{ contractor.tax_id_number || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="getStatusClass(contractor.status)" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                      {{ contractor.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex flex-col items-start space-y-2">
                      <button [routerLink]="['/contractors', contractor.id]"
                              class="text-primary-600 hover:text-primary-500 inline-flex items-center">
                        <lucide-icon [img]="EyeIcon" size="16" class="mr-1"></lucide-icon>
                        View
                      </button>
                      @if (contractor.status === 'ACTIVE') {
                          <button (click)="store.toggleContractorStatus(contractor)"
                                class="text-warning-600 hover:text-warning-500 inline-flex items-center">
                          <lucide-icon [img]="UserMinusIcon" size="16" class="mr-1"></lucide-icon>
                          Deactivate
                        </button>
                        } @else {
                          <button (click)="store.toggleContractorStatus(contractor)"
                                  class="text-success-600 hover:text-success-500 inline-flex items-center">
                            <lucide-icon [img]="UserCheckIcon" size="16" class="mr-1"></lucide-icon>
                            Activate
                          </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (store.filteredContractors().length === 0) {
          <wms-not-found 
            title="No contractors found"
            message="Try adjusting your search criteria."
          />
        }
      </div>
    }
  `,
})
export class ContractorsListingComponent {
  readonly store = inject(ContractorsListingStore);

  EyeIcon = Eye;
  PhoneIcon = Phone;
  MailIcon = Mail;
  BuildingIcon = Building;
  UsersIcon = Users;
  UserMinusIcon = UserMinus;
  UserCheckIcon = UserCheck;

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success-100 text-success-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getEmailContact(contacts: Contact[]): Contact | undefined {
    return contacts.find(c => c.type === 'EMAIL');
  }

  getPhoneContact(contacts: Contact[]): Contact | undefined {
    return contacts.find(c => c.type === 'PHONE');
  }
} 