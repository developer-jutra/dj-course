import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';

interface AlertStoryProps {
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
  className?: string;
}

const meta: Meta<AlertStoryProps> = {
  title: 'UI/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['default', 'destructive'] },
    },
    title: { control: 'text' },
    description: { control: 'text' },
    className: { control: 'text' },
  },
  args: {
    variant: 'default',
    title: 'Heads up!',
    description: 'You can add components to your app using the cli.',
    className: '',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<AlertStoryProps>;

export const Playground: Story = {
  render: ({ variant, title, description, className }) => (
    <Alert variant={variant as any} className={className}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  ),
};

export const Default: Story = {
  name: 'Default',
  args: {
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Error!',
    description: 'Something went terribly wrong.',
  },
};
