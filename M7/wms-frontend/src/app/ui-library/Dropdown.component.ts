import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      @if (label()) {
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label() }}</label>
      }
      <select 
        [value]="value()" 
        (change)="onSelectionChange($event)"
        class="w-full px-3 py-2 h-10 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500">
        @for (option of options(); track option.value) {
          <option [value]="option.value" class="py-2">
            {{ option.label }}
          </option>
        }
      </select>
    </div>
  `
})
export class DropdownComponent {
  options = input<{ value: string; label: string }[]>([]);
  value = input<string>('');
  label = input<string>('');
  valueChange = output<string>();

  onSelectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }
}
