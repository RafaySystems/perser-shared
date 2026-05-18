import type { Meta, StoryObj } from '@storybook/react';
import { Toggle, ToggleGroup, ToggleGroupItem, Label } from '@perses-dev/components';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';

const meta: Meta = {
  title: 'Components/Toggle',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const SingleToggle: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  ),
};

export const AlignmentGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Legend Position</Label>
      <ToggleGroup type="single" defaultValue="left">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const SortModeGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Sort Order</Label>
      <ToggleGroup type="single" defaultValue="asc" className="flex gap-1">
        {['None', 'Asc', 'Desc'].map((mode) => (
          <ToggleGroupItem key={mode} value={mode.toLowerCase()} className="text-xs px-3">
            {mode}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  ),
};

export const StackModeGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Stack Mode</Label>
      <ToggleGroup type="single" defaultValue="none">
        {['none', '100%', 'value'].map((mode) => (
          <ToggleGroupItem key={mode} value={mode} className="text-xs px-3">
            {mode}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  ),
};
