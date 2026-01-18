import type { Meta, StoryObj } from '@storybook/angular';
import { StatsComponent } from './Stats.component';
import { DollarSign, Users, Package, TrendingUp, Calendar, MapPin, Truck, FileText } from 'lucide-angular';

const meta: Meta<StatsComponent> = {
  title: 'UI Library/Stats',
  component: StatsComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<StatsComponent>;

export const Default: Story = {
  args: {
    tiles: [
      {
        label: 'Total Revenue',
        value: '$12,345',
        icon: DollarSign,
        iconColor: 'bg-green-100 dark:bg-green-900',
      },
      {
        label: 'Active Users',
        value: '1,234',
        icon: Users,
        iconColor: 'bg-blue-100 dark:bg-blue-900',
      },
      {
        label: 'Total Packages',
        value: '5,678',
        icon: Package,
        iconColor: 'bg-purple-100 dark:bg-purple-900',
      },
      {
        label: 'Growth Rate',
        value: '+12.5%',
        icon: TrendingUp,
        iconColor: 'bg-orange-100 dark:bg-orange-900',
      },
    ],
  },
};

export const WarehouseStats: Story = {
  args: {
    tiles: [
      {
        label: 'Total Cargo',
        value: '1,234',
        icon: Package,
        iconColor: 'bg-blue-100 dark:bg-blue-900',
      },
      {
        label: 'Reservations',
        value: '567',
        icon: Calendar,
        iconColor: 'bg-green-100 dark:bg-green-900',
      },
      {
        label: 'Locations',
        value: '89',
        icon: MapPin,
        iconColor: 'bg-purple-100 dark:bg-purple-900',
      },
      {
        label: 'Vehicles',
        value: '45',
        icon: Truck,
        iconColor: 'bg-orange-100 dark:bg-orange-900',
      },
    ],
  },
};

export const FinancialStats: Story = {
  args: {
    tiles: [
      {
        label: 'Total Revenue',
        value: '$125,678',
        icon: DollarSign,
        iconColor: 'bg-green-100 dark:bg-green-900',
      },
      {
        label: 'Pending Invoices',
        value: '23',
        icon: FileText,
        iconColor: 'bg-yellow-100 dark:bg-yellow-900',
      },
      {
        label: 'Paid Invoices',
        value: '156',
        icon: FileText,
        iconColor: 'bg-blue-100 dark:bg-blue-900',
      },
      {
        label: 'Growth',
        value: '+18.2%',
        icon: TrendingUp,
        iconColor: 'bg-purple-100 dark:bg-purple-900',
      },
    ],
  },
};

export const TwoTiles: Story = {
  args: {
    tiles: [
      {
        label: 'Total Revenue',
        value: '$12,345',
        icon: DollarSign,
        iconColor: 'bg-green-100 dark:bg-green-900',
      },
      {
        label: 'Active Users',
        value: '1,234',
        icon: Users,
        iconColor: 'bg-blue-100 dark:bg-blue-900',
      },
    ],
  },
};

export const SixTiles: Story = {
  args: {
    tiles: [
      {
        label: 'Total Revenue',
        value: '$12,345',
        icon: DollarSign,
        iconColor: 'bg-green-100 dark:bg-green-900',
      },
      {
        label: 'Active Users',
        value: '1,234',
        icon: Users,
        iconColor: 'bg-blue-100 dark:bg-blue-900',
      },
      {
        label: 'Total Packages',
        value: '5,678',
        icon: Package,
        iconColor: 'bg-purple-100 dark:bg-purple-900',
      },
      {
        label: 'Growth Rate',
        value: '+12.5%',
        icon: TrendingUp,
        iconColor: 'bg-orange-100 dark:bg-orange-900',
      },
      {
        label: 'Reservations',
        value: '567',
        icon: Calendar,
        iconColor: 'bg-pink-100 dark:bg-pink-900',
      },
      {
        label: 'Locations',
        value: '89',
        icon: MapPin,
        iconColor: 'bg-indigo-100 dark:bg-indigo-900',
      },
    ],
  },
};
