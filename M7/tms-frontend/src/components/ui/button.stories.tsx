import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './button';

const meta: Meta<ButtonProps> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] },
    },
    size: {
      control: { type: 'select', options: ['default', 'sm', 'lg', 'icon'] },
    },
    asChild: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'default',
    asChild: false,
    disabled: false,
    children: 'Button',
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Playground: Story = {};

// Variant examples
export const Primary: Story = {
  name: 'Primary (Default)',
  args: {
    variant: 'default',
    children: 'Primary'
  }
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive'
  }
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary'
  }
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost'
  }
};

export const LinkVariant: Story = {
  name: 'Link',
  args: {
    variant: 'link',
    children: 'Link Style',
  }
};

// Size examples
export const Small: Story = {
  name: 'Small',
  args: {
    size: 'sm',
    children: 'Small'
  }
};

export const Large: Story = {
  name: 'Large',
  args: {
    size: 'lg',
    children: 'Large'
  }
};

export const Icon: Story = {
  name: 'Icon Button',
  args: {
    size: 'icon',
    children: '🔔',
    'aria-label': 'Notification'
  }
};
