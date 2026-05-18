import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, Card, CardContent, CardHeader, Spinner } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Loading States',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Spinners: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-4 w-4" />
        <p className="text-xs text-muted-foreground">Small</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-6 w-6" />
        <p className="text-xs text-muted-foreground">Default</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-10 w-10" />
        <p className="text-xs text-muted-foreground">Large</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-6 w-6 text-primary" />
        <p className="text-xs text-muted-foreground">Primary</p>
      </div>
    </div>
  ),
};

export const PanelSkeleton: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  ),
};

export const DashboardGridSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className={`w-full ${i % 3 === 0 ? 'h-32' : 'h-20'}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex gap-4 px-3 py-2 bg-muted rounded">
        {[120, 80, 60, 80, 60].map((w, i) => (
          <Skeleton key={i} className="h-4" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="flex gap-4 px-3 py-2">
          {[120, 80, 60, 80, 60].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
        </div>
      ))}
    </div>
  ),
};
