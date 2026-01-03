import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuShortcut,
} from './dropdown-menu';
import { Button } from './button';

const meta: Meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Playground: Story = {
  name: 'Playground',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel inset>Actions</DropdownMenuLabel>
        <DropdownMenuItem inset>Profile</DropdownMenuItem>
        <DropdownMenuItem inset>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>More Tools</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem inset>Duplicate</DropdownMenuItem>
              <DropdownMenuItem inset>Rename</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Show Bookmarks</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Show Full URLs</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel inset>People</DropdownMenuLabel>
        <DropdownMenuRadioGroup value="pedro">
          <DropdownMenuRadioItem value="pedro">Pedro Duarte</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="colm">Colm Tuite</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset disabled>
          Log out <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Basic: Story = {
  name: 'Basic Menu',
  render: Playground.render,
};

export const WithSubmenu: Story = {
  name: 'With Submenu',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem inset>Copy</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>Share</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem inset>Twitter</DropdownMenuItem>
              <DropdownMenuItem inset>Facebook</DropdownMenuItem>
              <DropdownMenuItem inset>LinkedIn</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const CheckboxGroup: Story = {
  name: 'Checkbox Group',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked>Show Icons</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Show Text</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const RadioGroupMenu: Story = {
  name: 'Radio Group',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Select Person</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value="alice">
          <DropdownMenuRadioItem value="alice">Alice</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bob">Bob</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="charlie">Charlie</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
