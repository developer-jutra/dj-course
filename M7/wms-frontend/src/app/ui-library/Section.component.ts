import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-section',
  standalone: true,
  template: `
    <section class="rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 shadow-sm p-6 mb-6 overflow-hidden">
      @if (description()) {
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ description() }}</p>
      }
      <ng-content></ng-content>
    </section>
  `
})
export class SectionComponent {
  description = input<string>('');
}
