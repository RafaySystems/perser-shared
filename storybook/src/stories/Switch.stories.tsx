import type { Meta, StoryObj } from '@storybook/react';
import { Switch, Label, Separator } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Switch',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const PanelSettings: Story = {
  render: () => (
    <div className="space-y-4 w-72">
      <h3 className="font-medium text-sm">Display Settings</h3>
      <Separator />
      {[
        { id: 'show-legend', label: 'Show Legend', defaultChecked: true },
        { id: 'show-tooltip', label: 'Show Tooltip', defaultChecked: true },
        { id: 'show-points', label: 'Show Data Points', defaultChecked: false },
        { id: 'connect-nulls', label: 'Connect Null Values', defaultChecked: false },
        { id: 'fill-opacity', label: 'Fill Area Under Line', defaultChecked: false },
      ].map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
          <Switch id={item.id} defaultChecked={item.defaultChecked} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-switch" disabled defaultChecked />
      <Label htmlFor="disabled-switch" className="text-muted-foreground">Managed by config</Label>
    </div>
  ),
};
