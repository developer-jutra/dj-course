import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from './Badge.vue'
import type { BadgeVariant } from './Badge.vue'

const meta: Meta<typeof Badge> = {
  title: 'UI Library/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['blue', 'yellow', 'orange', 'cyan', 'purple', 'green', 'gray'] as BadgeVariant[]
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Default Badge',
    variant: 'blue'
  }
}

export const AllVariants: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Badge label="Blue" variant="blue" />
          <Badge label="Yellow" variant="yellow" />
          <Badge label="Orange" variant="orange" />
          <Badge label="Cyan" variant="cyan" />
          <Badge label="Purple" variant="purple" />
          <Badge label="Green" variant="green" />
          <Badge label="Gray" variant="gray" />
        </div>
      </div>
    `
  })
}

export const StatusExamples: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Badge label="Submitted" variant="yellow" />
          <Badge label="In Progress" variant="blue" />
          <Badge label="Pickup Scheduled" variant="orange" />
          <Badge label="Picked Up" variant="cyan" />
          <Badge label="In Transit" variant="purple" />
          <Badge label="Delivered" variant="green" />
        </div>
      </div>
    `
  })
}

export const ServiceTypeExamples: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Badge label="Standard Delivery" variant="blue" />
          <Badge label="Express Delivery" variant="blue" />
          <Badge label="Same Day Delivery" variant="blue" />
          <Badge label="Next Day Delivery" variant="blue" />
        </div>
      </div>
    `
  })
}

export const LongText: Story = {
  args: {
    label: 'This is a very long badge text to test wrapping',
    variant: 'blue'
  }
}
