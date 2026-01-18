import type { Meta, StoryObj } from '@storybook/angular';
import { StatsTileComponent } from './StatsTile.component';
import { DollarSign, Users, Package, TrendingUp } from 'lucide-angular';

const meta: Meta<StatsTileComponent> = {
  title: 'UI Library/StatsTile',
  component: StatsTileComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<StatsTileComponent>;

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$12,345',
    icon: DollarSign,
    iconColor: 'bg-green-100 dark:bg-green-900',
  },
};

export const WithUsers: Story = {
  args: {
    label: 'Active Users',
    value: '1,234',
    icon: Users,
    iconColor: 'bg-blue-100 dark:bg-blue-900',
  },
};

export const WithPackage: Story = {
  args: {
    label: 'Total Packages',
    value: '5,678',
    icon: Package,
    iconColor: 'bg-purple-100 dark:bg-purple-900',
  },
};

export const WithTrending: Story = {
  args: {
    label: 'Growth Rate',
    value: '+12.5%',
    icon: TrendingUp,
    iconColor: 'bg-orange-100 dark:bg-orange-900',
  },
};

export const MultipleTiles: Story = {
  render: (args) => ({
    props: {
      ...args,
      dollarIcon: DollarSign,
      usersIcon: Users,
      packageIcon: Package,
      trendingIcon: TrendingUp,
    },
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ui-stats-tile
          label="Total Revenue"
          value="$12,345"
          [icon]="dollarIcon"
          iconColor="bg-green-100 dark:bg-green-900"
        ></ui-stats-tile>
        
        <ui-stats-tile
          label="Active Users"
          value="1,234"
          [icon]="usersIcon"
          iconColor="bg-blue-100 dark:bg-blue-900"
        ></ui-stats-tile>
        
        <ui-stats-tile
          label="Total Packages"
          value="5,678"
          [icon]="packageIcon"
          iconColor="bg-purple-100 dark:bg-purple-900"
        ></ui-stats-tile>
        
        <ui-stats-tile
          label="Growth Rate"
          value="+12.5%"
          [icon]="trendingIcon"
          iconColor="bg-orange-100 dark:bg-orange-900"
        ></ui-stats-tile>
      </div>
    `,
  }),
};
