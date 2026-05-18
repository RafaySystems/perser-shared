import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger, Card, CardContent, CardHeader, CardTitle, Input, Label, Button } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Tabs',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const PanelEditorTabs: Story = {
  render: () => (
    <Tabs defaultValue="query" className="w-[480px]">
      <TabsList className="w-full">
        <TabsTrigger value="query" className="flex-1">Query</TabsTrigger>
        <TabsTrigger value="visualization" className="flex-1">Visualization</TabsTrigger>
        <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="query">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Query Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>PromQL Expression</Label>
              <Input defaultValue="rate(http_requests_total[5m])" className="font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Legend</Label>
              <Input defaultValue="{{instance}}" placeholder="Auto" />
            </div>
            <Button size="sm">Run Query</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="visualization">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chart Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chart type, axis, and legend options.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Panel Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Panel Title</Label>
              <Input defaultValue="HTTP Request Rate" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Optional description..." />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const BasicTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <p className="text-sm text-muted-foreground">Overview content goes here.</p>
      </TabsContent>
      <TabsContent value="details" className="mt-4">
        <p className="text-sm text-muted-foreground">Detailed view with all fields.</p>
      </TabsContent>
      <TabsContent value="history" className="mt-4">
        <p className="text-sm text-muted-foreground">Change history timeline.</p>
      </TabsContent>
    </Tabs>
  ),
};
