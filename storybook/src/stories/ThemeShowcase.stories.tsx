import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
} from '@perses-dev/components';
import { AlertCircle, CheckCircle2, Plus, Settings, Download, Edit } from 'lucide-react';

const meta: Meta = {
  title: 'Design System/Theme Showcase',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const ColorPalette: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Color Tokens</h2>
      <div className="grid grid-cols-4 gap-3">
        {[
          ['background', 'bg-background border'],
          ['foreground', 'bg-foreground'],
          ['primary', 'bg-primary'],
          ['primary-foreground', 'bg-primary-foreground border'],
          ['secondary', 'bg-secondary'],
          ['secondary-foreground', 'bg-secondary-foreground border'],
          ['muted', 'bg-muted'],
          ['muted-foreground', 'bg-muted-foreground'],
          ['accent', 'bg-accent'],
          ['destructive', 'bg-destructive'],
          ['border', 'bg-border'],
          ['card', 'bg-card border'],
        ].map(([name, cls]) => (
          <div key={name} className="space-y-1">
            <div className={`h-10 rounded-md ${cls}`} />
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold">Typography Scale</h2>
      <Separator />
      <div className="space-y-3">
        <div><p className="text-xs text-muted-foreground mb-1">h1 / text-2xl font-semibold</p><h1 className="text-2xl font-semibold">Dashboard Overview</h1></div>
        <div><p className="text-xs text-muted-foreground mb-1">h2 / text-xl font-semibold</p><h2 className="text-xl font-semibold">Panel Configuration</h2></div>
        <div><p className="text-xs text-muted-foreground mb-1">h3 / text-base font-semibold</p><h3 className="text-base font-semibold">Query Settings</h3></div>
        <div><p className="text-xs text-muted-foreground mb-1">body1 / text-sm</p><p className="text-sm">Default body text for descriptions and labels.</p></div>
        <div><p className="text-xs text-muted-foreground mb-1">body2 / text-xs</p><p className="text-xs">Smaller text for captions and metadata.</p></div>
        <div><p className="text-xs text-muted-foreground mb-1">muted</p><p className="text-sm text-muted-foreground">Muted text for secondary information.</p></div>
        <div><p className="text-xs text-muted-foreground mb-1">mono / font-mono</p><p className="font-mono text-sm">rate(http_requests_total[5m])</p></div>
      </div>
    </div>
  ),
};

export const DashboardLayout: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg">
        <h1 className="text-xl font-semibold">Production Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Request Rate', value: '1.2k/s', change: '+5%', ok: true },
          { label: 'Error Rate', value: '0.04%', change: '+0.01%', ok: false },
          { label: 'Latency p50', value: '12ms', change: '-2ms', ok: true },
          { label: 'Latency p99', value: '142ms', change: '+8ms', ok: false },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-1">
              <CardDescription className="text-xs">{s.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className={`text-xs mt-1 ${s.ok ? 'text-green-600' : 'text-red-500'}`}>{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Query Error</AlertTitle>
        <AlertDescription>Failed to load data for &quot;Error Rate&quot; panel. Retrying...</AlertDescription>
      </Alert>

      {/* Panel skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">HTTP Request Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  ),
};

export const FormComponents: Story = {
  render: () => (
    <div className="max-w-sm space-y-6">
      <h2 className="text-lg font-semibold">Form Controls</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Panel Name</Label>
          <Input placeholder="e.g. CPU Usage" />
        </div>
        <div className="space-y-2">
          <Label>Datasource</Label>
          <Select defaultValue="prometheus">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prometheus">prometheus-prod</SelectItem>
              <SelectItem value="loki">loki-prod</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label>Show Legend</Label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label>Stack Series</Label>
          <Switch />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  ),
};
