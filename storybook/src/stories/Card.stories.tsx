import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Button, Badge } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Card',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Panel Title</CardTitle>
        <CardDescription>Time series data from the last 6 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Chart content would render here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Dashboard Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Panels</span>
          <span className="font-medium">12</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Variables</span>
          <span className="font-medium">5</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Datasources</span>
          <span className="font-medium">3</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Edit Dashboard</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatusCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Total Requests', value: '1.2M', trend: '+12%', status: 'success' },
        { label: 'Error Rate', value: '0.04%', trend: '+0.01%', status: 'warning' },
        { label: 'Latency p99', value: '142ms', trend: '-8ms', status: 'default' },
      ].map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardDescription>{item.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <Badge
              variant={item.status === 'success' ? 'default' : item.status === 'warning' ? 'destructive' : 'secondary'}
              className="mt-1 text-xs"
            >
              {item.trend}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
