import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, Separator } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/ScrollArea',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const VariableList: Story = {
  render: () => (
    <ScrollArea className="h-64 w-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Variables (12)</h4>
        {Array.from({ length: 12 }, (_, i) => `variable_${i + 1}`).map((v, i) => (
          <div key={v}>
            <div className="flex items-center justify-between py-2">
              <span className="font-mono text-sm">${v}</span>
              <span className="text-xs text-muted-foreground">list</span>
            </div>
            {i < 11 && <Separator />}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const QueryLog: Story = {
  render: () => (
    <ScrollArea className="h-48 w-full rounded-md border bg-muted/30 p-4">
      <div className="space-y-1 font-mono text-xs">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="text-muted-foreground">
            <span className="text-green-500">[{new Date(Date.now() - i * 1000).toISOString()}]</span>{' '}
            query executed in {Math.floor(Math.random() * 200 + 5)}ms
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
