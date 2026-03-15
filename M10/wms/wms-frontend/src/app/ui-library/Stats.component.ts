import { Component, input } from '@angular/core';
import { StatsTileComponent } from './StatsTile.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ui-stats',
  standalone: true,
  imports: [StatsTileComponent, LucideAngularModule],
  template: `
    <section class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (tile of tiles(); track tile.label) {
          <ui-stats-tile
            [label]="tile.label"
            [value]="tile.value"
            [icon]="tile.icon"
            [iconColor]="tile.iconColor"
          ></ui-stats-tile>
        }
      </div>
    </section>
  `
})
export class StatsComponent {
  tiles = input<{ label: string; value: string; icon: any; iconColor: string }[]>([]);
}
