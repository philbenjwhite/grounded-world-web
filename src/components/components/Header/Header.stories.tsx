import type { Meta, StoryObj } from '@storybook/react';
import type { Service } from '../../../../tina/__generated__/types';
import Header from './Header';

const mockServices = [
  { label: 'Discover', serviceId: 'discover', color: '#00AEEF', description: 'User needs & behavioral insights', url: '/services/discover', icon: 'MagnifyingGlass', order: 0 },
  { label: 'Articulate', serviceId: 'articulate', color: '#FFA603', description: 'Roadmaps & strategic frameworks', url: '/services/articulate', icon: 'Compass', order: 1 },
  { label: 'Activate', serviceId: 'activate', color: '#FF08CC', description: 'Design systems & interfaces', url: '/services/activate', icon: 'Lightning', order: 2 },
  { label: 'Accelerate', serviceId: 'accelerate', color: '#1CC35B', description: 'Analytics & optimization', url: '/services/accelerate', icon: 'ChartLineUp', order: 3 },
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
