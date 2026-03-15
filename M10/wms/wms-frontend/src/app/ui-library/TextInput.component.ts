import { Component, input, forwardRef, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-text-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
  template: `
    <label *ngIf="label()" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label() }}</label>
    <input 
      [type]="type()" 
      [value]="value()" 
      (input)="onInput($event)"
      (blur)="onTouched()"
      [placeholder]="placeholder()" 
      class="input w-full h-10" />
    @if (error()) {
      <div class="mt-1 text-sm text-error-600">{{ error() }}</div>
    }
  `
})
export class TextInputComponent implements ControlValueAccessor {
  value = model<string>('');

  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  error = input<string>('');

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  
  writeValue(value: any): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }
}
