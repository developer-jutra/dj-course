import type { Meta, StoryObj } from '@storybook/vue3'
import Radio from './Radio.vue'
import { ref } from 'vue'

const meta: Meta<typeof Radio> = {
  title: 'UI Library/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    'update:modelValue': { action: 'update:modelValue' }
  }
}

export default meta

type Story = StoryObj<typeof Radio>

const render = (args: any) => ({
  components: { Radio },
  setup() {
    const selected = ref(args.modelValue)
    return { args, selected }
  },
  template: `<Radio v-bind="args" v-model="selected" />`
})

export const Default: Story = {
  args: {
    modelValue: '',
    value: 'apple',
    label: 'Apple'
  },
  render
}

export const Selected: Story = {
  args: {
    modelValue: 'apple',
    value: 'apple',
    label: 'Apple'
  },
  render
}

export const Disabled: Story = {
  args: {
    modelValue: '',
    value: 'apple',
    label: 'Disabled Radio',
    disabled: true
  },
  render
}

export const DisabledSelected: Story = {
  args: {
    modelValue: 'apple',
    value: 'apple',
    label: 'Disabled Selected',
    disabled: true
  },
  render
}
