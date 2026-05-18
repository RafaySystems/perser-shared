import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Slider,
  ColorPicker,
  ToolbarIconButton,
  InfoTooltip,
  PaginationBar,
} from '@perses-dev/components';
import type { ChartConfig } from '@perses-dev/components';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Gauge,
  GripVertical,
  HelpCircle,
  Info,
  LayoutDashboard,
  Maximize2,
  MoreHorizontal,
  Pencil,
  Pin,
  Play,
  Plus,
  PlusSquare,
  RefreshCw,
  Search,
  Server,
  Settings,
  Share2,
  Star,
  TrendingDown,
  TrendingUp,
  Trash2,
  X,
  Zap,
} from 'lucide-react';

const meta: Meta = {
  title: 'Examples/Example Dashboard',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

// ─── Time labels (last hour, every 5 min) ────────────────────────────────────

const TIME_LABELS = Array.from({ length: 13 }, (_, i) => {
  const min = i * 5;
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
});

// ─── Shared chart configs — use CSS variables so dark mode works ─────────────

const RPS_CONFIG: ChartConfig = {
  'api-server':   { label: 'api-server',   color: 'var(--chart-1)' },
  'auth-service': { label: 'auth-service', color: 'var(--chart-2)' },
  'cache-layer':  { label: 'cache-layer',  color: 'var(--chart-3)' },
} satisfies ChartConfig;

const ERR_CONFIG: ChartConfig = {
  'api-server':    { label: 'api-server',    color: 'var(--chart-1)' },
  'data-pipeline': { label: 'data-pipeline', color: 'var(--chart-4)' },
  'notifier':      { label: 'notifier',      color: 'var(--chart-5)' },
  threshold:       { label: 'Threshold',     color: 'hsl(45 93% 47%)' },
} satisfies ChartConfig;

const LAT_CONFIG: ChartConfig = {
  'api-server':    { label: 'api-server p99',    color: 'var(--chart-1)' },
  'auth-service':  { label: 'auth-service p99',  color: 'var(--chart-2)' },
  'data-pipeline': { label: 'data-pipeline p99', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const TRAFFIC_CONFIG: ChartConfig = {
  rps: { label: 'Requests/s', color: 'var(--chart-1)' },
} satisfies ChartConfig;

// ─── Chart data ───────────────────────────────────────────────────────────────

const RPS_DATA = TIME_LABELS.map((t, i) => ({
  time: t,
  'api-server':   Math.round(450 + Math.sin(i * 0.5) * 25 + i * 2),
  'auth-service': Math.round(200 + Math.sin(i * 0.6) * 12 + i),
  'cache-layer':  Math.round(1150 + Math.sin(i * 0.4) * 60 + i * 5),
}));

const ERR_DATA = TIME_LABELS.map((t, i) => ({
  time: t,
  'api-server':    parseFloat((0.01 + Math.random() * 0.005).toFixed(3)),
  'data-pipeline': parseFloat((0.09 + i * 0.003).toFixed(3)),
  'notifier':      parseFloat((0.8 + i * 0.05).toFixed(2)),
  threshold:       0.5,
}));

const LAT_DATA = TIME_LABELS.map((t, i) => ({
  time: t,
  'api-server':    Math.round(90 + Math.sin(i * 0.3) * 8),
  'auth-service':  Math.round(40 + Math.sin(i * 0.4) * 4),
  'data-pipeline': Math.round(285 + i * 2 + Math.sin(i * 0.2) * 10),
}));

const TRAFFIC_DATA = [
  { service: 'cache',     rps: 1240 },
  { service: 'api',       rps: 482 },
  { service: 'auth',      rps: 215 },
  { service: 'pipeline',  rps: 97 },
  { service: 'notifier',  rps: 12 },
  { service: 'scheduler', rps: 4 },
];

const RESOURCE_RADIAL = [
  { name: 'CPU',     value: 62,  fill: '#f97316' },
  { name: 'Memory',  value: 45,  fill: '#3b82f6' },
  { name: 'Disk',    value: 28,  fill: '#22c55e' },
  { name: 'Network', value: 71,  fill: '#a855f7' },
];

// ─── Stat cards ───────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { label: 'Request Rate', value: '1.24k/s', delta: '+5.2%', up: true,  color: 'text-green-500' },
  { label: 'Error Rate',   value: '0.04%',   delta: '+0.01%', up: false, color: 'text-red-500' },
  { label: 'Latency p50',  value: '12ms',    delta: '-2ms',   up: true,  color: 'text-green-500' },
  { label: 'Latency p99',  value: '142ms',   delta: '+8ms',   up: false, color: 'text-yellow-500' },
  { label: 'Active Pods',  value: '48',      delta: '+3',     up: true,  color: 'text-green-500' },
  { label: 'CPU Usage',    value: '62%',     delta: '+4%',    up: false, color: 'text-yellow-500' },
];

const SERIES_ROWS = [
  { name: 'api-server',    env: 'prod',    region: 'us-east-1', rps: '482',  p99: '98ms',  errors: '0.01%', status: 'ok' },
  { name: 'auth-service',  env: 'prod',    region: 'us-east-1', rps: '215',  p99: '44ms',  errors: '0.00%', status: 'ok' },
  { name: 'data-pipeline', env: 'prod',    region: 'us-west-2', rps: '97',   p99: '312ms', errors: '0.12%', status: 'warn' },
  { name: 'cache-layer',   env: 'prod',    region: 'eu-west-1', rps: '1240', p99: '8ms',   errors: '0.00%', status: 'ok' },
  { name: 'notifier',      env: 'staging', region: 'us-east-1', rps: '12',   p99: '200ms', errors: '1.40%', status: 'error' },
  { name: 'scheduler',     env: 'staging', region: 'us-west-2', rps: '4',    p99: '540ms', errors: '0.80%', status: 'warn' },
];

const SERVICES = ['All Services', 'api-server', 'auth-service', 'data-pipeline', 'cache-layer'];
const ENVS     = ['All Envs', 'prod', 'staging', 'dev'];
const RANGES   = ['Last 5m', 'Last 15m', 'Last 1h', 'Last 6h', 'Last 24h', 'Last 7d'];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const color = status === 'ok' ? 'bg-green-500' : status === 'warn' ? 'bg-yellow-500' : 'bg-red-500';
  return <span className={`inline-block h-2 w-2 rounded-full ${color} mr-2 shrink-0`} />;
}

function SparklineMock({ up }: { up: boolean }) {
  const pts = up
    ? [30, 28, 32, 26, 35, 29, 38, 34, 40, 36, 44]
    : [40, 38, 42, 36, 44, 38, 35, 32, 30, 28, 26];
  const max = Math.max(...pts), min = Math.min(...pts);
  const norm = (v: number) => 32 - ((v - min) / (max - min)) * 28;
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * 10} ${norm(v)}`).join(' ');
  return (
    <svg width="100" height="34" viewBox="0 0 100 34" className="opacity-60">
      <path d={d} fill="none" stroke={up ? '#22c55e' : '#ef4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VariableChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <Select defaultValue={value}>
        <SelectTrigger className="h-[30px] text-xs border-dashed min-w-[90px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(label === 'Service' ? SERVICES : ENVS).map((s) => (
            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Per-service drilldown data
function getServiceDetail(name: string) {
  const row = SERIES_ROWS.find((r) => r.name === name) ?? SERIES_ROWS[0]!;
  const rpsBase = parseInt(row.rps, 10);
  const latBase = parseInt(row.p99, 10);
  const errBase = parseFloat(row.errors);
  return {
    row,
    trend: TIME_LABELS.map((t, i) => ({
      time: t,
      rps:     Math.round(rpsBase + Math.sin(i * 0.5) * rpsBase * 0.08),
      p99:     Math.round(latBase + Math.sin(i * 0.3) * latBase * 0.07),
      errors:  parseFloat((errBase + Math.sin(i * 0.4) * errBase * 0.1).toFixed(3)),
    })),
  };
}

// ─── Main Dashboard Story ────────────────────────────────────────────────────

export const FullDashboard: Story = {
  name: 'Full Dashboard',
  render: function DashboardStory() {
    const [editMode, setEditMode] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState('30s');
    const [timeRange, setTimeRange] = useState('Last 1h');
    const [panelSettingsOpen, setPanelSettingsOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [thresholdColor, setThresholdColor] = useState('#ef4444');
    const [searchOpen, setSearchOpen] = useState(false);
    const [drilldownService, setDrilldownService] = useState<string | null>(null);
    const [tablePage, setTablePage] = useState(1);
    const TABLE_PAGE_SIZE = 3;
    const tablePagedRows = SERIES_ROWS.slice((tablePage - 1) * TABLE_PAGE_SIZE, tablePage * TABLE_PAGE_SIZE);
    const tableTotalPages = Math.ceil(SERIES_ROWS.length / TABLE_PAGE_SIZE);

    const drilldown = drilldownService ? getServiceDetail(drilldownService) : null;
    const drilldownConfig: ChartConfig = {
      rps:    { label: 'RPS',      color: 'var(--chart-1)' },
      p99:    { label: 'P99 (ms)', color: 'var(--chart-4)' },
      errors: { label: 'Errors %', color: 'var(--chart-5)' },
    } satisfies ChartConfig;

    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">

          {/* ── Top navbar ── */}
          <header className="flex items-center gap-2 px-4 py-2 border-b bg-card shrink-0">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="text-base font-semibold mr-2">Production · Overview</h1>
            <Badge variant="outline" className="text-xs">v2.4.1</Badge>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <VariableChip label="Service" value="All Services" />
            <VariableChip label="Env"     value="All Envs" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPinned(!pinned)}>
                  <Pin className={`h-3.5 w-3.5 ${pinned ? 'text-primary' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{pinned ? 'Unpin variable bar' : 'Pin variable bar'}</TooltipContent>
            </Tooltip>

            <div className="ml-auto flex items-center gap-1">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 text-xs text-muted-foreground w-40 justify-start">
                    <Search className="h-3.5 w-3.5" />
                    Search panels…
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-64" align="end">
                  <Command>
                    <CommandInput placeholder="Search panels…" />
                    <CommandList>
                      <CommandEmpty>No panels found.</CommandEmpty>
                      <CommandGroup heading="Panels">
                        {['HTTP Request Rate', 'Error Rate', 'Latency Trend', 'Traffic Split', 'Resource Radial'].map((p) => (
                          <CommandItem key={p} onSelect={() => setSearchOpen(false)}>
                            <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                            {p}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RANGES.map((r) => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                <SelectTrigger className="h-8 text-xs w-20">
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Off', '5s', '15s', '30s', '1m', '5m'].map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-5 mx-1" />

              <InfoTooltip description="Share dashboard">
                <ToolbarIconButton aria-label="Share"><Share2 className="h-4 w-4" /></ToolbarIconButton>
              </InfoTooltip>
              <InfoTooltip description="Download JSON">
                <ToolbarIconButton aria-label="Download"><Download className="h-4 w-4" /></ToolbarIconButton>
              </InfoTooltip>
              <InfoTooltip description="View / Edit JSON">
                <ToolbarIconButton aria-label="Edit JSON"><Code2 className="h-4 w-4" /></ToolbarIconButton>
              </InfoTooltip>

              <Button
                variant={editMode ? 'default' : 'outline'}
                size="sm"
                className="gap-1"
                onClick={() => setEditMode(!editMode)}
              >
                <Pencil className="h-3.5 w-3.5" />
                {editMode ? 'Exit Edit' : 'Edit'}
              </Button>
            </div>
          </header>

          {/* ── Alert Banner ── */}
          <Alert variant="destructive" className="rounded-none border-x-0 border-t-0 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm">Elevated error rate on notifier service</AlertTitle>
            <AlertDescription className="text-xs">
              Error rate has exceeded 1% for the last 8 minutes. Check the Alerts tab for details.
            </AlertDescription>
          </Alert>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* ── Stat cards ── */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                {STAT_CARDS.map((s) => (
                  <Card key={s.label} className="relative group">
                    {editMode && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                    <CardHeader className="pb-1 pt-3 px-3">
                      <CardDescription className="text-xs">{s.label}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                      <p className="text-xl font-bold leading-tight">{s.value}</p>
                      <div className={`flex items-center gap-0.5 text-xs mt-0.5 ${s.color}`}>
                        {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {s.delta}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* ── Main tabs ── */}
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="alerts">
                    Alerts
                    <Badge variant="destructive" className="ml-1.5 h-4 px-1 text-[10px]">2</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="settings">Panel Settings</TabsTrigger>
                </TabsList>

                {/* ── Overview tab: real charts ── */}
                <TabsContent value="overview" className="space-y-4 mt-3">

                  {/* Row 1: Line charts */}
                  <div className="grid grid-cols-2 gap-4">

                    {/* HTTP Request Rate – area chart */}
                    <Card>
                      <CardHeader className="pb-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">HTTP Request Rate</CardTitle>
                          <div className="flex items-center gap-1">
                            {editMode && <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />}
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Maximize2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription className="text-[11px]">rate(http_requests_total[5m])</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ChartContainer config={RPS_CONFIG} className="h-[200px] w-full">
                          <AreaChart data={RPS_DATA} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                            <YAxis tick={{ fontSize: 10 }} width={40} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Area type="monotone" dataKey="api-server"   stroke="var(--color-api-server)"   fill="var(--color-api-server)"   fillOpacity={0.1} strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="auth-service" stroke="var(--color-auth-service)" fill="var(--color-auth-service)" fillOpacity={0.1} strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="cache-layer"  stroke="var(--color-cache-layer)"  fill="var(--color-cache-layer)"  fillOpacity={0.1} strokeWidth={2} dot={false} />
                          </AreaChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    {/* Error Rate – line chart with threshold */}
                    <Card>
                      <CardHeader className="pb-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Error Rate</CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Threshold exceeded on notifier</TooltipContent>
                          </Tooltip>
                        </div>
                        <CardDescription className="text-[11px]">errors / total · threshold 0.5%</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ChartContainer config={ERR_CONFIG} className="h-[200px] w-full">
                          <LineChart data={ERR_DATA} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                            <YAxis tick={{ fontSize: 10 }} width={40} tickFormatter={(v: number) => `${v}%`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line type="monotone" dataKey="api-server"    stroke="var(--color-api-server)"    strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="data-pipeline" stroke="var(--color-data-pipeline)" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="notifier"      stroke="var(--color-notifier)"      strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="threshold"     stroke="var(--color-threshold)"     strokeWidth={1} strokeDasharray="4 4" dot={false} />
                          </LineChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Row 2: Latency + Traffic + Resources */}
                  <div className="grid grid-cols-3 gap-4">

                    {/* Latency p99 – area chart */}
                    <Card className="col-span-2">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm">Latency P99</CardTitle>
                        <CardDescription className="text-[11px]">request_duration_seconds · p99</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ChartContainer config={LAT_CONFIG} className="h-[200px] w-full">
                          <AreaChart data={LAT_DATA} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                            <YAxis tick={{ fontSize: 10 }} width={44} tickFormatter={(v: number) => `${v}ms`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Area type="monotone" dataKey="api-server"    stroke="var(--color-api-server)"    fill="var(--color-api-server)"    fillOpacity={0.08} strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="auth-service"  stroke="var(--color-auth-service)"  fill="var(--color-auth-service)"  fillOpacity={0.08} strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="data-pipeline" stroke="var(--color-data-pipeline)" fill="var(--color-data-pipeline)" fillOpacity={0.08} strokeWidth={2} dot={false} />
                          </AreaChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    {/* Resource Usage – radial bar chart */}
                    <Card>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm">Resource Usage</CardTitle>
                        <CardDescription className="text-[11px]">CPU · Memory · Disk · Network</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ChartContainer config={{
                          CPU:     { label: 'CPU',     color: '#f97316' },
                          Memory:  { label: 'Memory',  color: '#3b82f6' },
                          Disk:    { label: 'Disk',    color: '#22c55e' },
                          Network: { label: 'Network', color: '#a855f7' },
                        }} className="h-[200px] w-full">
                          <RadialBarChart
                            data={RESOURCE_RADIAL}
                            innerRadius={30}
                            outerRadius={90}
                            barSize={14}
                          >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar
                              background
                              dataKey="value"
                              angleAxisId={0}
                              label={{ position: 'insideStart', fill: '#fff', fontSize: 9 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </RadialBarChart>
                        </ChartContainer>
                        <div className="flex flex-wrap gap-2 px-2 pb-1">
                          {RESOURCE_RADIAL.map((r) => (
                            <div key={r.name} className="flex items-center gap-1 text-xs">
                              <span className="h-2 w-2 rounded-full inline-block shrink-0" style={{ background: r.fill }} />
                              {r.name} <span className="text-muted-foreground">{r.value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Row 3: Traffic split bar */}
                  <Card>
                    <CardHeader className="pb-1">
                      <CardTitle className="text-sm">Traffic Distribution by Service</CardTitle>
                      <CardDescription className="text-[11px]">Current RPS across all services</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ChartContainer config={TRAFFIC_CONFIG} className="h-[160px] w-full">
                        <BarChart data={TRAFFIC_DATA} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                          <XAxis dataKey="service" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} width={44} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="rps" fill="var(--color-rps)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── Services tab: table + drilldown ── */}
                <TabsContent value="services" className="mt-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Service Summary</CardTitle>
                        <div className="flex items-center gap-2">
                          <Input placeholder="Filter…" className="h-7 text-xs w-36" />
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <Filter className="h-3 w-3" />
                            Filter
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="text-xs">Click a row to drill down into service metrics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-8">
                              <Checkbox
                                checked={Object.keys(selectedRows).length === SERIES_ROWS.length}
                                onCheckedChange={(v: boolean | 'indeterminate') =>
                                  setSelectedRows(v ? Object.fromEntries(SERIES_ROWS.map((r) => [r.name, true])) : {})
                                }
                              />
                            </TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Env</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead className="text-right">RPS</TableHead>
                            <TableHead className="text-right">P99</TableHead>
                            <TableHead className="text-right">Errors</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tablePagedRows.map((row) => (
                            <TableRow
                              key={row.name}
                              data-selected={!!selectedRows[row.name]}
                              className="cursor-pointer hover:bg-accent/50"
                              onClick={() => setDrilldownService(row.name)}
                            >
                              <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <Checkbox
                                  checked={!!selectedRows[row.name]}
                                  onCheckedChange={(v: boolean | 'indeterminate') =>
                                    setSelectedRows((prev) => ({ ...prev, [row.name]: !!v }))
                                  }
                                />
                              </TableCell>
                              <TableCell className="font-mono text-xs font-medium">{row.name}</TableCell>
                              <TableCell>
                                <Badge variant={row.env === 'prod' ? 'default' : 'secondary'} className="text-[10px]">
                                  {row.env}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{row.region}</TableCell>
                              <TableCell className="text-right font-mono text-xs">{row.rps}</TableCell>
                              <TableCell className="text-right font-mono text-xs">{row.p99}</TableCell>
                              <TableCell className={`text-right font-mono text-xs ${row.status === 'error' ? 'text-red-500' : row.status === 'warn' ? 'text-yellow-500' : ''}`}>
                                {row.errors}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <StatusDot status={row.status} />
                                  <span className="text-xs capitalize">{row.status}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    {tableTotalPages > 1 && (
                      <div className="border-t py-2 px-4">
                        <PaginationBar page={tablePage} totalPages={tableTotalPages} onPageChange={setTablePage} />
                      </div>
                    )}
                  </Card>

                  {/* Drilldown Sheet */}
                  <Sheet open={drilldownService !== null} onOpenChange={(open: boolean) => !open && setDrilldownService(null)}>
                    <SheetContent className="w-[560px] sm:max-w-[560px] overflow-y-auto">
                      {drilldown && (
                        <>
                          <SheetHeader>
                            <SheetTitle className="flex items-center gap-2 text-base">
                              <StatusDot status={drilldown.row.status} />
                              {drilldown.row.name}
                              <Badge variant={drilldown.row.env === 'prod' ? 'default' : 'secondary'} className="text-xs ml-1">
                                {drilldown.row.env}
                              </Badge>
                            </SheetTitle>
                            <SheetDescription className="text-xs">
                              {drilldown.row.region} · detailed metrics for the selected time range
                            </SheetDescription>
                          </SheetHeader>

                          {/* Key stats */}
                          <div className="mt-4 grid grid-cols-3 gap-3">
                            {[
                              { label: 'Requests/s', value: drilldown.row.rps, color: 'text-blue-500' },
                              { label: 'Latency P99', value: drilldown.row.p99, color: 'text-orange-500' },
                              { label: 'Error Rate', value: drilldown.row.errors, color: drilldown.row.status === 'error' ? 'text-red-500' : drilldown.row.status === 'warn' ? 'text-yellow-500' : 'text-green-500' },
                            ].map((s) => (
                              <Card key={s.label}>
                                <CardContent className="pt-3 pb-3 px-3">
                                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {/* RPS trend */}
                          <div className="mt-4">
                            <p className="text-xs font-semibold mb-2">Request Rate</p>
                            <ChartContainer config={drilldownConfig} className="h-[160px] w-full">
                              <AreaChart data={drilldown.trend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                                <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                                <YAxis tick={{ fontSize: 10 }} width={40} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area type="monotone" dataKey="rps" stroke="var(--color-rps)" fill="var(--color-rps)" fillOpacity={0.15} strokeWidth={2} dot={false} />
                              </AreaChart>
                            </ChartContainer>
                          </div>

                          {/* Latency trend */}
                          <div className="mt-4">
                            <p className="text-xs font-semibold mb-2">Latency P99</p>
                            <ChartContainer config={drilldownConfig} className="h-[140px] w-full">
                              <LineChart data={drilldown.trend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                                <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                                <YAxis tick={{ fontSize: 10 }} width={44} tickFormatter={(v: number) => `${v}ms`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="p99" stroke="var(--color-p99)" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ChartContainer>
                          </div>

                          {/* Error rate trend */}
                          <div className="mt-4">
                            <p className="text-xs font-semibold mb-2">Error Rate</p>
                            <ChartContainer config={drilldownConfig} className="h-[120px] w-full">
                              <AreaChart data={drilldown.trend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                                <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                                <YAxis tick={{ fontSize: 10 }} width={40} tickFormatter={(v: number) => `${v}%`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area type="monotone" dataKey="errors" stroke="var(--color-errors)" fill="var(--color-errors)" fillOpacity={0.15} strokeWidth={2} dot={false} />
                              </AreaChart>
                            </ChartContainer>
                          </div>

                          <div className="mt-4 pt-4 border-t flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Open in Explore
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                              <Download className="h-3.5 w-3.5" />
                              Export CSV
                            </Button>
                          </div>
                        </>
                      )}
                    </SheetContent>
                  </Sheet>
                </TabsContent>

                {/* ── Alerts tab ── */}
                <TabsContent value="alerts" className="space-y-3 mt-3">
                  {[
                    { severity: 'critical', name: 'HighErrorRate',  service: 'notifier',      message: 'Error rate 1.40% > threshold 0.5% for 8m',    since: '8m ago' },
                    { severity: 'warning',  name: 'HighLatency',    service: 'data-pipeline', message: 'P99 latency 312ms > threshold 250ms for 15m',  since: '15m ago' },
                  ].map((a) => (
                    <Alert key={a.name} variant={a.severity === 'critical' ? 'destructive' : 'default'}>
                      {a.severity === 'critical' ? <AlertCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      <AlertTitle className="flex items-center gap-2">
                        {a.name}
                        <Badge variant={a.severity === 'critical' ? 'destructive' : 'outline'} className="text-[10px]">
                          {a.severity}
                        </Badge>
                        <span className="ml-auto text-xs font-normal text-muted-foreground">{a.since}</span>
                      </AlertTitle>
                      <AlertDescription className="text-xs">
                        <span className="font-medium">{a.service}</span> — {a.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>All other checks passing</AlertTitle>
                    <AlertDescription className="text-xs">23 alerting rules evaluated. No additional issues.</AlertDescription>
                  </Alert>
                </TabsContent>

                {/* ── Panel Settings tab ── */}
                <TabsContent value="settings" className="mt-3">
                  <div className="grid grid-cols-2 gap-6 max-w-3xl">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Display Options</CardTitle>
                        <CardDescription className="text-xs">Controls how the panel renders</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Panel Title</Label>
                          <Input defaultValue="HTTP Request Rate" className="h-8 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Description</Label>
                          <Input defaultValue="Requests per second by service" className="h-8 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Legend Mode</Label>
                          <Select defaultValue="table">
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="list" className="text-xs">List</SelectItem>
                              <SelectItem value="table" className="text-xs">Table</SelectItem>
                              <SelectItem value="hidden" className="text-xs">Hidden</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Show tooltip</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Connect nulls</Label>
                          <Switch />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Thresholds &amp; Colors</CardTitle>
                        <CardDescription className="text-xs">Visual threshold configuration</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Threshold Color</Label>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded border cursor-pointer" style={{ background: thresholdColor }} />
                            <ColorPicker
                              color={thresholdColor}
                              onChange={setThresholdColor}
                              palette={['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#a855f7']}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Warning threshold</Label>
                          <div className="flex items-center gap-2">
                            <Input defaultValue="0.5" type="number" className="h-8 text-xs w-24" />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Critical threshold</Label>
                          <div className="flex items-center gap-2">
                            <Input defaultValue="1.0" type="number" className="h-8 text-xs w-24" />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-1.5">
                          <Label className="text-xs">Opacity</Label>
                          <div className="flex items-center gap-3">
                            <Slider defaultValue={[70]} min={0} max={100} step={5} className="flex-1" />
                            <span className="text-xs w-8 text-right">70%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {editMode && (
                <div className="flex items-center gap-2 border-2 border-dashed border-primary/30 rounded-lg p-3 bg-primary/5">
                  <Plus className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Add panel to dashboard</span>
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <PlusSquare className="h-3.5 w-3.5" />Add Panel
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <PlusSquare className="h-3.5 w-3.5" />Add Group
                    </Button>
                  </div>
                </div>
              )}
            </main>

            {/* ── Right sidebar ── */}
            <aside className="w-64 border-l bg-card flex flex-col shrink-0 hidden xl:flex">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-xs font-semibold">Live Feed</span>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">{refreshInterval}</span>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {SERIES_ROWS.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-accent text-xs group cursor-pointer"
                      onClick={() => setDrilldownService(row.name)}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <StatusDot status={row.status} />
                        <span className="truncate font-mono">{row.name}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <SparklineMock up={row.status === 'ok'} />
                        <span className="text-muted-foreground w-12 text-right">{row.rps} rps</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />
              <div className="p-3 space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Quick Actions</p>
                {[
                  { icon: Play,         label: 'Run all queries' },
                  { icon: RefreshCw,    label: 'Refresh dashboard' },
                  { icon: Star,         label: 'Add to favorites' },
                  { icon: ExternalLink, label: 'Open in full page' },
                ].map(({ icon: Icon, label }) => (
                  <Button key={label} variant="ghost" size="sm" className="w-full justify-start text-xs gap-2 h-7">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Button>
                ))}
              </div>
            </aside>
          </div>

          {/* ── Status bar ── */}
          <footer className="flex items-center gap-3 px-4 py-1.5 border-t bg-card text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1"><Database className="h-3 w-3" />prometheus-prod</span>
            <Separator orientation="vertical" className="h-3" />
            <span className="flex items-center gap-1"><Server className="h-3 w-3" />48 pods · 3 nodes</span>
            <Separator orientation="vertical" className="h-3" />
            <span className="flex items-center gap-1 text-yellow-500"><Zap className="h-3 w-3" />2 active alerts</span>
            <div className="ml-auto flex items-center gap-3">
              <span>Last updated: just now</span>
              <span>6 queries · 42ms</span>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── Charts & Legends showcase ───────────────────────────────────────────────

export const ChartsShowcase: Story = {
  name: 'Charts & Legends',
  render: () => (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h2 className="text-xl font-semibold">shadcn Charts (Recharts)</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Area Chart */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Area Chart — HTTP Request Rate</CardTitle>
            <CardDescription className="text-xs">requests/sec by service</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={RPS_CONFIG} className="h-[220px] w-full">
              <AreaChart data={RPS_DATA} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 10 }} width={44} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="api-server"   stroke="var(--color-api-server)"   fill="var(--color-api-server)"   fillOpacity={0.12} strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="auth-service" stroke="var(--color-auth-service)" fill="var(--color-auth-service)" fillOpacity={0.12} strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="cache-layer"  stroke="var(--color-cache-layer)"  fill="var(--color-cache-layer)"  fillOpacity={0.12} strokeWidth={2} dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Line Chart with threshold */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Line Chart — Error Rate with Threshold</CardTitle>
            <CardDescription className="text-xs">dashed line = 0.5% alert threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ERR_CONFIG} className="h-[220px] w-full">
              <LineChart data={ERR_DATA} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 10 }} width={44} tickFormatter={(v: number) => `${v}%`} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="api-server"    stroke="var(--color-api-server)"    strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="data-pipeline" stroke="var(--color-data-pipeline)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="notifier"      stroke="var(--color-notifier)"      strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="threshold"     stroke="var(--color-threshold)"     strokeWidth={1} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Bar Chart — Traffic Distribution</CardTitle>
            <CardDescription className="text-xs">current requests/sec per service</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={TRAFFIC_CONFIG} className="h-[220px] w-full">
              <BarChart data={TRAFFIC_DATA} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="service" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={44} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="rps" fill="var(--color-rps)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Radial Bar Chart */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Radial Bar — Resource Usage</CardTitle>
            <CardDescription className="text-xs">CPU · Memory · Disk · Network (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              CPU:     { label: 'CPU',     color: '#f97316' },
              Memory:  { label: 'Memory',  color: '#3b82f6' },
              Disk:    { label: 'Disk',    color: '#22c55e' },
              Network: { label: 'Network', color: '#a855f7' },
            }} className="h-[220px] w-full">
              <RadialBarChart data={RESOURCE_RADIAL} innerRadius={30} outerRadius={95} barSize={16}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" angleAxisId={0} label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadialBarChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-3 px-2">
              {RESOURCE_RADIAL.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full inline-block" style={{ background: r.fill }} />
                  {r.name} <span className="text-muted-foreground font-mono">{r.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// ─── Drilldown Panel standalone ──────────────────────────────────────────────

export const DrilldownPanel: Story = {
  name: 'Service Drilldown',
  render: function DrillStory() {
    const [service, setService] = useState<string>(SERIES_ROWS[4]!.name); // notifier (error state)
    const detail = getServiceDetail(service);
    const cfg: ChartConfig = {
      rps:    { label: 'RPS',      color: 'var(--chart-1)' },
      p99:    { label: 'P99 (ms)', color: 'var(--chart-4)' },
      errors: { label: 'Errors %', color: 'var(--chart-5)' },
    } satisfies ChartConfig;

    return (
      <TooltipProvider>
        <div className="p-6 bg-background min-h-screen flex gap-6">
          {/* Service list */}
          <div className="w-56 shrink-0 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Services</p>
            {SERIES_ROWS.map((row) => (
              <button
                key={row.name}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-left transition-colors ${service === row.name ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}
                onClick={() => setService(row.name)}
              >
                <StatusDot status={row.status} />
                <span className="font-mono truncate">{row.name}</span>
                <span className="ml-auto text-muted-foreground">{row.rps} rps</span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold font-mono">{service}</h2>
              <Badge variant={detail.row.env === 'prod' ? 'default' : 'secondary'}>{detail.row.env}</Badge>
              <span className="text-xs text-muted-foreground">{detail.row.region}</span>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />Open in Explore
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Requests/s', value: detail.row.rps,    color: 'text-blue-500' },
                { label: 'Latency P99', value: detail.row.p99,   color: 'text-orange-500' },
                { label: 'Error Rate',  value: detail.row.errors, color: detail.row.status === 'error' ? 'text-red-500' : detail.row.status === 'warn' ? 'text-yellow-500' : 'text-green-500' },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="pt-3 pb-3 px-4">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs">Request Rate</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ChartContainer config={cfg} className="h-[180px] w-full">
                    <AreaChart data={detail.trend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                      <YAxis tick={{ fontSize: 10 }} width={40} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="rps" stroke="var(--color-rps)" fill="var(--color-rps)" fillOpacity={0.12} strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs">Latency P99</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ChartContainer config={cfg} className="h-[180px] w-full">
                    <LineChart data={detail.trend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                      <YAxis tick={{ fontSize: 10 }} width={44} tickFormatter={(v: number) => `${v}ms`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="p99" stroke="var(--color-p99)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs">Error Rate</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ChartContainer config={cfg} className="h-[140px] w-full">
                    <AreaChart data={detail.trend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
                      <YAxis tick={{ fontSize: 10 }} width={40} tickFormatter={(v: number) => `${v}%`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="errors" stroke="var(--color-errors)" fill="var(--color-errors)" fillOpacity={0.12} strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── Stat Cards ──────────────────────────────────────────────────────────────

export const StatCards: Story = {
  name: 'Stat Cards',
  render: () => (
    <div className="p-6 space-y-4 bg-background">
      <h2 className="text-lg font-semibold">KPI Stat Cards</h2>
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
        {STAT_CARDS.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-1">
              <CardDescription className="text-xs">{s.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
              <div className={`flex items-center gap-0.5 text-xs mt-1 ${s.color}`}>
                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.delta}
              </div>
              <div className="mt-2">
                <SparklineMock up={s.up} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
};

// ─── Panel Settings Sheet ─────────────────────────────────────────────────────

export const PanelSettingsSheet: Story = {
  name: 'Panel Settings Sheet',
  render: function SheetStory() {
    const [color, setColor] = useState('#3b82f6');
    return (
      <TooltipProvider>
        <div className="p-6 flex items-center gap-4 bg-background">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Open Panel Settings
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[420px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Panel Settings</SheetTitle>
                <SheetDescription>Configure display options, queries, and thresholds.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">General</h3>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input defaultValue="HTTP Request Rate" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description</Label>
                    <Input defaultValue="Requests per second by service" className="h-8 text-xs" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Visualization</h3>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Legend Mode</Label>
                    <Select defaultValue="table">
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list" className="text-xs">List</SelectItem>
                        <SelectItem value="table" className="text-xs">Table</SelectItem>
                        <SelectItem value="hidden" className="text-xs">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show tooltip</Label><Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Enable pinning</Label><Switch defaultChecked />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Thresholds</h3>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Base Color</Label>
                    <ColorPicker
                      color={color}
                      onChange={setColor}
                      palette={['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#a855f7', '#f97316']}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Warning (%)</Label>
                    <Input defaultValue="0.5" type="number" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Critical (%)</Label>
                    <Input defaultValue="1.0" type="number" className="h-8 text-xs" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm">Cancel</Button>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <InfoTooltip description="Opens the panel settings in a right-side drawer (Sheet component)">
            <Button variant="ghost" size="icon"><HelpCircle className="h-4 w-4" /></Button>
          </InfoTooltip>
        </div>
      </TooltipProvider>
    );
  },
};
