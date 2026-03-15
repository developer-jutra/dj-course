import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User } from 'lucide-angular';
import { Heading4Component } from '../../../ui-library/Typography/Typography.component';

@Component({
  selector: 'wms-not-found',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Heading4Component],
  template: `
    <div class="flex items-center justify-center h-64">
      <div class="text-center">
        <lucide-icon
          [img]="UserIcon"
          size="48"
          class="mx-auto text-gray-400 mb-4"
        ></lucide-icon>
        <ui-heading4 class="mt-2">Contractor not found</ui-heading4>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The requested contractor could not be found.
        </p>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  UserIcon = User;
}
