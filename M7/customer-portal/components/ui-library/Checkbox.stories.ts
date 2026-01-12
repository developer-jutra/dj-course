import type { Meta, StoryObj } from '@storybook/vue3'
import Checkbox from './Checkbox.vue'

const meta: Meta<typeof Checkbox> = {
  title: 'UI Library/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    'update:modelValue': { action: 'update:modelValue' }
  }
}

export default meta

type Story = StoryObj<typeof Checkbox>

const render = (args: any) => ({
  components: { Checkbox },
  setup() {
    const checked = ref(args.modelValue)
    return { args, checked }
  },
  template: `<Checkbox v-bind="args" v-model="checked" />`
})

export const Default: Story = {
  args: {
    modelValue: false,
    label: 'Checkbox Label'
  },
  render
}

export const Checked: Story = {
  args: {
    modelValue: true,
    label: 'Checkbox Label'
  },
  render
}

export const Disabled: Story = {
  args: {
    modelValue: false,
    label: 'Disabled Checkbox',
    disabled: true
  },
  render
}

export const DisabledChecked: Story = {
  args: {
    modelValue: true,
    label: 'Disabled Checked',
    disabled: true
  },
  render
}
