import type { Meta, StoryObj } from '@storybook/vue3'
import CheckboxList from './CheckboxList.vue'
import { ref } from 'vue'

const OPTIONS = [
  { id: '1', label: 'Apple', value: 'apple' },
  { id: '2', label: 'Banana', value: 'banana' },
  { id: '3', label: 'Cherry', value: 'cherry' },
  { id: '4', label: 'Date', value: 'date', disabled: true }
]

const meta: Meta<typeof CheckboxList> = {
  title: 'UI Library/CheckboxList',
  component: CheckboxList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    'update:modelValue': { action: 'update:modelValue' }
  }
}

export default meta

type Story = StoryObj<typeof CheckboxList>

const render = (args: any) => ({
  components: { CheckboxList },
  setup() {
    const selectedValues = ref(args.modelValue)
    return { args, selectedValues }
  },
  template: `<CheckboxList v-bind="args" v-model="selectedValues" />`
})

export const Default: Story = {
  args: {
    options: OPTIONS,
    title: 'Select Fruits',
    modelValue: []
  },
  render
}

export const Preselected: Story = {
  args: {
    options: OPTIONS,
    title: 'Select Fruits',
    modelValue: ['banana', 'cherry']
  },
  render
}

export const WithoutTitle: Story = {
  args: {
    options: OPTIONS,
    modelValue: ['apple']
  },
  render
}
