import type { Meta, StoryObj } from '@storybook/react';
import {
  MagnifyingGlassIcon,
  CompassIcon,
  LightningIcon,
  ChartLineUpIcon,
} from '@phosphor-icons/react';
import ServiceHeroNav from './ServiceHeroNav';
import type { ServiceItem } from './ServiceHeroNav';
import ServiceHeroNavConceptC from './ServiceHeroNavConceptC';
import ServiceHeroNavSimple from './ServiceHeroNavSimple';

const mockServiceItems: ServiceItem[] = [
  { id: 'research', label: 'Research', color: '#00AEEF', description: 'User needs & behavioral insights', url: '/services/research', icon: MagnifyingGlassIcon },
  { id: 'strategy', label: 'Strategy', color: '#FFA603', description: 'Planning & roadmapping', url: '/services/strategy', icon: CompassIcon },
  { id: 'activation', label: 'Activation', color: '#FF08CC', description: 'Campaigns & experiences', url: '/services/activation', icon: LightningIcon },
  { id: 'impact', label: 'Impact', color: '#1CC35B', description: 'Analytics & optimization', url: '/services/impact', icon: ChartLineUpIcon },
];

const meta: Meta<typeof ServiceHeroNav> = {
  title: 'Components/ServiceHeroNav',
  component: ServiceHeroNav,
  args: {
    serviceItems: mockServiceItems,
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