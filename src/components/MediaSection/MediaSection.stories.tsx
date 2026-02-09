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
    variant: {
      control: 'radio',
      options: ['grid', 'carousel'],
    },
    title: { control: 'text' },
    label: { control: 'text' },
    categories: { control: 'object' },
    onItemClick: { action: 'itemClicked' },
    onFilterChange: { action: 'filterChanged' },
  },
} satisfies Meta<typeof MediaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// GRID VARIANT STORIES (Concept A)
// =============================================================================

export const Grid: Story = {
  args: {
    variant: 'grid',
    title: 'Section title',
    categories: categoryNames,
    items: createItems(6),
  },
};

export const GridWithImages: Story = {
  args: {
    variant: 'grid',
    title: 'Our Work',
    categories: categoryNames,
    items: createItems(6).map((item, i) => ({
      ...item,
      imageUrl: `https://picsum.photos/seed/${i + 1}/800/600`,
      imageAlt: `Sample image ${i + 1}`,
    })),
  },
};

export const GridTwelveTiles: Story = {
  args: {
    variant: 'grid',
    title: 'Extended Gallery',
    categories: categoryNames,
    items: createItems(12),
  },
};

// =============================================================================
// CAROUSEL VARIANT STORIES (Concept B)
// =============================================================================

export const Carousel: Story = {
  args: {
    variant: 'carousel',
    label: 'Tabs',
    categories: categoryNames,
    items: createItems(8),
  },
};

export const CarouselWithImages: Story = {
  args: {
    variant: 'carousel',
    label: 'Tabs',
    categories: categoryNames,
    items: createItems(8).map((item, i) => ({
      ...item,
      imageUrl: `https://picsum.photos/seed/${i + 10}/800/600`,
      imageAlt: `Sample image ${i + 1}`,
    })),
  },
};

export const CarouselFiltered: Story = {
  args: {
    variant: 'carousel',
    label: 'Tabs',
    categories: categoryNames,
    items: createItems(8),
    defaultCategory: 'Brand Activation',
  },
};

// =============================================================================
// SHARED STORIES
// =============================================================================

export const EmptyState: Story = {
  args: {
    variant: 'grid',
    title: 'No Results',
    categories: categoryNames,
    items: [],
  },
};
