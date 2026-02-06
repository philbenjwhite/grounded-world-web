import type { Meta, StoryObj } from '@storybook/react';
import MediaSection from './MediaSection';
import type { MediaItem } from './MediaSection';

const categoryNames = ['Brand Activation', 'Sustainability Storytelling', 'Social Impact', 'Brand Purpose'];

const createItems = (count: number): MediaItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    title: `Media Item ${i + 1}`,
    category: categoryNames[i % categoryNames.length],
  }));

const meta = {
  title: 'Components/MediaSection',
  component: MediaSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    categories: { control: 'object' },
    onItemClick: { action: 'itemClicked' },
    onFilterChange: { action: 'filterChanged' },
  },
} satisfies Meta<typeof MediaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Tabs',
    categories: categoryNames,
    items: createItems(8),
  },
};

export const WithImages: Story = {
  args: {
    label: 'Tabs',
    categories: categoryNames,
    items: createItems(8).map((item, i) => ({
      ...item,
      imageUrl: `https://picsum.photos/seed/${i + 1}/800/600`,
      imageAlt: `Sample image ${i + 1}`,
    })),
  },
};

export const FilteredView: Story = {
  args: {
    label: 'Tabs',
    categories: categoryNames,
    items: createItems(8),
    defaultCategory: 'Brand Activation',
  },
};

export const FewItems: Story = {
  args: {
    label: 'Tabs',
    categories: categoryNames,
    items: createItems(3),
  },
};

export const EmptyState: Story = {
  args: {
    label: 'Tabs',
    categories: categoryNames,
    items: [],
  },
};
