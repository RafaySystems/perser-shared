import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
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
  TooltipProvider,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  DataTablePagination,
} from '@perses-dev/components';
import type { ChartConfig } from '@perses-dev/components';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import {
  BarChart3,
  Bell,
  ChevronDown,
  CircleDot,
  Database,
  FileText,
  FolderOpen,
  GripVertical,
  HelpCircle,
  LayoutDashboard,
  Library,
  Loader2,
  MoreHorizontal,
  MoreVertical,
  Search,
  Settings2,
  TrendingDown,
  TrendingUp,
  Users,
  Wand2,
  CheckCircle2,
  GitBranch,
  Github,
  Code2,
} from 'lucide-react';

const meta: Meta = {
  title: 'Dashboard/Blocks',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1000, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame: number;
    let startTime: number | null = null;
    const timeout = window.setTimeout(() => {
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [target, duration, delay]);
  return value;
}

// ─── Fade-slide-in animated card ─────────────────────────────────────────────

function AnimatedCard({
  delay = 0,
  className = '',
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Table data ───────────────────────────────────────────────────────────────

const SECTION_TYPES = ['Cover page', 'Table of contents', 'Narrative', 'Technical content', 'Appendix'] as const;
const REVIEWERS = ['Eddie Lake', 'Jamik Tashpulatov', 'Anika Visser', 'Marcus Webb', ''];

const HEADER_NAMES = [
  'Cover page', 'Table of contents', 'Executive summary', 'Technical approach',
  'Design', 'Capabilities', 'Integration with existing systems', 'Innovation and Advantages',
  "Overview of EMR's Innovative Solutions", 'Advanced Algorithms and Machine Learning',
  'Regulatory Compliance Framework', 'Risk Assessment and Mitigation',
  'Implementation Timeline', 'Resource Requirements', 'Budget Overview',
  'Stakeholder Analysis', 'Communication Strategy', 'Quality Assurance',
  'Testing and Validation', 'Deployment Strategy', 'Training and Onboarding',
  'Support and Maintenance Plan', 'Performance Metrics', 'Evaluation Criteria',
  'Appendix A — Glossary',
];

type RowStatus = 'Done' | 'In Process';

interface TableRow {
  id: number;
  header: string;
  sectionType: string;
  status: RowStatus;
  target: number;
  limit: number;
  reviewer: string;
}

// Deterministic generation — no Math.random() so SSR stable
function makeRows(count: number): TableRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    header: HEADER_NAMES[i % HEADER_NAMES.length]!,
    sectionType: SECTION_TYPES[i % SECTION_TYPES.length]!,
    status: (i % 3 === 0 ? 'In Process' : 'Done') as RowStatus,
    target: ((i * 7 + 3) % 30) + 1,
    limit: ((i * 11 + 5) % 30) + 1,
    reviewer: REVIEWERS[i % REVIEWERS.length]!,
  }));
}

const ALL_ROWS = makeRows(68);

// ─── Visitors chart data (90-day spiky traffic) ───────────────────────────────

const VISITORS_DATA = Array.from({ length: 90 }, (_, i) => {
  const weekday = i % 7 < 5 ? 1.0 : 0.38;
  const trend = 1 + i * 0.004;
  const base = 280 * weekday * trend;
  const wave = Math.sin(i * 1.8) * 90 + Math.sin(i * 0.9) * 60 + Math.sin(i * 3.1) * 40;
  const desktop = Math.max(30, Math.round(base + wave + 180));
  const mobile  = Math.max(10, Math.round(desktop * 0.42));
  const d = new Date(2024, 0, i + 1);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    desktop,
    mobile,
  };
});

// Slices for different time ranges
const RANGE_SLICES: Record<string, typeof VISITORS_DATA> = {
  '3mo':  VISITORS_DATA,
  '30d':  VISITORS_DATA.slice(60),
  '7d':   VISITORS_DATA.slice(83),
};

const VISITORS_CONFIG: ChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile:  { label: 'Mobile',  color: 'var(--chart-2)' },
} satisfies ChartConfig;

// ─── Perses Dashboard YAML ────────────────────────────────────────────────────

