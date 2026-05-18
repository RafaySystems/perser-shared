import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem, Label } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/RadioGroup',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const PanelType: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Panel Type</Label>
      <RadioGroup defaultValue="time-series">
        {[
          { value: 'time-series', label: 'Time Series', desc: 'Line, bar, or area chart over time' },
          { value: 'stat', label: 'Stat', desc: 'Single value with optional sparkline' },
          { value: 'gauge', label: 'Gauge', desc: 'Radial gauge with threshold colors' },
          { value: 'table', label: 'Table', desc: 'Tabular data with sorting and filtering' },
        ].map((item) => (
          <div key={item.value} className="flex items-start space-x-3">
            <RadioGroupItem value={item.value} id={`type-${item.value}`} className="mt-0.5" />
            <label htmlFor={`type-${item.value}`} className="cursor-pointer">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};

export const LegendPlacement: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Legend Placement</Label>
      <RadioGroup defaultValue="bottom" className="flex gap-6">
        {['Bottom', 'Right', 'Hidden'].map((pos) => (
          <div key={pos} className="flex items-center space-x-2">
            <RadioGroupItem value={pos.toLowerCase()} id={`pos-${pos}`} />
            <Label htmlFor={`pos-${pos}`}>{pos}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};
