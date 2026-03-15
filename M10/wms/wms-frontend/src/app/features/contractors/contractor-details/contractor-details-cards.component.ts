import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ContractorDetails } from '../../../contract/contract';
import { LucideAngularModule, Building, User, Phone, Mail, MapPin, FileText, Calendar } from 'lucide-angular';
import { SectionHeadingComponent } from '../../../ui-library/Typography/Typography.component';

@Component({
  selector: 'wms-contractor-details-cards',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DatePipe, SectionHeadingComponent],
  template: `
    @if (contractor()) {
      <div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Contractor Information -->
          <div class="card p-6">
            <ui-section-heading>
              <lucide-icon [img]="BuildingIcon" size="20"></lucide-icon>
              Contractor Information
            </ui-section-heading>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contractor Name</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ contractor()?.name }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <span [class]="getStatusClass(contractor()?.status || '')" 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1">
                  {{ contractor()?.status | titlecase }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="card p-6">
            <ui-section-heading>
              <lucide-icon [img]="UserIcon" size="20"></lucide-icon>
              Contact Information
            </ui-section-heading>
            <div class="space-y-2">
              @for(contact of contractor()?.contacts; track contact.details) {
                  <div class="flex items-center">
                    <lucide-icon [img]="contact.type === 'EMAIL' ? MailIcon : PhoneIcon" size="16" class="mr-2 text-gray-400"></lucide-icon>
                    @if(contact.type === 'EMAIL') {
                      <p class="text-sm text-gray-900 dark:text-white">
                        <a href="mailto:{{ contact.details }}" 
                        class="text-sm text-primary-600 hover:text-primary-500">{{ contact.details }}</a>
                      </p>
                    } @else {
                      <p class="text-sm text-gray-900 dark:text-white">{{ contact.details }}</p>
                    }
                  </div>
              }
            </div>
          </div>

          <!-- Address Information -->
          <div class="card p-6">
            <ui-section-heading>
              <lucide-icon [img]="MapPinIcon" size="20"></lucide-icon>
              Address Information
            </ui-section-heading>
            @for(address of contractor()?.addresses; track address.address_id) {
            <div class="space-y-2 border-b dark:border-gray-700 py-2 last:border-b-0">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ address.address_type | titlecase }}</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ address.street_address }}</p>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ address.city }}, {{ address.postal_code }}
              </p>
              <p class="text-sm text-gray-900 dark:text-white">{{ address.country }}</p>
            </div>
            }
          </div>

          <!-- Tax Information -->
          <div class="card p-6">
            <ui-section-heading>
              <lucide-icon [img]="FileTextIcon" size="20"></lucide-icon>
              Tax Information
            </ui-section-heading>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Tax ID Number</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ contractor()?.tax_id_number || 'Not provided' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Details -->
        <div class="card p-6 mb-6">
          <ui-section-heading>
            <lucide-icon [img]="CalendarIcon" size="20"></lucide-icon>
            Account Details
          </ui-section-heading>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contractor Since</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">{{ contractor()?.created_at | date:'MMM d, y' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">{{ contractor()?.updated_at | date:'MMM d, y' }}</p>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ContractorDetailsCardsComponent {
  contractor = input<ContractorDetails | null>(null);

  BuildingIcon = Building;
  UserIcon = User;
  PhoneIcon = Phone;
  MailIcon = Mail;
  MapPinIcon = MapPin;
  FileTextIcon = FileText;
  CalendarIcon = Calendar;

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success-100 text-success-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
} 