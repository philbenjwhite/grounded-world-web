import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    target: {
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top'],
      if: { arg: 'href' },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      if: { arg: 'href', truthy: false },
    },
    onClick: { action: 'clicked' },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const AsLink: Story = {
  args: {
    children: 'Link Button',
    href: 'https://example.com',
  },
};

export const ExternalLink: Story = {
  args: {
    children: 'External Link',
    href: 'https://example.com',
    target: '_blank',
  },
};

export const DisabledLink: Story = {
  args: {
    children: 'Disabled Link',
    href: 'https://example.com',
    disabled: true,
  },
};

export const SubmitButton: Story = {
  args: {
    children: 'Submit',
    type: 'submit',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <p className="text-gray-400 text-sm mb-2">Button (default)</p>
        <Button>Click Me</Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Button (disabled)</p>
        <Button disabled>Disabled</Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Link (internal)</p>
        <Button href="/about">Internal Link</Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Link (external, opens in new tab)</p>
        <Button href="https://example.com" target="_blank">
          External Link
        </Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Link (disabled)</p>
        <Button href="https://example.com" disabled>
          Disabled Link
        </Button>
      </div>
    </div>
  ),
};
