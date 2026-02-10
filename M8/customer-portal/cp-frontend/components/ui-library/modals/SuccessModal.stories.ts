import type { Meta, StoryObj } from '@nuxtjs/storybook'
import SuccessModal from './SuccessModal.vue'

const meta = {
  title: 'UI Library/SuccessModal',
  component: SuccessModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A success modal component for displaying confirmation of successful actions with additional information and next steps.'
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
      description: 'Success modal title'
    },
    message: {
      control: 'text',
      description: 'Success message text'
    },
    referenceNumber: {
      control: 'text',
      description: 'Optional reference number for the action'
    },
    nextSteps: {
      control: 'object',
      description: 'Array of next steps to display'
    },
    showContact: {
      control: 'boolean',
      description: 'Whether to show contact information'
    },
    primaryAction: {
      control: 'object',
      description: 'Primary action button configuration'
    },
    closeLabel: {
      control: 'text',
      description: 'Label for close button'
    }
  }
} satisfies Meta<typeof SuccessModal>

export default meta
type Story = StoryObj<typeof meta>

// Basic success modal
export const Default: Story = {
  args: {
    show: true,
    title: 'Success!',
    message: 'Your action has been completed successfully.',
    closeLabel: 'Close'
  }
}

// Transportation request success
export const TransportationRequestSuccess: Story = {
  args: {
    show: true,
    title: 'Transportation Request Submitted',
    message: 'Your transportation request has been successfully submitted and is being processed.',
    referenceNumber: 'TRN-2024-001234',
    nextSteps: [
      'Your request will be reviewed within 2 hours',
      'You will receive a confirmation email with pickup details',
      'Track your shipment using the reference number above'
    ],
    showContact: true,
    primaryAction: {
      label: 'Track Request',
      action: () => {}
    },
    closeLabel: 'Close'
  }
}

// Warehousing request success
export const WarehousingRequestSuccess: Story = {
  args: {
    show: true,
    title: 'Warehousing Request Confirmed',
    message: 'Your warehousing request has been confirmed and space has been allocated.',
    referenceNumber: 'WRH-2024-005678',
    nextSteps: [
      'Your storage space is now reserved',
      'You will receive access details within 24 hours',
      'Our team will contact you to schedule item delivery'
    ],
    showContact: true,
    primaryAction: {
      label: 'View Details',
      action: () => {}
    },
    closeLabel: 'Done'
  }
}

// User registration success
export const UserRegistrationSuccess: Story = {
  args: {
    show: true,
    title: 'Welcome to Deliveroo!',
    message: 'Your account has been successfully created. You can now start using our services.',
    referenceNumber: 'USR-2024-009876',
    nextSteps: [
      'Complete your profile to get personalized recommendations',
      'Verify your email address to unlock all features',
      'Explore our services and submit your first request'
    ],
    showContact: false,
    primaryAction: {
      label: 'Complete Profile',
      action: () => {}
    },
    closeLabel: 'Skip for Now'
  }
}

// Simple success without extras
export const SimpleSuccess: Story = {
  args: {
    show: true,
    title: 'Changes Saved',
    message: 'Your changes have been saved successfully.',
    showContact: false,
    closeLabel: 'OK'
  }
}

// Success with contact but no next steps
export const SuccessWithContact: Story = {
  args: {
    show: true,
    title: 'Payment Processed',
    message: 'Your payment has been processed successfully.',
    referenceNumber: 'PAY-2024-112233',
    showContact: true,
    primaryAction: {
      label: 'View Receipt',
      action: () => {}
    },
    closeLabel: 'Close'
  }
}

// Success with next steps but no contact
export const SuccessWithNextSteps: Story = {
  args: {
    show: true,
    title: 'Order Placed',
    message: 'Your order has been placed successfully.',
    referenceNumber: 'ORD-2024-445566',
    nextSteps: [
      'Your order is being prepared',
      'You will receive a tracking number via email',
      'Expected delivery time: 2-3 business days'
    ],
    showContact: false,
    primaryAction: {
      label: 'Track Order',
      action: () => {}
    },
    closeLabel: 'Continue Shopping'
  }
}

// Hidden modal (for testing states)
export const Hidden: Story = {
  args: {
    show: false,
    title: 'Hidden Modal',
    message: 'This modal is not visible',
    closeLabel: 'Close'
  }
} 