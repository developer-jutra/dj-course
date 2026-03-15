import {
  Component,
  HostListener,
  inject,
  ElementRef,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 bg-black/80 dark:bg-white/80 flex items-center justify-center z-50"
        (click)="close()"
      >
        <div
          class="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  private el = inject(ElementRef);
  isOpen = model<boolean>(false);

  open(): void {
    this.isOpen.set(true);
    document.body.appendChild(this.el.nativeElement);
  }

  close(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(): void {
    this.close();
  }
}
