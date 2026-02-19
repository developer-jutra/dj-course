import type { Meta, StoryObj } from '@storybook/angular';
import { ModalComponent } from './Modal.component';

const meta: Meta<ModalComponent> = {
  title: 'UI Library/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<ModalComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        (click)="modal.isOpen.set(true)">
        Open Modal
      </button>
      <ui-modal #modal>
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">Modal Title</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            This is a modal dialog. Click outside or press Escape to close.
          </p>
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            (click)="modal.close()">
            Close
          </button>
        </div>
      </ui-modal>
    `,
  }),
};

export const WithContent: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        (click)="modal.isOpen.set(true)">
        Open Modal with Content
      </button>
      <ui-modal #modal>
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">Confirmation</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to proceed with this action? This cannot be undone.
          </p>
          <div class="flex gap-4 justify-end">
            <button 
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              (click)="modal.close()">
              Cancel
            </button>
            <button 
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              (click)="modal.close()">
              Confirm
            </button>
          </div>
        </div>
      </ui-modal>
    `,
  }),
};

export const LongContent: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        (click)="modal.isOpen.set(true)">
        Open Modal with Long Content
      </button>
      <ui-modal #modal>
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">Terms and Conditions</h2>
          <div class="max-h-96 overflow-y-auto text-gray-600 dark:text-gray-400 space-y-4 mb-6">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
            <p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
          </div>
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            (click)="modal.close()">
            Close
          </button>
        </div>
      </ui-modal>
    `,
  }),
};
