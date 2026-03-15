import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type LoaderSize = 'small' | 'medium' | 'big';

const SPINNER_CLASSES: Record<LoaderSize, string> = {
  small: 'h-6 w-6',
  medium: 'h-12 w-12',
  big: 'h-16 w-16',
};

const CONTAINER_CLASSES: Record<LoaderSize, string> = {
  small: 'h-16',
  medium: 'h-32',
  big: 'h-64',
};

@Component({
  selector: 'wms-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center" [ngClass]="containerClass()">
      <div
        class="animate-spin rounded-full border-t-2 border-b-2 border-primary-600"
        [ngClass]="spinnerClass()"
      ></div>
    </div>
  `,
})
export class LoaderComponent {
  size = input<LoaderSize>('big');

  spinnerClass = computed(() => SPINNER_CLASSES[this.size()]);

  containerClass = computed(() => CONTAINER_CLASSES[this.size()]);
}
