import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Button } from '@perses-dev/components';
import { Info, HelpCircle } from 'lucide-react';

const meta: Meta = {
  title: 'Components/Tooltip',
  parameters: { layout: 'centered' },
  decorators: [(Story) => <TooltipProvider><Story /></TooltipProvider>],
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip content here</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const InfoIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">
          The step interval controls the resolution of the time series data. A smaller step produces more data points.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const ToolbarTooltips: Story = {
  render: () => (
    <div className="flex gap-1">
      {[
        { icon: '📊', label: 'Add Panel' },
        { icon: '📁', label: 'Add Group' },
        { icon: '⬇️', label: 'Download JSON' },
        { icon: '✏️', label: 'Edit Dashboard' },
      ].map((item) => (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span>{item.icon}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{item.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
