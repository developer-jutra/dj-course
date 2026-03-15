import {
  Component,
  output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SectionComponent } from '../../../ui-library/Section.component';
import { TextInputComponent } from '../../../ui-library/TextInput.component';
import { startWith } from 'rxjs';

export interface AddContractorFormValue {
  name: string;
  tax_id_number: string | null;
  email: string;
  phone: string;
}

@Component({
  selector: 'wms-add-contractor-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SectionComponent,
    TextInputComponent,
  ],
  template: `
    <form #form="ngForm" class="p-6">
      <div class="space-y-6">
        <ui-section>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ui-text-input
              label="Contractor Name *"
              name="name"
              [(ngModel)]="formData.name"
              required
              placeholder="Enter contractor name"
            />
            <ui-text-input
              label="Tax ID number"
              name="tax_id_number"
              [(ngModel)]="formData.tax_id_number"
              placeholder="Enter tax id"
            />
          </div>
        </ui-section>

        <ui-section>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ui-text-input
              label="Email Address *"
              name="email"
              type="email"
              [(ngModel)]="formData.email"
              required
              email
              placeholder="contact@company.com"
            />
            <ui-text-input
              label="Phone Number *"
              name="phone"
              [(ngModel)]="formData.phone"
              required
              placeholder="+1-555-0123"
            />
          </div>
        </ui-section>
      </div>
    </form>
  `,
})
export class AddContractorFormComponent implements AfterViewInit {
  @ViewChild('form') form!: NgForm;
  
  validityChange = output<boolean>();

  formData: AddContractorFormValue = {
    name: '',
    tax_id_number: null,
    email: '',
    phone: '',
  };

  ngAfterViewInit(): void {
    this.form.statusChanges?.pipe(startWith(this.form.status)).subscribe(() => {
      this.validityChange.emit(this.form.valid ?? false);
    });
  }
}