const DASHBOARD_YAML = `kind: Dashboard
metadata:
  name: documents-dashboard
  project: acme-inc
spec:
  display:
    name: Documents Dashboard
  duration: 1h
  variables: []

  panels:
    stat-total-revenue:
      kind: Panel
      spec:
        display:
          name: Total Revenue
          description: Trending up this month
        plugin:
          kind: StatChart
          spec:
            calculation: last
            format:
              unit: dollars
            sparkline: true

    stat-new-customers:
      kind: Panel
      spec:
        display:
          name: New Customers
          description: Down 20% this period
        plugin:
          kind: StatChart
          spec:
            calculation: last

    stat-active-accounts:
      kind: Panel
      spec:
        display:
          name: Active Accounts
          description: Strong user retention
        plugin:
          kind: StatChart
          spec:
            calculation: last

    stat-growth-rate:
      kind: Panel
      spec:
        display:
          name: Growth Rate
          description: Steady performance increase
        plugin:
          kind: StatChart
          spec:
            calculation: last
            format:
              unit: percent

    total-visitors:
      kind: Panel
      spec:
        display:
          name: Total Visitors
          description: Total for the last 3 months
        plugin:
          kind: TimeSeriesChart
          spec:
            legend:
              position: bottom
            visual:
              areaOpacity: 0.3
              lineWidth: 1.5
            yAxis:
              label: Visitors / day

    documents-table:
      kind: Panel
      spec:
        display:
          name: Documents
        plugin:
          kind: Table
          spec:
            pagination:
              enabled: true
              pageSize: 10
            columns:
              - name: header
                header: Header
                sortable: true
              - name: sectionType
                header: Section Type
              - name: status
                header: Status
              - name: target
                header: Target
                align: right
              - name: limit
                header: Limit
                align: right
              - name: reviewer
                header: Reviewer

  layouts:
    - kind: Grid
      spec:
        display:
          title: Overview
        items:
          - x: 0;  y: 0;  width: 3;  height: 4
            content: { $ref: '#/spec/panels/stat-total-revenue' }
          - x: 3;  y: 0;  width: 3;  height: 4
            content: { $ref: '#/spec/panels/stat-new-customers' }
          - x: 6;  y: 0;  width: 3;  height: 4
            content: { $ref: '#/spec/panels/stat-active-accounts' }
          - x: 9;  y: 0;  width: 3;  height: 4
            content: { $ref: '#/spec/panels/stat-growth-rate' }
          - x: 0;  y: 4;  width: 12; height: 6
            content: { $ref: '#/spec/panels/total-visitors' }
          - x: 0;  y: 10; width: 12; height: 8
            content: { $ref: '#/spec/panels/documents-table' }`;

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: CircleDot,      label: 'Quick Create', active: false, highlight: true },
  { icon: LayoutDashboard,label: 'Dashboard',    active: false },
  { icon: GitBranch,      label: 'Lifecycle',    active: false },
  { icon: BarChart3,      label: 'Analytics',    active: false },
  { icon: FolderOpen,     label: 'Projects',     active: false },
  { icon: Users,          label: 'Team',         active: false },
];

