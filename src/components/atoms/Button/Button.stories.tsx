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
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
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

export const Secondary: Story = {
  args: {
    children: 'Subscribe',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Find Out More',
    variant: 'outline',
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8" style={{ '--service-color': '#00AEEF' } as React.CSSProperties}>
        <Story />
      </div>
    ),
  ],
};

export const OutlineAsLink: Story = {
  args: {
    children: 'Find Out More',
    variant: 'outline',
    href: '/services/research',
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8" style={{ '--service-color': '#FFA603' } as React.CSSProperties}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      <div>
        <p className="text-gray-400 text-sm mb-2">Primary (default)</p>
        <Button>Click Me</Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Primary (disabled)</p>
        <Button disabled>Disabled</Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Primary (link)</p>
        <Button href="/about">Internal Link</Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Primary (external link)</p>
        <Button href="https://example.com" target="_blank">
          External Link
        </Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Primary (disabled link)</p>
        <Button href="https://example.com" disabled>
          Disabled Link
        </Button>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Secondary (outlined magenta)</p>
        <Button variant="secondary">Subscribe</Button>
      </div>
      <div style={{ '--service-color': '#00AEEF' } as React.CSSProperties}>
        <p className="text-gray-400 text-sm mb-2">Outline (with --service-color: #00AEEF)</p>
        <Button variant="outline" className="text-[color:var(--service-color)] border-[var(--service-color)]">
          Find Out More
        </Button>
      </div>
      <div style={{ '--service-color': '#FF08CC' } as React.CSSProperties}>
        <p className="text-gray-400 text-sm mb-2">Outline (with --service-color: #FF08CC)</p>
        <Button variant="outline" className="text-[color:var(--service-color)] border-[var(--service-color)]">
          Find Out More
        </Button>
      </div>
    </div>
  ),
};
