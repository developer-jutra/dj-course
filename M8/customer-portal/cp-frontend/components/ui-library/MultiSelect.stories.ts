import type { Meta, StoryObj } from '@storybook/vue3'
import MultiSelect from './MultiSelect.vue'

const OPTIONS = [
  { id: '1', label: 'Apple', value: 'apple' },
  { id: '2', label: 'Banana', value: 'banana' },
  { id: '3', label: 'Cherry', value: 'cherry' }
]

const meta: Meta<typeof MultiSelect> = {
  title: 'UI Library/MultiSelect',
  component: MultiSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof MultiSelect>

export const Default: Story = {
  args: {
    options: OPTIONS,
    placeholder: 'Search and select options...',
    modelValue: []
  }
}

export const Preselected: Story = {
  args: {
    options: OPTIONS,
    placeholder: 'Search and select options...',
    modelValue: ['banana', 'cherry']
  }
} 