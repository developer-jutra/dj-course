import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

interface CardStoryProps {
  headerTitle: string;
  headerDescription: string;
  content: string;
  footer: string;
  className?: string;
}

const meta: Meta<CardStoryProps> = {
  title: 'UI/Card',
  component: Card,
  argTypes: {
    headerTitle: { control: 'text' },
    headerDescription: { control: 'text' },
    content: { control: 'text' },
    footer: { control: 'text' },
    className: { control: 'text' },
  },
  args: {
    headerTitle: 'Card Title',
    headerDescription: 'Card description goes here.',
    content: 'This is the card content.',
    footer: 'Card Footer',
    className: '',
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<CardStoryProps>;

export const Playground: Story = {
  render: ({ headerTitle, headerDescription, content, footer, className }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  ),
};

// Additional examples
export const Basic: Story = {
  name: 'Basic',
  args: {},
};

export const WithoutHeader: Story = {
  name: 'Without Header',
  render: ({ content, footer, className }) => (
    <Card className={className}>
      <CardContent>{content}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  ),
  args: {
    content: 'Card without header.',
    footer: 'Footer',
    headerTitle: '',
    headerDescription: '',
  },
};

export const WithoutFooter: Story = {
  name: 'Without Footer',
  render: ({ headerTitle, headerDescription, content, className }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  ),
  args: {
    headerTitle: 'Header',
    headerDescription: 'No footer present.',
    content: 'Content area only.',
    footer: '',
  },
};

export const WithActions: Story = {
  name: 'With Actions',
  render: ({ headerTitle, headerDescription, content, className }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  ),
  args: {
    headerTitle: 'Action Card',
    headerDescription: 'Card footer contains action buttons.',
    content: 'Click confirm or cancel.',
    footer: '',
  },
};
