import type { Meta, StoryObj } from '@storybook/angular';
import { TextInputComponent } from './TextInput.component';
import { FormsModule } from '@angular/forms';

const meta: Meta<TextInputComponent> = {
  title: 'UI Library/TextInput',
  component: TextInputComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (story) => ({
      moduleMetadata: {
        imports: [FormsModule],
      },
      ...story(),
    }),
  ],
};

export default meta;
type Story = StoryObj<TextInputComponent>;

export const Default: Story = {
  args: {
    label: '',
    placeholder: 'Enter text...',
    type: 'text',
    error: '',
    value: '',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    error: '',
    value: '',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    error: '',
    value: 'user@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    error: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    error: '',
    value: '',
  },
};

export const Number: Story = {
  args: {
    label: 'Age',
    placeholder: 'Enter your age',
    type: 'number',
    error: '',
    value: '',
  },
};

export const Email: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'name@example.com',
    type: 'email',
    error: '',
    value: '',
  },
};

export const Tel: Story = {
  args: {
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    type: 'tel',
    error: '',
    value: '',
  },
};

export const FormExample: Story = {
  render: (args) => ({
    props: {
      ...args,
      formData: {
        username: '',
        email: '',
        password: '',
      },
    },
    template: `
      <div class="max-w-md space-y-4">
        <ui-text-input
          label="Username"
          placeholder="Enter your username"
          [(value)]="formData.username"
        ></ui-text-input>
        
        <ui-text-input
          label="Email"
          placeholder="Enter your email"
          type="email"
          [(value)]="formData.email"
        ></ui-text-input>
        
        <ui-text-input
          label="Password"
          placeholder="Enter your password"
          type="password"
          [(value)]="formData.password"
        ></ui-text-input>
        
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Submit
        </button>
      </div>
    `,
  }),
};

export const WithValidation: Story = {
  render: (args) => ({
    props: {
      email: '',
      emailError: '',
      validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this['email']) {
          this['emailError'] = 'Email is required';
        } else if (!emailRegex.test(this['email'])) {
          this['emailError'] = 'Please enter a valid email address';
        } else {
          this['emailError'] = '';
        }
      },
    },
    template: `
      <div class="max-w-md">
        <ui-text-input
          label="Email"
          placeholder="Enter your email"
          type="email"
          [(value)]="email"
          [error]="emailError"
          (blur)="validateEmail()"
        ></ui-text-input>
      </div>
    `,
  }),
};
