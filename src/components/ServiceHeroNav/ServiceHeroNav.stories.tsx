import type { Meta, StoryObj } from '@storybook/react';
import ServiceHeroNav from './ServiceHeroNav';

const meta: Meta<typeof ServiceHeroNav> = {
  title: 'Components/ServiceHeroNav',
  component: ServiceHeroNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An immersive hero navigation component with Three.js animated background, centered video, and orbiting navigation dots. Features responsive design, touch optimization, and smooth animations.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServiceHeroNav>;

export const Default: Story = {
  name: 'Default',
  parameters: {
    docs: {
      description: {
        story: 'The default ServiceHeroNav component with all animations, video, and interactive navigation elements. Hover over navigation dots to see themed Three.js patterns.',
      },
    },
  },
};

export const MobileView: Story = {
  name: 'Mobile View',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'ServiceHeroNav optimized for mobile devices with single-tap navigation, larger touch targets, and responsive header text.',
      },
    },
  },
};

export const TabletView: Story = {
  name: 'Tablet View',
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'ServiceHeroNav on tablet-sized screens, showing the transition between mobile and desktop layouts.',
      },
    },
  },
};