import type { Meta, StoryObj } from '@storybook/react';
import Heading from './Heading';

const meta = {
  title: 'Atoms/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
    },
    size: {
      control: 'select',
      options: ['display', 'h1', 'h2', 'h3', 'h4'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'inverted'],
    },
    children: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Heading Text',
    level: 2,
  },
};

export const AllSizes: Story = {
  args: {
    children: 'Heading',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level={1} size="display">Display - Responsive hero scale</Heading>
      <Heading level={1} size="h1">H1 Size - 80px</Heading>
      <Heading level={2} size="h2">H2 Size - 48px</Heading>
      <Heading level={3} size="h3">H3 Size - 32px</Heading>
      <Heading level={4} size="h4">H4 Size - 24px</Heading>
    </div>
  ),
};

export const SemanticVsVisual: Story = {
  args: {
    children: 'Heading',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="border-b border-gray-700 pb-4">
        <p className="text-gray-400 text-sm mb-2">Semantic h2, visual h1 size:</p>
        <Heading level={2} size="h1">Large but semantically H2</Heading>
      </div>
      <div className="border-b border-gray-700 pb-4">
        <p className="text-gray-400 text-sm mb-2">Semantic h3, visual h2 size:</p>
        <Heading level={3} size="h2">Medium but semantically H3</Heading>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-2">Semantic h1, visual h4 size:</p>
        <Heading level={1} size="h4">Small but semantically H1</Heading>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  args: {
    children: 'Heading',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level={2} color="primary">Primary Color (White)</Heading>
      <Heading level={2} color="secondary">Secondary Color (Gray-3)</Heading>
      <Heading level={2} color="tertiary">Tertiary Color (Gray-4)</Heading>
      <div className="bg-white p-4 rounded">
        <Heading level={2} color="inverted">Inverted Color (Black)</Heading>
      </div>
    </div>
  ),
};

export const Display: Story = {
  args: {
    children: 'Activating Purpose',
    level: 1,
    size: 'display',
  },
};

export const H1: Story = {
  args: {
    children: 'Heading Level 1',
    level: 1,
  },
};

export const H2: Story = {
  args: {
    children: 'Heading Level 2',
    level: 2,
  },
};

export const H3: Story = {
  args: {
    children: 'Heading Level 3',
    level: 3,
  },
};

export const H4: Story = {
  args: {
    children: 'Heading Level 4',
    level: 4,
  },
};
