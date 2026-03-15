import type { Meta, StoryObj } from '@storybook/angular';
import { SectionComponent } from './Section.component';

const meta: Meta<SectionComponent> = {
  title: 'UI Library/Section',
  component: SectionComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<SectionComponent>;

export const Default: Story = {
  args: {
    description: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-section>
        <h3 class="text-xl font-semibold mb-4">Section Title</h3>
        <p class="text-gray-600 dark:text-gray-400">
          This is the content inside the section component.
        </p>
      </ui-section>
    `,
  }),
};

export const WithDescription: Story = {
  args: {
    description: 'This is a description that appears at the top of the section.',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-section [description]="description()">
        <h3 class="text-xl font-semibold mb-4">Section Title</h3>
        <p class="text-gray-600 dark:text-gray-400">
          This is the content inside the section component.
        </p>
      </ui-section>
    `,
  }),
};

export const WithFormContent: Story = {
  args: {
    description: 'Fill out the form below to update your information.',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-section [description]="description()">
        <h3 class="text-xl font-semibold mb-4">User Information</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input type="text" class="input w-full" placeholder="Enter your name" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" class="input w-full" placeholder="Enter your email" />
          </div>
          <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </ui-section>
    `,
  }),
};

export const MultipleSections: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-section description="Personal information section">
        <h3 class="text-xl font-semibold mb-4">Personal Information</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Your personal details and contact information.
        </p>
      </ui-section>
      
      <ui-section description="Account settings section">
        <h3 class="text-xl font-semibold mb-4">Account Settings</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Manage your account preferences and security settings.
        </p>
      </ui-section>
      
      <ui-section description="Notification preferences">
        <h3 class="text-xl font-semibold mb-4">Notifications</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Configure how and when you receive notifications.
        </p>
      </ui-section>
    `,
  }),
};
