import Timeline from './Timeline.vue'
import type { Meta, StoryFn } from '@storybook/vue3'

const meta: Meta<typeof Timeline> = {
  title: 'UI Library/Timeline',
  component: Timeline,
}

export default meta

type TimelineArgs = {
  items: Array<{
    id: string
    timestamp: Date | string
    status: string
    description: string
    location?: string
    estimatedTime?: Date | string
    actualTime?: Date | string
  }>
  prefix?: string
}

const Template: StoryFn<typeof Timeline> = (args: TimelineArgs) => ({
  components: { Timeline },
  setup() { return { args } },
  template: '<Timeline v-bind="args" />',
})

export const WarehouseTimeline = Template.bind({})
WarehouseTimeline.args = {
  prefix: 'at',
  items: [
    { id: '1', timestamp: new Date('2024-07-01T10:00:00'), status: 'SUBMITTED', description: 'Request submitted', estimatedTime: '2024-07-03T09:00:00', actualTime: '2024-07-03T08:45:00' },
    { id: '2', timestamp: new Date('2024-07-02T14:20:00'), status: 'APPROVED', description: 'Approved by manager', estimatedTime: '2024-07-04T11:00:00' },
    { id: '3', timestamp: new Date('2024-07-05T15:30:00'), status: 'STORED', description: 'Items stored', location: 'Warehouse A', actualTime: '2024-07-05T15:30:00' }
  ],
}

export const ShipmentTimeline = Template.bind({})
ShipmentTimeline.args = {
  prefix: 'in',
  items: [
    { id: '1', timestamp: new Date('2024-07-01T08:00:00'), status: 'PICKED_UP', description: 'Shipment picked up', actualTime: '2024-07-01T09:00:00' },
    { id: '2', timestamp: new Date('2024-07-02T12:00:00'), status: 'IN_TRANSIT', description: 'In transit', estimatedTime: '2024-07-03T18:00:00' },
    { id: '3', timestamp: new Date('2024-07-03T17:30:00'), status: 'DELIVERED', description: 'Delivered to destination', actualTime: '2024-07-03T17:30:00' }
  ],
} 