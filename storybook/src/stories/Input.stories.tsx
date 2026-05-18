import type { Meta, StoryObj } from '@storybook/react';
import { Input, Label, Button } from '@perses-dev/components';
import { Search } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter value...' } };
export const WithValue: Story = { args: { defaultValue: 'prometheus-prod' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Read-only value' } };

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-64">
      <Label htmlFor="datasource-url">Datasource URL</Label>
      <Input id="datasource-url" placeholder="http://prometheus:9090" />
    </div>
  ),
};

export const SearchInput: Story = {
  render: () => (
    <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input className="pl-9" placeholder="Search panels..." />
    </div>
  ),
};

export const WithButton: Story = {
  render: () => (
    <div className="flex gap-2 w-80">
      <Input placeholder="PromQL expression" className="font-mono text-sm" />
      <Button size="sm">Run</Button>
    </div>
  ),
};

export const FormGroup: Story = {
  render: () => (
    <div className="space-y-4 w-72">
      <div className="space-y-2">
        <Label htmlFor="panel-name">Panel Name *</Label>
        <Input id="panel-name" placeholder="e.g. CPU Usage" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="panel-desc">Description</Label>
        <Input id="panel-desc" placeholder="Optional" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="repeat-var">Repeat by Variable</Label>
        <Input id="repeat-var" placeholder="Select variable..." />
      </div>
    </div>
  ),
};
