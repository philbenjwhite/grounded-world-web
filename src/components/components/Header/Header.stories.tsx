import type { Meta, StoryObj } from '@storybook/react';
import type { Service } from '../../../../tina/__generated__/types';
import Header from './Header';

const mockServices = [
  { label: 'Research', serviceId: 'research', color: '#00AEEF', description: 'User needs & behavioral insights', url: '/services/research', icon: 'MagnifyingGlass', order: 0 },
  { label: 'Strategy', serviceId: 'strategy', color: '#FFA603', description: 'Planning & roadmapping', url: '/services/strategy', icon: 'Compass', order: 1 },
  { label: 'Activation', serviceId: 'activation', color: '#FF08CC', description: 'Campaigns & experiences', url: '/services/activation', icon: 'Lightning', order: 2 },
  { label: 'Impact', serviceId: 'impact', color: '#1CC35B', description: 'Analytics & optimization', url: '/services/impact', icon: 'ChartLineUp', order: 3 },
] as Service[];

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default header with all services and nav */
export const Default: Story = {
  args: {
    services: mockServices,
  },
};

/** No services data — still shows other nav links */
export const NoServices: Story = {
  args: {},
};
