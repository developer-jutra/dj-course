import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { MetricCard, MetricCardProps } from './metric-card';

const meta: Meta<MetricCardProps> = {
  title: 'UI/MetricCard',
  component: MetricCard,
  argTypes: {
    title: { 
      control: 'text',
      description: 'The main title/label of the metric'
    },
    value: { 
      control: 'text',
      description: 'The main value to display'
    },
    description: { 
      control: 'text',
      description: 'Description text shown below the value'
    },
    trend: { 
      control: 'text',
      description: 'The trend indicator (use + or - prefix)'
    },
    bgColor: { 
      control: 'text',
      description: 'Background color class for the card'
    },
    valueColor: { 
      control: 'text',
      description: 'Text color class for the value'
    },
    className: { 
      control: 'text',
      description: 'Additional CSS classes'
    },
  },
  args: {
    title: 'Perfect Order Rate',
    value: '94.2%',
    description: 'Orders completed without errors, delays, or damage',
    trend: '+2.1%',
    bgColor: 'bg-blue-50',
    valueColor: 'text-blue-600',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<MetricCardProps>;

export const Playground: Story = {
  render: (args) => <MetricCard {...args} />,
};

export const PerfectOrderRate: Story = {
  args: {
    title: 'Perfect Order Rate',
    value: '94.2%',
    description: 'Orders completed without errors, delays, or damage',
    trend: '+2.1%',
    bgColor: 'bg-blue-50',
    valueColor: 'text-blue-600',
  },
};

export const OrderAccuracyRate: Story = {
  args: {
    title: 'Order Accuracy Rate',
    value: '97.8%',
    description: 'Orders fulfilled exactly as requested',
    trend: '+0.5%',
    bgColor: 'bg-green-50',
    valueColor: 'text-green-600',
  },
};

export const CostPerDelivery: Story = {
  args: {
    title: 'Cost Per Delivery',
    value: '$12.45',
    description: 'Average total cost per completed delivery',
    trend: '-0.8%',
    bgColor: 'bg-purple-50',
    valueColor: 'text-purple-600',
  },
};

export const OnTimeDeliveryRate: Story = {
  name: 'On-Time Delivery Rate',
  args: {
    title: 'On-Time Delivery Rate',
    value: '89.5%',
    description: 'Deliveries completed by promised time',
    trend: '+3.2%',
    bgColor: 'bg-amber-50',
    valueColor: 'text-amber-600',
  },
};

export const AverageDeliveryTime: Story = {
  args: {
    title: 'Average Delivery Time',
    value: '2.3 days',
    description: 'From order placement to delivery',
    trend: '-0.2 days',
    bgColor: 'bg-rose-50',
    valueColor: 'text-rose-600',
  },
};

export const NegativeTrend: Story = {
  name: 'Negative Trend Example',
  args: {
    title: 'Customer Complaints',
    value: '23',
    description: 'Complaints received this month',
    trend: '-12%',
    bgColor: 'bg-red-50',
    valueColor: 'text-red-600',
  },
};

export const PositiveTrend: Story = {
  name: 'Positive Trend Example',
  args: {
    title: 'Customer Satisfaction',
    value: '4.8/5.0',
    description: 'Average rating from customer surveys',
    trend: '+0.3',
    bgColor: 'bg-emerald-50',
    valueColor: 'text-emerald-600',
  },
};

export const NeutralColors: Story = {
  args: {
    title: 'Active Vehicles',
    value: '42',
    description: 'Currently active in fleet',
    trend: '+5',
    bgColor: 'bg-gray-50',
    valueColor: 'text-gray-900',
  },
};

export const MultipleCardsGrid: Story = {
  name: 'Multiple Cards in Grid',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-8">
      <MetricCard
        title="Perfect Order Rate"
        value="94.2%"
        description="Orders completed without errors, delays, or damage"
        trend="+2.1%"
        bgColor="bg-blue-50"
        valueColor="text-blue-600"
      />
      <MetricCard
        title="Order Accuracy Rate"
        value="97.8%"
        description="Orders fulfilled exactly as requested"
        trend="+0.5%"
        bgColor="bg-green-50"
        valueColor="text-green-600"
      />
      <MetricCard
        title="Cost Per Delivery"
        value="$12.45"
        description="Average total cost per completed delivery"
        trend="-0.8%"
        bgColor="bg-purple-50"
        valueColor="text-purple-600"
      />
      <MetricCard
        title="On-Time Delivery"
        value="89.5%"
        description="Deliveries completed by promised time"
        trend="+3.2%"
        bgColor="bg-amber-50"
        valueColor="text-amber-600"
      />
      <MetricCard
        title="Avg Delivery Time"
        value="2.3 days"
        description="From order placement to delivery"
        trend="-0.2 days"
        bgColor="bg-rose-50"
        valueColor="text-rose-600"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

