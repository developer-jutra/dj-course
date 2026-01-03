import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ui-stats-tile',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="card p-6 cursor-pointer hover:shadow-md transition-shadow">
      <div class="flex items-center">
        <div class="p-2 rounded-lg" [class]="iconColor() + ' rounded-lg'">
          <lucide-icon [img]="icon()" size="24"></lucide-icon>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ label() }}</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ value() }}</p>
        </div>
      </div>
    </div>
  `
})
export class StatsTileComponent {
  label = input<string>('');
  value = input<string>('');
  icon = input<any>(null);
  iconColor = input<string>('');
}