const DOC_ITEMS = [
  { icon: Library,   label: 'Data Library', active: true },
  { icon: BarChart3, label: 'Reports',      active: false },
  { icon: FileText,  label: 'Word Assistant', active: false },
];

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const [activeNav, setActiveNav] = useState('Data Library');
  return (
    <div className={`flex flex-col h-full border-r bg-card transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'}`}>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b">
        <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center flex-shrink-0">
          <CircleDot className="h-3.5 w-3.5 text-background" />
        </div>
        {!collapsed && <span className="font-semibold text-sm">Acme Inc.</span>}
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        {/* Quick Create */}
        <div className="px-2 mb-2">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
            <CircleDot className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Quick Create</span>}
            {!collapsed && <Bell className="h-4 w-4 ml-auto" />}
          </button>
        </div>

        {/* Main nav */}
        <div className="px-2 space-y-0.5">
          {NAV_ITEMS.slice(1).map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${activeNav === label ? 'bg-accent font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </div>

        {!collapsed && (
          <>
            <Separator className="my-3" />
            <p className="px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Documents</p>
          </>
        )}

        <div className="px-2 space-y-0.5 mt-1">
          {DOC_ITEMS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${activeNav === label ? 'bg-accent font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
          {!collapsed && (
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <MoreHorizontal className="h-4 w-4 flex-shrink-0" />
              <span>More</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t py-2 px-2 space-y-0.5">
        {[{ icon: Settings2, label: 'Settings' }, { icon: HelpCircle, label: 'Get Help' }, { icon: Search, label: 'Search' }].map(({ icon: Icon, label }) => (
          <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
        <div className={`flex items-center gap-2.5 px-3 py-2 ${collapsed ? '' : ''}`}>
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-bold">S</div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">shadcn</p>
              <p className="text-[10px] text-muted-foreground truncate">m@example.com</p>
            </div>
          )}
          {!collapsed && <MoreVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
        </div>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

type TrendDir = 'up' | 'down';

function StatCard({
  title,
  rawValue,
  prefix = '',
  suffix = '',
  trendPct,
  trendDir,
  trendLabel,
  subLabel,
  animDelay = 0,
}: {
  title: string;
  rawValue: number;
  prefix?: string;
  suffix?: string;
  trendPct: string;
  trendDir: TrendDir;
  trendLabel: string;
  subLabel: string;
  animDelay?: number;
}) {
  const count = useCountUp(rawValue, 1000, animDelay + 200);
  const TrendIcon = trendDir === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trendDir === 'up' ? 'text-green-600' : 'text-red-500';

  return (
    <AnimatedCard delay={animDelay}>
      <Card className="hover:shadow-md transition-shadow duration-300 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium">{title}</CardDescription>
            <span className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-muted ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              {trendPct}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight tabular-nums">
            {prefix}{count.toLocaleString()}{suffix}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendIcon className={`h-3 w-3 ${trendColor}`} />
            <span>{trendLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{subLabel}</p>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Dashboard01: Story = {
  name: 'Dashboard 01 — Documents',
  render: function Render() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [visitorRange, setVisitorRange] = useState<'3mo' | '30d' | '7d'>('3mo');
    const [view, setView] = useState<'dashboard' | 'yaml'>('dashboard');

    const pagedRows = ALL_ROWS.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(ALL_ROWS.length / pageSize);

    const toggleRow = useCallback((id: number) =>
      setSelectedRows((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);

    const toggleAll = useCallback((checked: boolean) =>
      setSelectedRows(checked ? new Set(pagedRows.map((r) => r.id)) : new Set()), [pagedRows]);

    const allPageSelected = pagedRows.length > 0 && pagedRows.every((r) => selectedRows.has(r.id));
    const somePageSelected = pagedRows.some((r) => selectedRows.has(r.id)) && !allPageSelected;

    const visitorData = RANGE_SLICES[visitorRange] ?? VISITORS_DATA;
    const xTickCount = visitorRange === '7d' ? 7 : visitorRange === '30d' ? 6 : 5;

    return (
      <TooltipProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          {/* Sidebar */}
          <Sidebar collapsed={sidebarCollapsed} />

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Topbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-card">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </button>
                <span className="font-semibold">Documents</span>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={view} onValueChange={(v: string) => setView(v as 'dashboard' | 'yaml')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="dashboard" className="text-xs h-6 px-3">Dashboard</TabsTrigger>
                    <TabsTrigger value="yaml" className="text-xs h-6 px-3">
                      <Code2 className="h-3 w-3 mr-1" />YAML
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5">
                  <Github className="h-3.5 w-3.5" />GitHub
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {view === 'yaml' ? (
                /* ── YAML view ── */
                <div className="p-6 h-full">
                  <AnimatedCard delay={0}>
                    <Card className="h-full">
                      <CardHeader className="px-6 py-4 border-b flex-row items-center gap-3">
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-sm">Perses Dashboard YAML</CardTitle>
                          <CardDescription className="text-xs">Source definition for this dashboard panel layout</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto h-7 text-xs"
                          onClick={() => navigator.clipboard?.writeText(DASHBOARD_YAML)}>
                          Copy
                        </Button>
                      </CardHeader>
                      <CardContent className="p-0">
                        <pre className="text-xs font-mono p-6 overflow-auto leading-relaxed">
                          {DASHBOARD_YAML.split('\n').map((line, i) => {
                            const trimmed = line.trimStart();
                            const isKey = /^[a-zA-Z$][\w-]*:/.test(trimmed);
                            const isComment = trimmed.startsWith('#');
                            const isKind = trimmed.startsWith('kind:');
                            const indent = line.length - trimmed.length;
                            return (
                              <span key={i} className="block" style={{ paddingLeft: indent * 0.5 + 'rem' }}>
                                {isComment ? (
                                  <span className="text-muted-foreground">{trimmed}</span>
                                ) : isKind ? (
                                  <>
                                    <span className="text-blue-500">kind</span>
                                    <span className="text-foreground">:</span>
                                    <span className="text-orange-500">{trimmed.slice(4)}</span>
                                  </>
                                ) : isKey ? (
                                  <>
                                    <span className="text-blue-400">{trimmed.split(':')[0]}</span>
                                    <span className="text-foreground">:</span>
                                    <span className="text-green-400">{trimmed.slice(trimmed.indexOf(':') + 1)}</span>
                                  </>
                                ) : (
                                  <span className="text-foreground">{trimmed}</span>
                                )}
                              </span>
                            );
                          })}
                        </pre>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </div>
              ) : (
                /* ── Dashboard view ── */
                <div className="p-6 space-y-6">
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Revenue"    rawValue={1250}  prefix="$" suffix=".00"
                      trendPct="+12.5%" trendDir="up"   trendLabel="Trending up this month"   subLabel="Visitors for the last 6 months" animDelay={0} />
                    <StatCard title="New Customers"    rawValue={1234}
                      trendPct="-20%"  trendDir="down"  trendLabel="Down 20% this period"     subLabel="Acquisition needs attention"    animDelay={80} />
                    <StatCard title="Active Accounts"  rawValue={45678}
                      trendPct="+12.5%" trendDir="up"  trendLabel="Strong user retention"     subLabel="Engagement exceed targets"      animDelay={160} />
                    <StatCard title="Growth Rate"      rawValue={45}   suffix="%"
                      trendPct="+4.5%" trendDir="up"   trendLabel="Steady performance increase" subLabel="Meets growth projections"     animDelay={240} />
                  </div>

                  {/* Visitors chart */}
                  <AnimatedCard delay={320}>
                    <Card className="hover:shadow-md transition-shadow duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle>Total Visitors</CardTitle>
                            <CardDescription>Total for the last {visitorRange === '3mo' ? '3 months' : visitorRange === '30d' ? '30 days' : '7 days'}</CardDescription>
                          </div>
                          <div className="flex rounded-md border overflow-hidden">
                            {(['3mo', '30d', '7d'] as const).map((r) => (
                              <button
                                key={r}
                                onClick={() => setVisitorRange(r)}
                                className={`px-3 py-1 text-xs font-medium transition-colors ${visitorRange === r ? 'bg-foreground text-background' : 'hover:bg-muted text-muted-foreground'}`}
                              >
                                {r === '3mo' ? 'Last 3 months' : r === '30d' ? 'Last 30 days' : 'Last 7 days'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={VISITORS_CONFIG} className="h-[220px] w-full">
                          <AreaChart data={visitorData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                            <defs>
                              <linearGradient id="desktopGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="var(--color-desktop)" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.02} />
                              </linearGradient>
                              <linearGradient id="mobileGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="var(--color-mobile)"  stopOpacity={0.25} />
                                <stop offset="95%" stopColor="var(--color-mobile)"  stopOpacity={0.02} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.floor(visitorData.length / xTickCount)} />
                            <YAxis tick={{ fontSize: 10 }} width={35} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                              dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={1.5}
                              fill="url(#desktopGrad)"
                              animationDuration={1200} animationEasing="ease-out"
                            />
                            <Area
                              dataKey="mobile"  stroke="var(--color-mobile)"  strokeWidth={1.5}
                              fill="url(#mobileGrad)"
                              animationDuration={1400} animationEasing="ease-out"
                            />
                          </AreaChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </AnimatedCard>

                  {/* Documents table */}
                  <AnimatedCard delay={420}>
                    <Card className="hover:shadow-md transition-shadow duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Documents</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs">Filters</Button>
                            <Button size="sm" className="h-8 text-xs">+ Add section</Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-0 pb-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="w-8 pl-4" />
                                <TableHead className="w-8">
                                  <Checkbox
                                    checked={allPageSelected || (somePageSelected ? 'indeterminate' : false)}
                                    onCheckedChange={(v: boolean | 'indeterminate') => toggleAll(v === true)}
                                  />
                                </TableHead>
                                <TableHead className="font-semibold">Header</TableHead>
                                <TableHead className="font-semibold">Section Type</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="text-right font-semibold">Target</TableHead>
                                <TableHead className="text-right font-semibold">Limit</TableHead>
                                <TableHead className="font-semibold">Reviewer</TableHead>
                                <TableHead className="w-8" />
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pagedRows.map((row) => (
                                <TableRow
                                  key={row.id}
                                  className="group hover:bg-muted/40 transition-colors"
                                  data-selected={selectedRows.has(row.id)}
                                >
                                  <TableCell className="pl-4 pr-0 w-8">
                                    <GripVertical className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors cursor-grab" />
                                  </TableCell>
                                  <TableCell className="w-8">
                                    <Checkbox
                                      checked={selectedRows.has(row.id)}
                                      onCheckedChange={() => toggleRow(row.id)}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium">{row.header}</TableCell>
                                  <TableCell>
                                    <span className="text-xs px-2 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground">
                                      {row.sectionType}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {row.status === 'Done' ? (
                                      <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
                                        <CheckCircle2 className="h-3.5 w-3.5" />Done
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />In Process
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right tabular-nums text-sm">{row.target}</TableCell>
                                  <TableCell className="text-right tabular-nums text-sm">{row.limit}</TableCell>
                                  <TableCell>
                                    {row.reviewer ? (
                                      <span className="text-sm">{row.reviewer}</span>
                                    ) : (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                            Assign reviewer <ChevronDown className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                          {REVIEWERS.filter(Boolean).map((r) => (
                                            <DropdownMenuItem key={r}>{r}</DropdownMenuItem>
                                          ))}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <DataTablePagination
                          page={page}
                          totalPages={totalPages}
                          totalRows={ALL_ROWS.length}
                          selectedRows={selectedRows.size}
                          pageSize={pageSize}
                          pageSizeOptions={[5, 10, 20, 30, 50]}
                          onPageChange={setPage}
                          onPageSizeChange={(s: number) => { setPageSize(s); setPage(1); }}
                        />
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </div>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  },
};
