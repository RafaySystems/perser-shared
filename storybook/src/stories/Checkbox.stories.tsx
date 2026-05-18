import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, Label, Separator } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Checkbox',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const MultiSelect: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Select Columns to Display</Label>
      <Separator />
      {[
        { id: 'col-name', label: 'Name', checked: true },
        { id: 'col-value', label: 'Value', checked: true },
        { id: 'col-type', label: 'Type', checked: true },
        { id: 'col-labels', label: 'Labels', checked: false },
        { id: 'col-timestamp', label: 'Timestamp', checked: false },
      ].map((col) => (
        <div key={col.id} className="flex items-center space-x-2">
          <Checkbox id={col.id} defaultChecked={col.checked} />
          <Label htmlFor={col.id}>{col.label}</Label>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="enabled" defaultChecked disabled />
        <Label htmlFor="enabled" className="text-muted-foreground">Enabled (managed by config)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" className="text-muted-foreground">Disabled (managed by config)</Label>
      </div>
    </div>
  ),
};
