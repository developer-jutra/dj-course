import { Component, input, output, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../notifications/notification.service';
import { LucideAngularModule, X, Calendar, MapPin, User, Package, DollarSign, Save } from 'lucide-angular';
import { DropdownComponent } from '../../ui-library/Dropdown.component';
import { Heading3Component, Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-reservations-form-new-reservation',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LucideAngularModule, DropdownComponent, Heading4Component, Heading3Component],
  template: `
    <!-- New Reservation Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
            <ui-heading3>
              <lucide-icon [img]="CalendarIcon" size="20"></lucide-icon>
              New Reservation
            </ui-heading3>
            <button (click)="onCancel()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <lucide-icon [img]="XIcon" size="24"></lucide-icon>
            </button>
          </div>

          <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()" class="p-6">
            <div class="space-y-8">
              <!-- Contractor Information -->
              <div>
                <ui-heading4 class="mb-4">
                  <lucide-icon [img]="UserIcon" size="18" class="mr-2"></lucide-icon>
                  Contractor Information
                </ui-heading4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="contractorName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contractor Name *
                    </label>
                    <input type="text"
                           id="contractorName"
                           formControlName="contractorName"
                           class="input"
                           placeholder="Enter contractor name">
                    @if (reservationForm.get('contractorName')?.invalid && reservationForm.get('contractorName')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Contractor name is required
                      </div>
                    }
                  </div>
                  <div>
                    <label for="contractorId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contractor ID *
                    </label>
                    <input type="number"
                           id="contractorId"
                           formControlName="contractorId"
                           class="input"
                           placeholder="Enter contractor ID"
                           min="1">
                    @if (reservationForm.get('contractorId')?.invalid && reservationForm.get('contractorId')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Valid contractor ID is required
                      </div>
                    }
                  </div>
                  <div>
                    <label for="storageRequestId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Storage Request ID
                    </label>
                    <input type="number"
                           id="storageRequestId"
                           formControlName="storageRequestId"
                           class="input"
                           placeholder="Related storage request ID"
                           min="1">
                  </div>
                </div>
              </div>

              <!-- Location Information -->
              <div>
                <ui-heading4 class="mb-4">
                  <lucide-icon [img]="MapPinIcon" size="18" class="mr-2"></lucide-icon>
                  Storage Location
                </ui-heading4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label for="zone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Zone *
                    </label>
                    <ui-dropdown
                      label="Select zone"
                      [options]="[
                        { value: 'Zone A', label: 'Zone A - Standard' },
                        { value: 'Zone B', label: 'Zone B - Refrigerated' },
                        { value: 'Zone C', label: 'Zone C - Frozen' },
                        { value: 'Zone D', label: 'Zone D - Hazardous' },
                        { value: 'Zone E', label: 'Zone E - Secure' }
                      ]"
                      [value]="reservationForm.get('zone')?.value"
                      (valueChange)="reservationForm.get('zone')?.setValue($event); reservationForm.get('zone')?.markAsTouched()"
                    />
                    @if (reservationForm.get('zone')?.invalid && reservationForm.get('zone')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Zone selection is required
                      </div>
                    }
                  </div>
                  <div>
                    <label for="aisle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Aisle *
                    </label>
                    <ui-dropdown
                      label="Select aisle"
                      [options]="[
                        { value: 'Aisle 1', label: 'Aisle 1' },
                        { value: 'Aisle 2', label: 'Aisle 2' },
                        { value: 'Aisle 3', label: 'Aisle 3' },
                        { value: 'Aisle 4', label: 'Aisle 4' },
                        { value: 'Aisle 5', label: 'Aisle 5' }
                      ]"
                      [value]="reservationForm.get('aisle')?.value"
                      (valueChange)="reservationForm.get('aisle')?.setValue($event); reservationForm.get('aisle')?.markAsTouched()"
                    />
                    @if (reservationForm.get('aisle')?.invalid && reservationForm.get('aisle')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Aisle selection is required
                      </div>
                    }
                  </div>
                  <div>
                    <label for="rack" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rack *
                    </label>
                    <ui-dropdown
                      label="Select rack"
                      [options]="[
                        { value: 'Rack 1', label: 'Rack 1' },
                        { value: 'Rack 2', label: 'Rack 2' },
                        { value: 'Rack 3', label: 'Rack 3' },
                        { value: 'Rack 4', label: 'Rack 4' }
                      ]"
                      [value]="reservationForm.get('rack')?.value"
                      (valueChange)="reservationForm.get('rack')?.setValue($event); reservationForm.get('rack')?.markAsTouched()"
                    />
                    @if (reservationForm.get('rack')?.invalid && reservationForm.get('rack')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Rack selection is required
                      </div>
                    }
                  </div>
                  <div>
                    <label for="shelf" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Shelf *
                    </label>
                    <ui-dropdown
                      label="Select shelf"
                      [options]="[
                        { value: 'Shelf 1', label: 'Shelf 1' },
                        { value: 'Shelf 2', label: 'Shelf 2' },
                        { value: 'Shelf 3', label: 'Shelf 3' },
                        { value: 'Shelf 4', label: 'Shelf 4' }
                      ]"
                      [value]="reservationForm.get('shelf')?.value"
                      (valueChange)="reservationForm.get('shelf')?.setValue($event); reservationForm.get('shelf')?.markAsTouched()"
                    />
                    @if (reservationForm.get('shelf')?.invalid && reservationForm.get('shelf')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Shelf selection is required
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Reservation Period -->
              <div>
                <ui-heading4 class="mb-4">
                  <lucide-icon [img]="CalendarIcon" size="18" class="mr-2"></lucide-icon>
                  Reservation Period
                </ui-heading4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="reservedFrom" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reserved From *
                    </label>
                    <input type="date"
                           id="reservedFrom"
                           formControlName="reservedFrom"
                           class="input"
                           [min]="getMinDate()">
                    @if (reservationForm.get('reservedFrom')?.invalid && reservationForm.get('reservedFrom')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Start date is required
                      </div>
                    }
                  </div>
                  <div>
                    <label for="reservedUntil" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reserved Until *
                    </label>
                    <input type="date"
                           id="reservedUntil"
                           formControlName="reservedUntil"
                           class="input"
                           [min]="getMinEndDate()">
                    @if (reservationForm.get('reservedUntil')?.invalid && reservationForm.get('reservedUntil')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        End date is required and must be after start date
                      </div>
                    }
                  </div>
                </div>
                <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Duration: {{ getReservationDuration() }} days
                </div>
              </div>

              <!-- Space Requirements -->
              <div>
                <ui-heading4 class="mb-4">
                  <lucide-icon [img]="PackageIcon" size="18" class="mr-2"></lucide-icon>
                  Space Requirements
                </ui-heading4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="reservedWeight" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reserved Weight (kg) *
                    </label>
                    <input type="number"
                           id="reservedWeight"
                           formControlName="reservedWeight"
                           class="input"
                           placeholder="1000"
                           min="1"
                           step="0.1">
                    @if (reservationForm.get('reservedWeight')?.invalid && reservationForm.get('reservedWeight')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Valid weight is required
                      </div>
                    }
                  </div>
                  <div>
                    <label for="reservedVolume" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reserved Volume (m³) *
                    </label>
                    <input type="number"
                           id="reservedVolume"
                           formControlName="reservedVolume"
                           class="input"
                           placeholder="50"
                           min="1"
                           step="0.1">
                    @if (reservationForm.get('reservedVolume')?.invalid && reservationForm.get('reservedVolume')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Valid volume is required
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Payment Information -->
              <div>
                <ui-heading4 class="mb-4">
                  <lucide-icon [img]="DollarSignIcon" size="18" class="mr-2"></lucide-icon>
                  Payment Information
                </ui-heading4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label for="paymentAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Amount *
                    </label>
                    <input type="number"
                           id="paymentAmount"
                           formControlName="paymentAmount"
                           class="input"
                           placeholder="2500"
                           min="0"
                           step="0.01">
                    @if (reservationForm.get('paymentAmount')?.invalid && reservationForm.get('paymentAmount')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Valid payment amount is required
                      </div>
                    }
                  </div>
                  <div>
                    <ui-dropdown
                      label="Select currency"
                      [options]="[
                        { value: 'USD', label: 'USD' },
                        { value: 'EUR', label: 'EUR' },
                        { value: 'GBP', label: 'GBP' },
                        { value: 'CAD', label: 'CAD' }
                      ]"
                      [value]="reservationForm.get('currency')?.value"
                      (valueChange)="reservationForm.get('currency')?.setValue($event); reservationForm.get('currency')?.markAsTouched()"
                    />
                  </div>
                  <div>
                    <label for="paymentDueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Due Date *
                    </label>
                    <input type="date"
                           id="paymentDueDate"
                           formControlName="paymentDueDate"
                           class="input"
                           [min]="getMinDate()">
                    @if (reservationForm.get('paymentDueDate')?.invalid && reservationForm.get('paymentDueDate')?.touched) {
                      <div class="mt-1 text-sm text-error-600">
                        Payment due date is required
                      </div>
                    }
                  </div>
                </div>
                <div class="mt-4">
                  <label for="paymentStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Status
                  </label>
                  <ui-dropdown
                    label="Select status"
                    [options]="[
                      { value: 'pending', label: 'Pending' },
                      { value: 'paid', label: 'Paid' },
                      { value: 'overdue', label: 'Overdue' }
                    ]"
                    [value]="reservationForm.get('paymentStatus')?.value"
                    (valueChange)="reservationForm.get('paymentStatus')?.setValue($event); reservationForm.get('paymentStatus')?.markAsTouched()"
                  />
                </div>
              </div>

              <!-- Reservation Status -->
              <div>
                <ui-heading4 class="mb-4">Reservation Status</ui-heading4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <ui-dropdown
                      label="Select status"
                      [options]="[
                        { value: 'pending', label: 'Pending' },
                        { value: 'active', label: 'Active' },
                        { value: 'expired', label: 'Expired' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ]"
                      [value]="reservationForm.get('status')?.value"
                      (valueChange)="reservationForm.get('status')?.setValue($event); reservationForm.get('status')?.markAsTouched()"
                    />
                  </div>
                  <div>
                    <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority Level
                    </label>
                    <ui-dropdown
                      label="Select priority"
                      [options]="[
                        { value: 'normal', label: 'Normal' },
                        { value: 'high', label: 'High' },
                        { value: 'urgent', label: 'Urgent' }
                      ]"
                      [value]="reservationForm.get('priority')?.value"
                      (valueChange)="reservationForm.get('priority')?.setValue($event); reservationForm.get('priority')?.markAsTouched()"
                    />
                  </div>
                </div>
              </div>

              <!-- Special Requirements -->
              <div>
                <ui-heading4 class="mb-4">Special Requirements</ui-heading4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input type="checkbox"
                             formControlName="requiresClimateControl"
                             class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Climate Control</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox"
                             formControlName="requiresSecurityAccess"
                             class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Security Access</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox"
                             formControlName="requiresSpecialHandling"
                             class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Special Handling</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox"
                             formControlName="allowsSharedSpace"
                             class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Allows Shared Space</span>
                    </label>
                  </div>
                  <div class="space-y-4">
                    @if (reservationForm.get('requiresClimateControl')?.value) {
                      <div>
                        <label for="temperatureRange" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Temperature Range
                        </label>
                        <ui-dropdown
                          label="Select temperature range"
                          [options]="[
                            { value: '2-8', label: '2°C to 8°C (Refrigerated)' },
                            { value: '-18', label: '-18°C or below (Frozen)' },
                            { value: '15-25', label: '15°C to 25°C (Room Temperature)' },
                            { value: 'custom', label: 'Custom Range' }
                          ]"
                          [value]="reservationForm.get('temperatureRange')?.value"
                          (valueChange)="reservationForm.get('temperatureRange')?.setValue($event); reservationForm.get('temperatureRange')?.markAsTouched()"
                        />
                      </div>
                    }
                    @if (reservationForm.get('requiresSecurityAccess')?.value) {
                      <div>
                        <label for="securityLevel" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Security Level
                        </label>
                        <ui-dropdown
                          label="Select security level"
                          [options]="[
                            { value: 'standard', label: 'Standard Security' },
                            { value: 'high', label: 'High Security' },
                            { value: 'maximum', label: 'Maximum Security' }
                          ]"
                          [value]="reservationForm.get('securityLevel')?.value"
                          (valueChange)="reservationForm.get('securityLevel')?.setValue($event); reservationForm.get('securityLevel')?.markAsTouched()"
                        />
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Additional Notes -->
              <div>
                <ui-heading4 class="mb-4">Additional Notes</ui-heading4>
                <textarea id="notes"
                          formControlName="notes"
                          rows="3"
                          class="input"
                          placeholder="Any additional requirements, instructions, or special considerations..."></textarea>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
              <button (click)="onCancel()"
                      type="button"
                      class="btn btn-secondary">
                Cancel
              </button>
              <button [disabled]="reservationForm.invalid || submitting"
                      type="submit"
                      class="btn btn-primary">
                <lucide-icon [img]="SaveIcon" size="18" class="mr-2"></lucide-icon>
                {{ submitting ? 'Creating...' : 'Create Reservation' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class ReservationsFormNewReservationComponent {
  // Signal-based input
  showModal = input<boolean>(false);

  // Outputs
  modalClosed = output<void>();
  reservationCreated = output<any>();

  reservationForm: FormGroup;
  submitting = false;

  // Lucide icons
  XIcon = X;
  CalendarIcon = Calendar;
  MapPinIcon = MapPin;
  UserIcon = User;
  PackageIcon = Package;
  DollarSignIcon = DollarSign;
  SaveIcon = Save;

  private formBuilder = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  constructor() {
    this.reservationForm = this.formBuilder.group({
      contractorName: ['', Validators.required],
      contractorId: ['', [Validators.required, Validators.min(1)]],
      storageRequestId: [''],
      zone: ['', Validators.required],
      aisle: ['', Validators.required],
      rack: ['', Validators.required],
      shelf: ['', Validators.required],
      reservedFrom: ['', Validators.required],
      reservedUntil: ['', Validators.required],
      reservedWeight: ['', [Validators.required, Validators.min(1)]],
      reservedVolume: ['', [Validators.required, Validators.min(1)]],
      paymentAmount: ['', [Validators.required, Validators.min(0)]],
      currency: ['USD'],
      paymentDueDate: ['', Validators.required],
      paymentStatus: ['pending'],
      status: ['pending'],
      priority: ['normal'],
      requiresClimateControl: [false],
      requiresSecurityAccess: [false],
      requiresSpecialHandling: [false],
      allowsSharedSpace: [true],
      temperatureRange: [''],
      securityLevel: [''],
      notes: ['']
    });

    // Add custom validator for end date
    this.reservationForm.get('reservedUntil')?.addValidators(this.endDateValidator.bind(this));
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getMinEndDate(): string {
    const startDate = this.reservationForm.get('reservedFrom')?.value;
    if (startDate) {
      const nextDay = new Date(startDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split('T')[0];
    }
    return this.getMinDate();
  }

  getReservationDuration(): number {
    const startDate = this.reservationForm.get('reservedFrom')?.value;
    const endDate = this.reservationForm.get('reservedUntil')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  endDateValidator(control: any) {
    const startDate = this.reservationForm?.get('reservedFrom')?.value;
    const endDate = control.value;
    
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { endDateInvalid: true };
    }
    return null;
  }

  onCancel(): void {
    this.reservationForm.reset({
      currency: 'USD',
      paymentStatus: 'pending',
      status: 'pending',
      priority: 'normal',
      requiresClimateControl: false,
      requiresSecurityAccess: false,
      requiresSpecialHandling: false,
      allowsSharedSpace: true
    });
    this.modalClosed.emit();
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formData = this.reservationForm.value;

    // Simulate API call
    setTimeout(() => {
      try {
        const reservationData = {
          id: Math.floor(Math.random() * 1000) + 1,
          contractorId: formData.contractorId,
          contractorName: formData.contractorName,
          storageRequestId: formData.storageRequestId || Math.floor(Math.random() * 100) + 1,
          location: {
            zone: formData.zone,
            aisle: formData.aisle,
            rack: formData.rack,
            shelf: formData.shelf,
            fullLocation: `${formData.zone} - ${formData.aisle} - ${formData.rack} - ${formData.shelf}`
          },
          reservedFrom: new Date(formData.reservedFrom),
          reservedUntil: new Date(formData.reservedUntil),
          reservedWeight: formData.reservedWeight,
          reservedVolume: formData.reservedVolume,
          status: formData.status,
          payment: {
            amount: formData.paymentAmount,
            currency: formData.currency,
            status: formData.paymentStatus,
            dueDate: new Date(formData.paymentDueDate),
            paidDate: formData.paymentStatus === 'paid' ? new Date() : undefined
          },
          specialRequirements: {
            requiresClimateControl: formData.requiresClimateControl,
            requiresSecurityAccess: formData.requiresSecurityAccess,
            requiresSpecialHandling: formData.requiresSpecialHandling,
            allowsSharedSpace: formData.allowsSharedSpace,
            temperatureRange: formData.temperatureRange,
            securityLevel: formData.securityLevel
          },
          priority: formData.priority,
          notes: formData.notes,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.reservationCreated.emit(reservationData);
        
        this.notificationService.showSuccess(
          'Reservation Created',
          `Reservation for ${formData.contractorName} has been successfully created at ${reservationData.location.fullLocation}.`
        );

        this.reservationForm.reset({
          currency: 'USD',
          paymentStatus: 'pending',
          status: 'pending',
          priority: 'normal',
          requiresClimateControl: false,
          requiresSecurityAccess: false,
          requiresSpecialHandling: false,
          allowsSharedSpace: true
        });
        this.submitting = false;
        this.modalClosed.emit();
      } catch (error) {
        this.notificationService.showError(
          'Creation Failed',
          'There was an error creating the reservation. Please try again.'
        );
        this.submitting = false;
      }
    }, 1500);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.reservationForm.controls).forEach(key => {
      const control = this.reservationForm.get(key);
      control?.markAsTouched();
    });
  }
}