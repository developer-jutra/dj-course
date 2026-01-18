import type { Meta, StoryObj } from '@storybook/vue3'
import RadioList from './RadioList.vue'
import { ref } from 'vue'

const OPTIONS = [
  { id: '1', label: 'Apple', value: 'apple' },
  { id: '2', label: 'Banana', value: 'banana' },
  { id: '3', label: 'Cherry', value: 'cherry' },
  { id: '4', label: 'Date', value: 'date', disabled: true }
]

const meta: Meta<typeof RadioList> = {
  title: 'UI Library/RadioList',
  component: RadioList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    'update:modelValue': { action: 'update:modelValue' }
  }
}

export default meta

type Story = StoryObj<typeof RadioList>

const render = (args: any) => ({
  components: { RadioList },
  setup() {
    const selectedValue = ref(args.modelValue)
    return { args, selectedValue }
  },
  template: `<RadioList v-bind="args" v-model="selectedValue" />`
})

export const Default: Story = {
  args: {
    options: OPTIONS,
    title: 'Select Fruit',
    modelValue: ''
  },
  render
}

export const Preselected: Story = {
  args: {
    options: OPTIONS,
    title: 'Select Fruit',
    modelValue: 'banana'
  },
  render
}

export const WithoutTitle: Story = {
  args: {
    options: OPTIONS,
    modelValue: 'apple'
  },
  render
}
