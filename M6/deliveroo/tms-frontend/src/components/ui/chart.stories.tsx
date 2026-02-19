import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from './chart';
import {
  LineChart,
  BarChart,
  PieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Bar,
  Pie,
  Cell,
} from 'recharts';

const lineData = [
  { name: 'Jan', uv: 4000, pv: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 9800 },
  { name: 'Apr', uv: 2780, pv: 3908 },
  { name: 'May', uv: 1890, pv: 4800 },
  { name: 'Jun', uv: 2390, pv: 3800 },
  { name: 'Jul', uv: 3490, pv: 4300 },
];

const barData = [
  { name: 'Mon', sales: 30, profit: 10 },
  { name: 'Tue', sales: 20, profit: 15 },
  { name: 'Wed', sales: 27, profit: 13 },
  { name: 'Thu', sales: 18, profit: 12 },
  { name: 'Fri', sales: 23, profit: 17 },
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const lineConfig = {
  uv: { label: 'UV Index', color: '#8884d8' },
  pv: { label: 'PV Value', color: '#82ca9d' },
};

const barConfig = {
  sales: { label: 'Sales', color: '#8884d8' },
  profit: { label: 'Profit', color: '#82ca9d' },
};

const pieConfig = {
  'Group A': { label: 'Group A', color: '#0088FE' },
  'Group B': { label: 'Group B', color: '#00C49F' },
  'Group C': { label: 'Group C', color: '#FFBB28' },
  'Group D': { label: 'Group D', color: '#FF8042' },
};

const meta: Meta = {
  title: 'UI/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ChartContainer>;

export const LineChartExample: Story = {
  name: 'Line Chart',
  render: () => (
    <ChartContainer config={lineConfig} className="h-64">
      <LineChart data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
      </LineChart>
    </ChartContainer>
  ),
};

export const BarChartExample: Story = {
  name: 'Bar Chart',
  render: () => (
    <ChartContainer config={barConfig} className="h-64">
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="sales" fill="#8884d8" />
        <Bar dataKey="profit" fill="#82ca9d" />
      </BarChart>
    </ChartContainer>
  ),
};

export const PieChartExample: Story = {
  name: 'Pie Chart',
  render: () => (
    <ChartContainer config={pieConfig} className="h-64">
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
        >
          {pieData.map((entry, index) => (
            <Cell key={entry.name} fill={pieConfig[entry.name].color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  ),
};
