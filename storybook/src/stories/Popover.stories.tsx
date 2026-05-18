import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Input,
  Label,
  Separator,
  Switch,
} from '@perses-dev/components';
import { Settings2 } from 'lucide-react';

const meta: Meta = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const FilterOptions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Display Options</h4>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Min Y-Axis</Label>
            <Input placeholder="auto" className="h-8 text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Max Y-Axis</Label>
            <Input placeholder="auto" className="h-8 text-sm" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Fill Opacity</Label>
            <Switch />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Reset</Button>
            <Button size="sm">Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const PanelInfo: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">Panel Info ℹ</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">HTTP Request Rate</h4>
          <p className="text-xs text-muted-foreground">
            Shows the per-second rate of HTTP requests over the selected time range, grouped by status code.
          </p>
          <Separator />
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Datasource</span>
              <span className="font-mono">prometheus-prod</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Refresh</span>
              <span>30s</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
