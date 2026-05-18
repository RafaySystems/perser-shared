import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@perses-dev/components';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'gauge', variant: 'default' } };
export const Secondary: Story = { args: { children: 'counter', variant: 'secondary' } };
export const Destructive: Story = { args: { children: 'error', variant: 'destructive' } };
export const Outline: Story = { args: { children: 'histogram', variant: 'outline' } };

export const MetricTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">gauge</Badge>
      <Badge variant="secondary">counter</Badge>
      <Badge variant="outline">histogram</Badge>
      <Badge variant="destructive">unknown</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-green-500 hover:bg-green-600">active</Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-600">warning</Badge>
      <Badge className="bg-red-500 hover:bg-red-600">critical</Badge>
      <Badge variant="secondary">inactive</Badge>
    </div>
  ),
};
