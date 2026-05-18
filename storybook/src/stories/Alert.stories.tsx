import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from '@perses-dev/components';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const meta: Meta = {
  title: 'Components/Alert',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Dashboard is in read-only mode. Changes cannot be saved.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load datasource. Check the connection settings.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithoutTitle: Story = {
  render: () => (
    <Alert className="max-w-lg">
      <CheckCircle2 className="h-4 w-4" />
      <AlertDescription>Dashboard saved successfully.</AlertDescription>
    </Alert>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Query Error</AlertTitle>
      <AlertDescription className="font-mono text-xs mt-1">
        parse error at char 15: unexpected &quot;{`}`}&quot; in metricName
      </AlertDescription>
    </Alert>
  ),
};
