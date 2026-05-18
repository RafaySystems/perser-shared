import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Label,
} from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Select',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const TimeRange: Story = {
  render: () => (
    <div className="space-y-2 w-60">
      <Label>Time Range</Label>
      <Select defaultValue="1h">
        <SelectTrigger>
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Quick Ranges</SelectLabel>
            <SelectItem value="5m">Last 5 minutes</SelectItem>
            <SelectItem value="15m">Last 15 minutes</SelectItem>
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="6h">Last 6 hours</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Datasource: Story = {
  render: () => (
    <div className="space-y-2 w-72">
      <Label>Datasource</Label>
      <Select defaultValue="prometheus-prod">
        <SelectTrigger>
          <SelectValue placeholder="Select datasource" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Prometheus</SelectLabel>
            <SelectItem value="prometheus-prod">prometheus-prod</SelectItem>
            <SelectItem value="prometheus-staging">prometheus-staging</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Loki</SelectLabel>
            <SelectItem value="loki-prod">loki-prod</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2 w-60">
      <Label>Panel Type</Label>
      <Select disabled defaultValue="timeseries">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="timeseries">Time Series</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
