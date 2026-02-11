import type { Meta, StoryObj } from '@storybook/react';
import ServiceQuadrantNav from './ServiceQuadrantNav';

const meta: Meta<typeof ServiceQuadrantNav> = {
  title: 'Components/ServiceQuadrantNav',
  component: ServiceQuadrantNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Alternative hero design with quadrant layout. Dark, cinematic interface divided into four sections (Research, Strategy, Activation, Impact). Features mouse-tracking gradients, background image overlays, and smooth arrow animations on hover.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServiceQuadrantNav>;

export const Default: Story = {
  name: 'Default',
  parameters: {
    docs: {
      description: {
        story: 'The default quadrant layout with centered video, animated header text, and hover-responsive gradients.',
      },
    },
  },
};

export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Quadrant nav on mobile devices with responsive sizing and touch-friendly interactions.',
      },
    },
  },
};