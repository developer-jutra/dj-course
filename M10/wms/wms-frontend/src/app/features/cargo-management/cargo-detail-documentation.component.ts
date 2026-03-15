import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryItem } from '../inventory/inventory.model';
import { LucideAngularModule, FileText } from 'lucide-angular';
import { CargoDocument } from './cargo.model';
import { MOCK_CARGO_DOCUMENTS } from '../../mock/cargo-documents.mock';
import { Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-cargo-detail-documentation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Heading4Component],
  template: `
    <div class="p-6">
      <ui-heading4 class="mb-4">Documentation</ui-heading4>
      <div class="space-y-4">
        @for (doc of mockDocuments; track doc.name) {
          <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700">
            <div class="flex items-center">
              <lucide-icon [img]="FileTextIcon" size="18" class="text-gray-400 mr-3"></lucide-icon>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ doc.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ doc.type }} • {{ doc.size }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ doc.uploadDate | date:'MMM d, y' }}</span>
              <button class="text-primary-600 hover:text-primary-500 text-sm">Download</button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CargoDetailDocumentationComponent {
  // Signal-based input
  cargoItem = input<InventoryItem | null>(null);

  // Lucide icons
  FileTextIcon = FileText;

  mockDocuments: CargoDocument[] = MOCK_CARGO_DOCUMENTS;
}