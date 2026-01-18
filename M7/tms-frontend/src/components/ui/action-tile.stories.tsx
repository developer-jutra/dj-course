import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { ActionTile } from './action-tile';
import { ExternalLink } from 'lucide-react';

const meta: Meta<typeof ActionTile> = {
  title: 'UI/ActionTile',
  component: ActionTile,
  argTypes: {
    variant: {
      control: 'select',
      options: ['blue', 'green', 'purple', 'yellow', 'orange'],
    },
    size: {
      control: 'select',
      options: ['NORMAL', 'SMALL'],
    },
    onClick: { action: 'clicked' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ActionTile>;

export const Default: Story = {
  args: {
    label: 'Details',
    onClick: () => {},
  },
};

export const WithIcon: Story = {
  args: {
    label: (
      <>
        <ExternalLink className="w-4 h-4" />
        <span>Details</span>
      </>
    ),
    variant: 'green',
    onClick: () => {},
  },
};

export const Small: Story = {
  args: {
    label: 'Details',
    size: 'SMALL',
    onClick: () => {},
  },
};

export const SmallWithIcon: Story = {
  args: {
    label: (
      <>
        <ExternalLink className="w-4 h-4" />
        <span>Details</span>
      </>
    ),
    variant: 'green',
    size: 'SMALL',
    onClick: () => {},
  },
};
