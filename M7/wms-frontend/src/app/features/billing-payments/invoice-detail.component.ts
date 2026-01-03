import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BillingService } from './billing.service';
import { Invoice, InvoiceItem } from './billing.model';
import { LucideAngularModule, ArrowLeft, FileText, Calendar, DollarSign, User, Download, Send, Edit } from 'lucide-angular';
import { MOCK_INVOICE_ITEMS } from '../../mock/invoice-items.mock';
import { Heading1Component, Heading2Component, Heading3Component, Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Heading1Component, Heading2Component, Heading3Component, Heading4Component],
  template: `
    @if (invoice) {
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button routerLink="/billing-payments" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <lucide-icon [img]="ArrowLeftIcon" size="20"></lucide-icon>
            </button>
            <div>
              <ui-heading1>{{ invoice.invoiceNumber }}</ui-heading1>
              <p class="text-gray-600 dark:text-gray-400">Invoice Details</p>
            </div>
            <span [class]="getStatusClass(invoice.status)" 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              {{ invoice.status | titlecase }}
            </span>
          </div>
          <div class="flex space-x-3">
            <button class="btn btn-secondary">
              <lucide-icon [img]="EditIcon" size="18" class="mr-2"></lucide-icon>
              Edit
            </button>
            <button class="btn btn-secondary">
              <lucide-icon [img]="SendIcon" size="18" class="mr-2"></lucide-icon>
              Send
            </button>
            <button class="btn btn-primary">
              <lucide-icon [img]="DownloadIcon" size="18" class="mr-2"></lucide-icon>
              Download PDF
            </button>
          </div>
        </div>

        <!-- Invoice Details Card -->
        <div class="card p-8">
          <!-- Invoice Header -->
          <div class="flex justify-between items-start mb-8">
            <div>
              <ui-heading2 class="mb-2">INVOICE</ui-heading2>
              <div class="space-y-1">
                <p class="text-sm text-gray-600 dark:text-gray-400">Invoice Number: <span class="font-medium text-gray-900 dark:text-white">{{ invoice.invoiceNumber }}</span></p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Issue Date: <span class="font-medium text-gray-900 dark:text-white">{{ invoice.issueDate | date:'MMM d, y' }}</span></p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Due Date: <span class="font-medium text-gray-900 dark:text-white">{{ invoice.dueDate | date:'MMM d, y' }}</span></p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-4xl font-bold text-primary-600">{{ invoice.amount | currency:'USD':'symbol':'1.2-2' }}</div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Amount</p>
            </div>
          </div>

          <!-- Bill To Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <ui-heading3 class="mb-3">From:</ui-heading3>
              <div class="space-y-1">
                <p class="font-medium text-gray-900 dark:text-white">Warehouse Management System</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">123 Industrial Blvd</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Chicago, IL 60601</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Phone: +1-555-0100</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Email: billing{{'@'}}wms.com</p>
              </div>
            </div>
            <div>
              <ui-heading3 class="mb-3">Bill To:</ui-heading3>
              <div class="space-y-1">
                <a [routerLink]="['/contractors', invoice.contractorId]"
                   class="font-medium text-primary-600 hover:text-primary-500">
                  {{ invoice.contractorName }}
                </a>
                <p class="text-sm text-gray-600 dark:text-gray-400">Contractor ID: {{ invoice.contractorId }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">123 Business Ave</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Business City, BC 12345</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">contact{{'@'}}{{ invoice.contractorName.toLowerCase().replace(' ', '') }}.com</p>
              </div>
            </div>
          </div>

          <!-- Invoice Items -->
          <div class="mb-8">
            <ui-heading3 class="mb-4">Invoice Items</ui-heading3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                <thead class="bg-gray-50 dark:bg-dark-800">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                  @for (item of invoice.items; track item.id) {
                    <tr>
                      <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.description }}</td>
                      <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{{ item.quantity }}</td>
                      <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{{ item.unitPrice | currency:'USD':'symbol':'1.2-2' }}</td>
                      <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{{ item.totalPrice | currency:'USD':'symbol':'1.2-2' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Invoice Summary -->
          <div class="flex justify-end">
            <div class="w-64">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ getSubtotal() | currency:'USD':'symbol':'1.2-2' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Tax (8.5%):</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ getTax() | currency:'USD':'symbol':'1.2-2' }}</span>
                </div>
                <div class="border-t border-gray-200 dark:border-dark-600 pt-2">
                  <div class="flex justify-between">
                    <span class="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">{{ invoice.amount | currency:'USD':'symbol':'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-dark-600">
            <ui-heading3 class="mb-4">Payment Information</ui-heading3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Terms</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Net 30 days</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Methods</p>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <p>Bank Transfer: Account #123-456-789</p>
                  <p>Check: Payable to "WMS Inc."</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-dark-600">
            <ui-heading3 class="mb-4">Notes</ui-heading3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Thank you for your business! Please remit payment within 30 days of the invoice date. 
              For any questions regarding this invoice, please contact our billing department at billing{{'@'}}wms.com.
            </p>
          </div>
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <lucide-icon [img]="FileTextIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
          <ui-heading4 class="mt-2">Invoice not found</ui-heading4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The requested invoice could not be found.</p>
        </div>
      </div>
    }
  `
})
export class InvoiceDetailComponent implements OnInit {
  invoice: Invoice | null = null;
  invoiceId: number = 0;

  // Lucide icons
  ArrowLeftIcon = ArrowLeft;
  FileTextIcon = FileText;
  CalendarIcon = Calendar;
  DollarSignIcon = DollarSign;
  UserIcon = User;
  DownloadIcon = Download;
  SendIcon = Send;
  EditIcon = Edit;

  private route = inject(ActivatedRoute);
  private billingService = inject(BillingService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.invoiceId = parseInt(params['id']);
      this.loadInvoiceDetails();
    });
  }

  loadInvoiceDetails(): void {
    this.billingService.getInvoice(this.invoiceId).subscribe(invoice => {
      if (invoice) {
        invoice.items = MOCK_INVOICE_ITEMS;
        this.invoice = invoice;
      } else {
        this.invoice = null;
      }
    });
  }

  getSubtotal(): number {
    return this.invoice?.items.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  }

  getTax(): number {
    return this.getSubtotal() * 0.085; // 8.5% tax
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-success-100 text-success-800';
      case 'sent': return 'bg-primary-100 text-primary-800';
      case 'overdue': return 'bg-error-100 text-error-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}