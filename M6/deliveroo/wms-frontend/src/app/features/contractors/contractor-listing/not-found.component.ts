import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users } from 'lucide-angular';
import { Heading4Component, TextComponent } from '../../../ui-library/Typography/Typography.component';

@Component({
  selector: 'wms-not-found',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Heading4Component, TextComponent],
  template: `
    <div class="text-center py-12">
      <lucide-icon
        [img]="icon"
        size="48"
        class="mx-auto text-gray-400 mb-4"
      ></lucide-icon>
      <ui-heading4>{{ title() }}</ui-heading4>
      <ui-text>{{ message() }}</ui-text>
    </div>
  `,
})
export class NotFoundComponent {
  title = input.required<string>();
  message = input.required<string>();

  icon = Users;
}
