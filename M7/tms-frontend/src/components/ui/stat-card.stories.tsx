import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard, StatCardProps } from './stat-card';
import { FileText, DollarSign, Clock, CheckCircle, AlertTriangle, Camera } from 'lucide-react';

const meta: Meta<StatCardProps> = {
  title: 'UI/StatCard',
  component: StatCard,
  argTypes: {
    label: {
      control: 'text',
      description: 'Label/title of the stat'
    },
    value: {
      control: 'text',
      description: 'The main value to display'
    },
    bgColor: {
      control: 'text',
      description: 'Background color class for the card'
    },
    borderColor: {
      control: 'text',
      description: 'Border color class for the card'
    },
    labelColor: {
      control: 'text',
      description: 'Text color class for the label'
    },
    valueColor: {
      control: 'text',
      description: 'Text color class for the value'
    },
    iconColor: {
      control: 'text',
      description: 'Icon color class (for Lucide icons)'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    },
  },
  args: {
    label: 'Total Claims',
    value: '5',
    icon: FileText,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    labelColor: 'text-blue-800',
    valueColor: 'text-blue-600',
    iconColor: 'text-blue-600',
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

type Story = StoryObj<StatCardProps>;

export const Playground: Story = {
  render: (args) => <StatCard {...args} />,
};

// Claims page examples
export const TotalClaims: Story = {
  args: {
    icon: FileText,
    label: 'Total Claims',
    value: '5',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    labelColor: 'text-blue-800',
    valueColor: 'text-blue-600',
    iconColor: 'text-blue-600',
  },
};

export const PendingReview: Story = {
  args: {
    icon: Clock,
    label: 'Pending Review',
    value: '3',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    labelColor: 'text-orange-800',
    valueColor: 'text-orange-600',
    iconColor: 'text-orange-600',
  },
};

export const ApprovedClaims: Story = {
  args: {
    icon: CheckCircle,
    label: 'Approved',
    value: '1',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    labelColor: 'text-green-800',
    valueColor: 'text-green-600',
    iconColor: 'text-green-600',
  },
};

export const TotalClaimedAmount: Story = {
  args: {
    icon: DollarSign,
    label: 'Total Claimed',
    value: '$8,270',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    labelColor: 'text-red-800',
    valueColor: 'text-red-600',
    iconColor: 'text-red-600',
  },
};

// Incidents page examples
export const UrgentIncidents: Story = {
  args: {
    icon: AlertTriangle,
    label: 'Urgent Incidents',
    value: '1',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    labelColor: 'text-red-800',
    valueColor: 'text-red-600',
    iconColor: 'text-red-600',
  },
};

export const UnderInvestigation: Story = {
  args: {
    icon: Clock,
    label: 'Under Investigation',
    value: '1',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    labelColor: 'text-blue-800',
    valueColor: 'text-blue-600',
    iconColor: 'text-blue-600',
  },
};

export const InProgress: Story = {
  args: {
    icon: FileText,
    label: 'In Progress',
    value: '1',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    labelColor: 'text-orange-800',
    valueColor: 'text-orange-600',
    iconColor: 'text-orange-600',
  },
};

export const ResolvedIncidents: Story = {
  args: {
    icon: Camera,
    label: 'Resolved',
    value: '1',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    labelColor: 'text-green-800',
    valueColor: 'text-green-600',
    iconColor: 'text-green-600',
  },
};

// Expenses page examples (white background)
export const TotalExpenses: Story = {
  args: {
    icon: '💰',
    label: 'Total Expenses',
    value: '45,678 PLN',
    bgColor: 'bg-white',
    labelColor: 'text-gray-600',
    valueColor: 'text-blue-600',
  },
};

export const PendingApproval: Story = {
  args: {
    icon: '⏳',
    label: 'Pending Approval',
    value: '12',
    bgColor: 'bg-white',
    labelColor: 'text-gray-600',
    valueColor: 'text-yellow-600',
  },
};

export const UnpaidExpenses: Story = {
  args: {
    icon: '💳',
    label: 'Unpaid',
    value: '8',
    bgColor: 'bg-white',
    labelColor: 'text-gray-600',
    valueColor: 'text-red-600',
  },
};

export const TotalRecords: Story = {
  args: {
    icon: '📊',
    label: 'Total Records',
    value: '156',
    bgColor: 'bg-white',
    labelColor: 'text-gray-600',
    valueColor: 'text-green-600',
  },
};

// Example with emoji icon
export const WithEmojiIcon: Story = {
  args: {
    icon: '🚗',
    label: 'Active Vehicles',
    value: '24',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    labelColor: 'text-purple-800',
    valueColor: 'text-purple-600',
  },
};

// Grid examples showing different use cases
export const ClaimsGrid: Story = {
  name: 'Claims Page Grid',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-8">
      <StatCard
        icon={FileText}
        label="Total Claims"
        value="5"
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
        labelColor="text-blue-800"
        valueColor="text-blue-600"
        iconColor="text-blue-600"
      />
      <StatCard
        icon={Clock}
        label="Pending Review"
        value="3"
        bgColor="bg-orange-50"
        borderColor="border-orange-200"
        labelColor="text-orange-800"
        valueColor="text-orange-600"
        iconColor="text-orange-600"
      />
      <StatCard
        icon={CheckCircle}
        label="Approved"
        value="1"
        bgColor="bg-green-50"
        borderColor="border-green-200"
        labelColor="text-green-800"
        valueColor="text-green-600"
        iconColor="text-green-600"
      />
      <StatCard
        icon={DollarSign}
        label="Total Claimed"
        value="$8,270"
        bgColor="bg-red-50"
        borderColor="border-red-200"
        labelColor="text-red-800"
        valueColor="text-red-600"
        iconColor="text-red-600"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const IncidentsGrid: Story = {
  name: 'Incidents Page Grid',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-8">
      <StatCard
        icon={AlertTriangle}
        label="Urgent Incidents"
        value="1"
        bgColor="bg-red-50"
        borderColor="border-red-200"
        labelColor="text-red-800"
        valueColor="text-red-600"
        iconColor="text-red-600"
      />
      <StatCard
        icon={Clock}
        label="Under Investigation"
        value="1"
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
        labelColor="text-blue-800"
        valueColor="text-blue-600"
        iconColor="text-blue-600"
      />
      <StatCard
        icon={FileText}
        label="In Progress"
        value="1"
        bgColor="bg-orange-50"
        borderColor="border-orange-200"
        labelColor="text-orange-800"
        valueColor="text-orange-600"
        iconColor="text-orange-600"
      />
      <StatCard
        icon={Camera}
        label="Resolved"
        value="1"
        bgColor="bg-green-50"
        borderColor="border-green-200"
        labelColor="text-green-800"
        valueColor="text-green-600"
        iconColor="text-green-600"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const ExpensesGrid: Story = {
  name: 'Expenses Page Grid',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-8">
      <StatCard
        icon="💰"
        label="Total Expenses"
        value="45,678 PLN"
        bgColor="bg-white"
        labelColor="text-gray-600"
        valueColor="text-blue-600"
      />
      <StatCard
        icon="⏳"
        label="Pending Approval"
        value="12"
        bgColor="bg-white"
        labelColor="text-gray-600"
        valueColor="text-yellow-600"
      />
      <StatCard
        icon="💳"
        label="Unpaid"
        value="8"
        bgColor="bg-white"
        labelColor="text-gray-600"
        valueColor="text-red-600"
      />
      <StatCard
        icon="📊"
        label="Total Records"
        value="156"
        bgColor="bg-white"
        labelColor="text-gray-600"
        valueColor="text-green-600"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

