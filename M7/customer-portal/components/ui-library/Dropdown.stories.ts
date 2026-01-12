import type { Meta, StoryObj } from '@storybook/vue3'
import Dropdown from './Dropdown.vue'

const OPTIONS = [
  { id: '1', label: 'Apple', value: 'apple' },
  { id: '2', label: 'Banana', value: 'banana' },
  { id: '3', label: 'Cherry', value: 'cherry' }
]

const meta: Meta<typeof Dropdown> = {
  title: 'UI Library/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  args: {
    options: OPTIONS,
    placeholder: 'Select an option',
    modelValue: ''
  }
}

export const Selected: Story = {
  args: {
    options: OPTIONS,
    placeholder: 'Select an option',
    modelValue: 'cherry'
  }
}
