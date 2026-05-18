import type { Meta, StoryObj } from '@storybook/react';
import { Slider, Label } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Slider',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const FillOpacity: Story = {
  render: () => (
    <div className="space-y-3 w-64">
      <div className="flex justify-between">
        <Label className="text-sm">Fill Opacity</Label>
        <span className="text-sm text-muted-foreground">20%</span>
      </div>
      <Slider defaultValue={[20]} min={0} max={100} step={5} />
    </div>
  ),
};

export const LineWidth: Story = {
  render: () => (
    <div className="space-y-3 w-64">
      <div className="flex justify-between">
        <Label className="text-sm">Line Width</Label>
        <span className="text-sm text-muted-foreground">2px</span>
      </div>
      <Slider defaultValue={[2]} min={1} max={10} step={1} />
    </div>
  ),
};

export const PointRadius: Story = {
  render: () => (
    <div className="space-y-3 w-64">
      <div className="flex justify-between">
        <Label className="text-sm">Point Radius</Label>
        <span className="text-sm text-muted-foreground">4px</span>
      </div>
      <Slider defaultValue={[4]} min={1} max={20} step={1} />
    </div>
  ),
};
