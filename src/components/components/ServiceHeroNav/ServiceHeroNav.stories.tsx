import type { Meta, StoryObj } from '@storybook/react';
import ServiceHeroNav from './ServiceHeroNav';
import ServiceHeroNavConceptC from './ServiceHeroNavConceptC';
import ServiceHeroNavSimple from './ServiceHeroNavSimple';
import type { Service } from '../../../../tina/__generated__/types';

const mockServices = [
  { label: 'Research', serviceId: 'research', color: '#00AEEF', description: 'User needs & behavioral insights', url: '/services/research', icon: 'MagnifyingGlass', order: 0 },
  { label: 'Strategy', serviceId: 'strategy', color: '#FFA603', description: 'Planning & roadmapping', url: '/services/strategy', icon: 'Compass', order: 1 },
  { label: 'Activation', serviceId: 'activation', color: '#FF08CC', description: 'Campaigns & experiences', url: '/services/activation', icon: 'Lightning', order: 2 },
  { label: 'Impact', serviceId: 'impact', color: '#1CC35B', description: 'Analytics & optimization', url: '/services/impact', icon: 'ChartLineUp', order: 3 },
] as Service[];

const meta: Meta<typeof ServiceHeroNav> = {
  title: 'Components/ServiceHeroNav',
  component: ServiceHeroNav,
  args: {
    services: mockServices,
  },
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

// ConceptC Stories
type ConceptCStory = StoryObj<typeof ServiceHeroNavConceptC>;

export const ConceptC: ConceptCStory = {
  name: 'Concept C - Quadrant Layout',
  args: {},
  render: () => <ServiceHeroNavConceptC />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Alternative hero design with diagonal quadrant layout. Dark, cinematic interface divided into four triangular sections (Research, Strategy, Activation, Impact). Features mouse-tracking gradients, background image overlays, and smooth arrow animations on hover.',
      },
    },
  },
};

export const ConceptCMobile: ConceptCStory = {
  name: 'Concept C - Mobile',
  args: {},
  render: () => <ServiceHeroNavConceptC />,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Concept C optimized for mobile devices, maintaining the quadrant layout with touch-friendly interactions.',
      },
    },
  },
};

// Simple variant stories
type SimpleStory = StoryObj<typeof ServiceHeroNavSimple>;

export const Simple: SimpleStory = {
  name: 'Simple',
  args: {},
  render: () => <ServiceHeroNavSimple />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Simplified bento grid layout with hero video, services, newsletter, B Corp badge, awards marquee, and a primary CTA button.',
      },
    },
  },
};

export const SimpleMobile: SimpleStory = {
  name: 'Simple - Mobile',
  args: {},
  render: () => <ServiceHeroNavSimple />,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Simple variant on mobile — stacks into a single-column layout.',
      },
    },
  },
};