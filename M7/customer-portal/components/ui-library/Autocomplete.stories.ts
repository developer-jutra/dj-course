import type { Meta, StoryObj } from '@storybook/vue3'
import Autocomplete from './Autocomplete.vue'

const OPTIONS = [
  { id: '1', label: 'Apple', value: 'apple' },
  { id: '2', label: 'Banana', value: 'banana' },
  { id: '3', label: 'Cherry', value: 'cherry' }
]

const meta: Meta<typeof Autocomplete> = {
  title: 'UI Library/Autocomplete',
  component: Autocomplete,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof Autocomplete>

export const Default: Story = {
  args: {
    options: OPTIONS,
    placeholder: 'Search for an option...',
    modelValue: ''
  }
}

export const Preselected: Story = {
  args: {
    options: OPTIONS,
    placeholder: 'Search for an option...',
    modelValue: 'banana'
  }
}
