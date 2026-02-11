import type { Meta, StoryObj } from '@storybook/react';
import ServiceHeroNavSimple from './ServiceHeroNavSimple';
import type { Service } from '../../../../tina/__generated__/types';

const mockServices = [
  { label: 'Research', serviceId: 'research', color: '#00AEEF', description: 'User needs & behavioral insights', url: '/services/research', icon: 'MagnifyingGlass', order: 0 },
  { label: 'Strategy', serviceId: 'strategy', color: '#FFA603', description: 'Planning & roadmapping', url: '/services/strategy', icon: 'Compass', order: 1 },
  { label: 'Activation', serviceId: 'activation', color: '#FF08CC', description: 'Campaigns & experiences', url: '/services/activation', icon: 'Lightning', order: 2 },
  { label: 'Impact', serviceId: 'impact', color: '#1CC35B', description: 'Analytics & optimization', url: '/services/impact', icon: 'ChartLineUp', order: 3 },
] as Service[];

const meta: Meta<typeof ServiceHeroNavSimple> = {
  title: 'Components/ServiceHeroNavSimple',
  component: ServiceHeroNavSimple,
  args: {
    services: mockServices,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Simplified bento grid layout with L-shaped hero video, services globe, newsletter card, B Corp badge, awards marquee, and a primary CTA button.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServiceHeroNavSimple>;

export const Default: Story = {
  name: 'Default',
  parameters: {
    docs: {
      description: {
        story: 'The default simple layout with L-shaped hero, services panel, newsletter card, and awards marquee.',
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
        story: 'Simple variant on mobile — stacks into a single-column layout.',
      },
    },
  },
};