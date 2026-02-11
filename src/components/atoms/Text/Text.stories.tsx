import type { Meta, StoryObj } from '@storybook/react';
import Text from './Text';

const meta = {
  title: 'Atoms/Text',
  component: Text,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['subtitle', 'body-xl', 'body-lg', 'body-md', 'body-sm', 'body-xs', 'caption'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'inverted', 'link'],
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'div'],
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
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is body text that can be used for paragraphs, descriptions, and other content throughout the site.',
    size: 'body-md',
  },
};

export const AllSizes: Story = {
  args: {
    children: 'Text',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <Text size="body-xs" color="tertiary">subtitle (responsive)</Text>
        <Text size="subtitle">Subtitle - Responsive hero companion text.</Text>
      </div>
      <div>
        <Text size="body-xs" color="tertiary">body-xl (20px)</Text>
        <Text size="body-xl">Body XL - Used for large introductory text and emphasis.</Text>
      </div>
      <div>
        <Text size="body-xs" color="tertiary">body-lg (18px)</Text>
        <Text size="body-lg">Body Large - Great for subheadings and important content.</Text>
      </div>
      <div>
        <Text size="body-xs" color="tertiary">body-md (16px)</Text>
        <Text size="body-md">Body Medium - The default size for most paragraph text.</Text>
      </div>
      <div>
        <Text size="body-xs" color="tertiary">body-sm (14px)</Text>
        <Text size="body-sm">Body Small - Used for secondary information and metadata.</Text>
      </div>
      <div>
        <Text size="body-xs" color="tertiary">body-xs (12px)</Text>
        <Text size="body-xs">Body Extra Small - For fine print and auxiliary text.</Text>
      </div>
      <div>
        <Text size="body-xs" color="tertiary">caption (16px)</Text>
        <Text size="caption">Caption - For image captions and annotations.</Text>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  args: {
    children: 'Text',
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Text color="primary">Primary - Main body text color (White)</Text>
      <Text color="secondary">Secondary - Supporting text (Gray-3)</Text>
      <Text color="tertiary">Tertiary - Muted text (Gray-4)</Text>
      <Text color="link">Link - Clickable text color (Azure-1)</Text>
      <div className="bg-white p-4 rounded">
        <Text color="inverted">Inverted - For light backgrounds (Black)</Text>
      </div>
    </div>
  ),
};

export const AsSpan: Story = {
  args: {
    children: 'Text',
  },
  render: () => (
    <Text as="p">
      This is a paragraph with <Text as="span" color="link">inline link text</Text> and{' '}
      <Text as="span" color="secondary">secondary inline text</Text> within it.
    </Text>
  ),
};

export const Subtitle: Story = {
  args: {
    children: 'Accelerating Impact',
    size: 'subtitle',
    color: 'secondary',
  },
};

export const BodyXL: Story = {
  args: {
    children: 'Extra large body text for introductions and emphasis.',
    size: 'body-xl',
  },
};

export const BodyLarge: Story = {
  args: {
    children: 'Large body text for subheadings and important content.',
    size: 'body-lg',
  },
};

export const BodyMedium: Story = {
  args: {
    children: 'Medium body text - the default for most paragraph content.',
    size: 'body-md',
  },
};

export const BodySmall: Story = {
  args: {
    children: 'Small body text for secondary information and metadata.',
    size: 'body-sm',
  },
};

export const BodyXS: Story = {
  args: {
    children: 'Extra small text for fine print and auxiliary content.',
    size: 'body-xs',
  },
};

export const Caption: Story = {
  args: {
    children: 'Caption text for images and annotations.',
    size: 'caption',
  },
};
