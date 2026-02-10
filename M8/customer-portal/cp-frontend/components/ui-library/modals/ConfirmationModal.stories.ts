import type { Meta, StoryObj } from '@nuxtjs/storybook'
import ConfirmationModal from './ConfirmationModal.vue'

const meta = {
  title: 'UI Library/ConfirmationModal',
  component: ConfirmationModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A reusable confirmation modal component for user actions that need confirmation.'
      }
    }
  },
  argTypes: {
    show: {
      control: 'boolean',
      description: 'Controls modal visibility'
    },
    title: {
      control: 'text',
      description: 'Modal title'
    },
    message: {
      control: 'text',
      description: 'Confirmation message text'
    },
    confirmText: {
      control: 'text',
      description: 'Text for confirm button'
    },
    cancelText: {
      control: 'text',
      description: 'Text for cancel button'
    },
    confirmButtonStyle: {
      control: 'select',
      options: ['primary', 'danger'],
      description: 'Styling for confirm button'
    }
  }
} satisfies Meta<typeof ConfirmationModal>

export default meta
type Story = StoryObj<typeof meta>

// Basic confirmation modal
export const Default: Story = {
  args: {
    show: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed with this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonStyle: 'primary'
  }
}

// Delete confirmation with danger styling
export const DeleteConfirmation: Story = {
  args: {
    show: true,
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmButtonStyle: 'danger'
  }
}

// Logout confirmation
export const LogoutConfirmation: Story = {
  args: {
    show: true,
    title: 'Sign Out',
    message: 'Are you sure you want to sign out of your account?',
    confirmText: 'Sign Out',
    cancelText: 'Stay Signed In',
    confirmButtonStyle: 'primary'
  }
}

// Cancel order confirmation
export const CancelOrderConfirmation: Story = {
  args: {
    show: true,
    title: 'Cancel Order',
    message: 'Are you sure you want to cancel this order? You may be charged a cancellation fee.',
    confirmText: 'Cancel Order',
    cancelText: 'Keep Order',
    confirmButtonStyle: 'danger'
  }
}

// Submit form confirmation
export const SubmitFormConfirmation: Story = {
  args: {
    show: true,
    title: 'Submit Request',
    message: 'Please review your information before submitting. Are you ready to submit this request?',
    confirmText: 'Submit Request',
    cancelText: 'Review Again',
    confirmButtonStyle: 'primary'
  }
}

// Hidden modal (for testing states)
export const Hidden: Story = {
  args: {
    show: false,
    title: 'Hidden Modal',
    message: 'This modal is not visible',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonStyle: 'primary'
  }
} 