import type { Meta, StoryObj } from '@storybook/react';
import Carousel from './Carousel';
import type { CarouselItem } from './Carousel';

const createItems = (count: number): CarouselItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    title: `Slide ${i + 1}`,
  }));

const createItemsWithImages = (count: number): CarouselItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    title: `Slide ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/${i + 20}/800/450`,
    imageAlt: `Sample image ${i + 1}`,
  }));

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    loop: { control: 'boolean' },
    showArrows: { control: 'boolean' },
    showDots: { control: 'boolean' },
    onItemClick: { action: 'itemClicked' },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: createItems(6),
    loop: true,
    showArrows: true,
    showDots: true,
  },
};

export const WithImages: Story = {
  args: {
    items: createItemsWithImages(8),
    loop: true,
    showArrows: true,
    showDots: true,
  },
};

export const NoLoop: Story = {
  args: {
    items: createItemsWithImages(5),
    loop: false,
    showArrows: true,
    showDots: true,
  },
};

export const NoArrows: Story = {
  args: {
    items: createItemsWithImages(6),
    loop: true,
    showArrows: false,
    showDots: true,
  },
};

export const NoDots: Story = {
  args: {
    items: createItemsWithImages(6),
    loop: true,
    showArrows: true,
    showDots: false,
  },
};

export const Minimal: Story = {
  args: {
    items: createItemsWithImages(4),
    loop: true,
    showArrows: false,
    showDots: false,
  },
};

export const EmptyState: Story = {
  args: {
    items: [],
    loop: true,
    showArrows: true,
    showDots: true,
  },
};
