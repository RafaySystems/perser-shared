import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  TooltipProvider,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Separator,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  PaginationBar,
} from '@perses-dev/components';
import type { ChartConfig } from '@perses-dev/components';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Search,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Activity,
  Network,
  Flame,
  GitBranch,
  Clock,
  Server,
  Database,
  Globe,
  Zap,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Rocket,
  ShieldAlert,
  Wrench,
  TrendingUp,
  TrendingDown,
  CalendarClock,
} from 'lucide-react';

const meta: Meta = {
  title: 'Explore/Observability Views',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

// ─── Shared helpers ───────────────────────────────────────────────────────────

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

const SERVICES = ['api-gateway', 'auth-service', 'user-service', 'order-service', 'payment-service', 'cache-layer', 'db-primary'];

// ─── LOG VIEW ─────────────────────────────────────────────────────────────────

const LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG'] as const;
type LogLevel = typeof LOG_LEVELS[number];

const LOG_ENTRIES = [
  { id: 1, ts: '2024-01-15 14:32:01.123', level: 'ERROR' as LogLevel, service: 'api-gateway', msg: 'Request timeout after 30s', trace: 'abc123def456', attrs: { url: '/api/v1/orders', method: 'POST', status: 504, user_id: 'usr_8472' } },
  { id: 2, ts: '2024-01-15 14:32:00.887', level: 'ERROR' as LogLevel, service: 'payment-service', msg: 'Payment gateway connection refused: EOF', trace: 'abc123def456', attrs: { gateway: 'stripe', attempt: 3, error_code: 'ECONNREFUSED' } },
  { id: 3, ts: '2024-01-15 14:31:59.442', level: 'WARN' as LogLevel, service: 'order-service', msg: 'Inventory check took 2800ms (threshold: 1000ms)', trace: 'abc123def456', attrs: { product_id: 'prod_9921', warehouse: 'us-east-1', duration_ms: 2800 } },
  { id: 4, ts: '2024-01-15 14:31:59.100', level: 'INFO' as LogLevel, service: 'auth-service', msg: 'JWT validated successfully', trace: 'abc123def456', attrs: { user_id: 'usr_8472', roles: ['user', 'premium'], exp: '2024-01-15T15:31:59Z' } },
  { id: 5, ts: '2024-01-15 14:31:58.777', level: 'INFO' as LogLevel, service: 'api-gateway', msg: 'Incoming POST /api/v1/orders', trace: 'abc123def456', attrs: { ip: '203.0.113.42', content_length: 1248, correlation_id: 'req_zxy9' } },
  { id: 6, ts: '2024-01-15 14:31:55.310', level: 'DEBUG' as LogLevel, service: 'cache-layer', msg: 'Cache miss for key user:8472:cart', trace: 'bbb456eee789', attrs: { key: 'user:8472:cart', ttl: 300, backend: 'redis-cluster-1' } },
  { id: 7, ts: '2024-01-15 14:31:54.002', level: 'INFO' as LogLevel, service: 'user-service', msg: 'User profile fetched from DB', trace: 'bbb456eee789', attrs: { user_id: 'usr_8472', query_ms: 4, cache_hit: false } },
  { id: 8, ts: '2024-01-15 14:31:52.891', level: 'WARN' as LogLevel, service: 'db-primary', msg: 'Slow query detected (>500ms)', trace: 'ccc789fff012', attrs: { query: 'SELECT * FROM orders WHERE user_id=?', duration_ms: 734, table: 'orders' } },
  { id: 9, ts: '2024-01-15 14:31:51.200', level: 'INFO' as LogLevel, service: 'order-service', msg: 'Order created successfully', trace: 'ccc789fff012', attrs: { order_id: 'ord_55821', total: '$142.50', items: 3 } },
  { id: 10, ts: '2024-01-15 14:31:50.100', level: 'ERROR' as LogLevel, service: 'payment-service', msg: 'Fraud check service unavailable', trace: 'ddd012aaa345', attrs: { check_type: 'velocity', fallback: 'allow', reason: 'degraded_mode' } },
];

const LOG_LEVEL_CONFIG: Record<LogLevel, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  ERROR: { color: 'text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', icon: XCircle },
  WARN:  { color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800', icon: AlertTriangle },
  INFO:  { color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', icon: Info },
  DEBUG: { color: 'text-muted-foreground bg-muted/30 border-border', icon: Bug },
};

function LogLevelBadge({ level }: { level: LogLevel }) {
  const cfg = LOG_LEVEL_CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${cfg.color}`}>
      {level}
    </span>
  );
}

const LOG_VOLUME: { time: string; error: number; warn: number; info: number }[] = [
  { time: '14:00', error: 2, warn: 8, info: 142 },
  { time: '14:05', error: 1, warn: 5, info: 168 },
  { time: '14:10', error: 5, warn: 12, info: 155 },
  { time: '14:15', error: 14, warn: 22, info: 130 },
  { time: '14:20', error: 8, warn: 18, info: 144 },
  { time: '14:25', error: 3, warn: 9, info: 160 },
  { time: '14:30', error: 11, warn: 20, info: 138 },
  { time: '14:32', error: 18, warn: 25, info: 120 },
];

const LOG_VOLUME_CONFIG: ChartConfig = {
  error: { label: 'Error', color: 'var(--chart-5)' },
  warn:  { label: 'Warn',  color: 'var(--chart-4)' },
  info:  { label: 'Info',  color: 'var(--chart-1)' },
} satisfies ChartConfig;

// Facet definitions: field → possible values with counts
const FACET_FIELDS: { field: string; label: string; values: { v: string; count: number }[] }[] = [
  {
    field: 'level',
    label: 'Level',
    values: [
      { v: 'ERROR', count: 3 },
      { v: 'WARN',  count: 2 },
      { v: 'INFO',  count: 3 },
      { v: 'DEBUG', count: 1 },
    ],
  },
  {
    field: 'service',
    label: 'Service',
    values: [
      { v: 'api-gateway',     count: 2 },
      { v: 'payment-service', count: 3 },
      { v: 'order-service',   count: 2 },
      { v: 'auth-service',    count: 1 },
      { v: 'user-service',    count: 1 },
      { v: 'cache-layer',     count: 1 },
      { v: 'db-primary',      count: 1 },
    ],
  },
  {
    field: 'trace',
    label: 'Trace ID',
    values: [
      { v: 'abc123def456', count: 5 },
      { v: 'bbb456eee789', count: 2 },
      { v: 'ccc789fff012', count: 2 },
      { v: 'ddd012aaa345', count: 1 },
    ],
  },
  {
    field: 'http_status',
    label: 'HTTP Status',
    values: [
      { v: '504', count: 1 },
      { v: '200', count: 3 },
      { v: '500', count: 2 },
      { v: '201', count: 2 },
    ],
  },
];

function FacetPanel({ facets, activeFacets, onToggle }: {
  facets: typeof FACET_FIELDS;
  activeFacets: Map<string, Set<string>>;
  onToggle: (field: string, value: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleSection = (field: string) =>
    setCollapsed((s) => { const n = new Set(s); n.has(field) ? n.delete(field) : n.add(field); return n; });

  return (
    <div className="space-y-1">
      {facets.map((facet) => {
        const isCollapsed = collapsed.has(facet.field);
        const active = activeFacets.get(facet.field) ?? new Set();
        const total = facet.values.reduce((s, v) => s + v.count, 0);
        return (
          <div key={facet.field} className="border-b last:border-b-0">
            <button
              onClick={() => toggleSection(facet.field)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors"
            >
              <span>{facet.label}</span>
              <div className="flex items-center gap-1">
                {active.size > 0 && <span className="h-4 px-1 bg-primary text-primary-foreground rounded text-[10px]">{active.size}</span>}
                {isCollapsed ? <ChevronRight className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
              </div>
            </button>
            {!isCollapsed && (
              <div className="pb-2">
                {facet.values.map(({ v, count }) => {
                  const isActive = active.has(v);
                  const barWidth = Math.max((count / total) * 100, 4);
                  return (
                    <button
                      key={v}
                      onClick={() => onToggle(facet.field, v)}
                      className={`w-full flex items-center gap-2 px-3 py-1 text-xs hover:bg-muted/40 transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                    >
                      <div className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${isActive ? 'bg-primary border-primary' : 'border-border'}`}>
                        {isActive && <span className="text-[8px] text-primary-foreground font-bold">✓</span>}
                      </div>
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <span className="truncate font-mono">{v}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[20px]">
                          <div className="h-full bg-primary/40 rounded-full" style={{ width: `${barWidth}%` }} />
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground w-5 text-right flex-shrink-0">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const LOG_PAGE_SIZE = 5;

export const LogView: Story = {
  name: 'Log View',
  render: function Render() {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [activeFacets, setActiveFacets] = useState<Map<string, Set<string>>>(new Map());
    const [logPage, setLogPage] = useState(1);

    const toggle = (id: number) =>
      setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const toggleFacet = (field: string, value: string) => {
      setLogPage(1);
      setActiveFacets((prev) => {
        const next = new Map(prev);
        const vals = new Set(next.get(field) ?? []);
        vals.has(value) ? vals.delete(value) : vals.add(value);
        vals.size ? next.set(field, vals) : next.delete(field);
        return next;
      });
    };

    const clearFacets = () => { setActiveFacets(new Map()); setLogPage(1); };

    const filtered = LOG_ENTRIES.filter((e) => {
      if (levelFilter !== 'ALL' && e.level !== levelFilter) return false;
      if (search && !e.msg.toLowerCase().includes(search.toLowerCase()) && !e.service.includes(search.toLowerCase())) return false;
      const levelVals = activeFacets.get('level');
      if (levelVals?.size && !levelVals.has(e.level)) return false;
      const svcVals = activeFacets.get('service');
      if (svcVals?.size && !svcVals.has(e.service)) return false;
      const traceVals = activeFacets.get('trace');
      if (traceVals?.size && !traceVals.has(e.trace)) return false;
      return true;
    });

    const totalActiveFacets = [...activeFacets.values()].reduce((s, v) => s + v.size, 0);
    const logTotalPages = Math.ceil(filtered.length / LOG_PAGE_SIZE);
    const pagedLogs = filtered.slice((logPage - 1) * LOG_PAGE_SIZE, logPage * LOG_PAGE_SIZE);

    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Activity className="h-5 w-5" /> Log Explorer</h2>
              <p className="text-sm text-muted-foreground">Streaming structured logs with faceted search</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><RefreshCw className="h-3 w-3 mr-1" /> Live</Button>
              <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" /> Export</Button>
            </div>
          </div>

          {/* Volume histogram */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Log Volume (last 32 min)</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ChartContainer config={LOG_VOLUME_CONFIG} className="h-[100px] w-full">
                <BarChart data={LOG_VOLUME} barSize={14} stackOffset="none">
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="error" stackId="a" fill="var(--color-error)" />
                  <Bar dataKey="warn"  stackId="a" fill="var(--color-warn)" />
                  <Bar dataKey="info"  stackId="a" fill="var(--color-info)" radius={[2,2,0,0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 h-9" placeholder="Search logs…" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
            </div>
            <Select value={levelFilter} onValueChange={(v: string) => setLevelFilter(v as LogLevel | 'ALL')}>
              <SelectTrigger className="w-28 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All levels</SelectItem>
                {LOG_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Active facet chips */}
          {totalActiveFacets > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {[...activeFacets.entries()].flatMap(([field, vals]) =>
                [...vals].map((v) => (
                  <button
                    key={`${field}:${v}`}
                    onClick={() => toggleFacet(field, v)}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/30 hover:bg-primary/20 transition-colors"
                  >
                    <span className="text-muted-foreground">{field}=</span>{v}
                    <XCircle className="h-3 w-3 ml-0.5" />
                  </button>
                ))
              )}
              <button className="text-xs text-muted-foreground underline hover:text-foreground" onClick={clearFacets}>
                Clear all
              </button>
            </div>
          )}

          {/* Two-column layout: facets + logs */}
          <div className="grid grid-cols-[200px_1fr] gap-4">
            {/* Facets sidebar */}
            <Card className="overflow-hidden self-start">
              <CardHeader className="px-3 py-2 border-b">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Filter className="h-3 w-3" />Fields
                </CardTitle>
              </CardHeader>
              <ScrollArea className="max-h-[520px]">
                <FacetPanel facets={FACET_FIELDS} activeFacets={activeFacets} onToggle={toggleFacet} />
              </ScrollArea>
            </Card>

            {/* Log table */}
            <Card className="overflow-hidden">
              <div className="font-mono text-xs">
                <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-1.5">
                  <div className="grid grid-cols-[130px_58px_120px_1fr_90px] gap-0 flex-1 text-muted-foreground font-sans text-[11px] font-medium uppercase tracking-wide">
                    <span>Timestamp</span>
                    <span>Level</span>
                    <span>Service</span>
                    <span>Message</span>
                    <span className="text-right">Trace</span>
                  </div>
                </div>
                <div className="text-[11px] px-3 py-1 border-b text-muted-foreground bg-muted/20 flex items-center justify-between">
                  <span>{filtered.length} of {LOG_ENTRIES.length} logs</span>
                  <span>Page {logPage} of {Math.max(logTotalPages, 1)}</span>
                </div>
                <div>
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
                      <Search className="h-5 w-5" />
                      <span className="text-xs">No logs match the current filters</span>
                    </div>
                  ) : (
                    pagedLogs.map((log) => {
                      const isOpen = expanded.has(log.id);
                      return (
                        <div key={log.id} className="border-b last:border-b-0">
                          <button
                            onClick={() => toggle(log.id)}
                            className="w-full grid grid-cols-[130px_58px_120px_1fr_90px] gap-0 px-3 py-2 text-left hover:bg-muted/40 transition-colors items-start"
                          >
                            <span className="text-muted-foreground">{log.ts.split(' ')[1]}</span>
                            <LogLevelBadge level={log.level} />
                            <span className="text-primary/80 truncate pr-2">{log.service}</span>
                            <span className={`truncate ${log.level === 'ERROR' ? 'text-red-600 dark:text-red-400' : log.level === 'WARN' ? 'text-yellow-600' : 'text-foreground'}`}>
                              {isOpen ? <ChevronDown className="inline h-3 w-3 mr-1 mb-0.5" /> : <ChevronRight className="inline h-3 w-3 mr-1 mb-0.5" />}
                              {log.msg}
                            </span>
                            <span className="text-right text-muted-foreground/70 font-mono text-[10px] truncate">{log.trace.slice(0,8)}</span>
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-3 pt-1 bg-muted/20 border-t border-dashed">
                              <div className="flex gap-4 flex-wrap">
                                {Object.entries(log.attrs).map(([k, v]) => (
                                  <button
                                    key={k}
                                    onClick={() => {
                                      // add as facet if it's a known field
                                      if (k === 'status' || k === 'service') toggleFacet(k, String(v));
                                    }}
                                    className="flex gap-1 items-center hover:bg-muted px-1 py-0.5 rounded transition-colors"
                                  >
                                    <span className="text-muted-foreground">{k}=</span>
                                    <span className="text-primary font-medium">{JSON.stringify(v)}</span>
                                  </button>
                                ))}
                              </div>
                              <div className="mt-2 flex gap-2">
                                <Button variant="outline" size="sm" className="h-6 text-[11px]">View trace</Button>
                                <Button variant="outline" size="sm" className="h-6 text-[11px]" onClick={() => toggleFacet('trace', log.trace)}>Filter by trace</Button>
                                <Button variant="outline" size="sm" className="h-6 text-[11px]">Copy</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                {logTotalPages > 1 && (
                  <div className="border-t py-2">
                    <PaginationBar page={logPage} totalPages={logTotalPages} onPageChange={setLogPage} />
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── FLAMEGRAPH ───────────────────────────────────────────────────────────────

type FlamegraphNode = { name: string; self: number; total: number; children?: FlamegraphNode[] };

const FLAME_ROOT: FlamegraphNode = {
  name: 'main', self: 2, total: 1000,
  children: [
    {
      name: 'HTTP.ServeHTTP', self: 5, total: 980,
      children: [
        {
          name: 'Router.Handle', self: 8, total: 960,
          children: [
            {
              name: 'Middleware.Auth', self: 12, total: 180,
              children: [
                { name: 'JWT.Validate', self: 45, total: 120 },
                { name: 'Cache.Get', self: 18, total: 30, children: [{ name: 'Redis.Get', self: 22, total: 25 }] },
              ],
            },
            {
              name: 'Handler.CreateOrder', self: 15, total: 770,
              children: [
                {
                  name: 'OrderService.Create', self: 10, total: 520,
                  children: [
                    {
                      name: 'DB.Query', self: 8, total: 320,
                      children: [
                        { name: 'sql.Open', self: 3, total: 10 },
                        { name: 'sql.QueryContext', self: 180, total: 305 },
                      ],
                    },
                    { name: 'Inventory.Check', self: 25, total: 180 },
                  ],
                },
                {
                  name: 'PaymentService.Charge', self: 20, total: 230,
                  children: [
                    { name: 'Stripe.CreateCharge', self: 140, total: 180 },
                    { name: 'FraudCheck.Run', self: 15, total: 28 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const FLAME_COLORS = [
  'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-red-400',
  'bg-orange-500', 'bg-amber-500', 'bg-red-500', 'bg-orange-300',
];

function FlameNode({ node, parentTotal, depth, onHover, hovered }: {
  node: FlamegraphNode;
  parentTotal: number;
  depth: number;
  onHover: (n: FlamegraphNode | null) => void;
  hovered: FlamegraphNode | null;
}) {
  const [open, setOpen] = useState(depth < 3);
  const widthPct = (node.total / parentTotal) * 100;
  const color = FLAME_COLORS[depth % FLAME_COLORS.length];
  const isHovered = hovered?.name === node.name;

  return (
    <div style={{ width: `${widthPct}%`, minWidth: 0 }} className="flex flex-col">
      <button
        className={`text-left text-[10px] font-mono truncate px-1 py-0.5 border-r border-white/20 transition-all ${color} ${isHovered ? 'ring-1 ring-white brightness-110' : 'hover:brightness-110'}`}
        style={{ height: 22 }}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => onHover(node)}
        onMouseLeave={() => onHover(null)}
        title={`${node.name} — total: ${node.total}ms, self: ${node.self}ms`}
      >
        {node.name}
      </button>
      {open && node.children && (
        <div className="flex">
          {node.children.map((c) => (
            <FlameNode key={c.name} node={c} parentTotal={node.total} depth={depth + 1} onHover={onHover} hovered={hovered} />
          ))}
        </div>
      )}
    </div>
  );
}

export const FlamegraphView: Story = {
  name: 'Flamegraph View',
  render: function Render() {
    const [hovered, setHovered] = useState<FlamegraphNode | null>(null);

    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" /> Flamegraph</h2>
              <p className="text-sm text-muted-foreground">CPU profiling — 1000ms sample · 2024-01-15 14:32:01</p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="cpu">
                <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpu">CPU time</SelectItem>
                  <SelectItem value="wall">Wall time</SelectItem>
                  <SelectItem value="alloc">Allocations</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 text-xs">Reset zoom</Button>
            </div>
          </div>

          {/* Hover tooltip */}
          <Card className={`transition-all ${hovered ? 'opacity-100' : 'opacity-0'} h-12`}>
            <CardContent className="px-4 py-2 flex gap-6 items-center text-sm">
              <span className="font-mono font-medium">{hovered?.name ?? '—'}</span>
              <span className="text-muted-foreground">Total: <span className="font-medium text-foreground">{hovered?.total ?? 0}ms ({hovered ? Math.round((hovered.total / 1000) * 100) : 0}%)</span></span>
              <span className="text-muted-foreground">Self: <span className="font-medium text-foreground">{hovered?.self ?? 0}ms</span></span>
            </CardContent>
          </Card>

          {/* Flamegraph canvas */}
          <Card className="overflow-hidden">
            <CardContent className="p-2">
              <div className="text-[10px] text-muted-foreground mb-1 px-1">Click to expand/collapse · hover for details</div>
              {/* Render bottom-up (root at top = icicle style, inverted = flame style) */}
              <div className="flex flex-col-reverse gap-0 overflow-x-auto">
                <div className="flex w-full min-w-[600px]">
                  <FlameNode node={FLAME_ROOT} parentTotal={FLAME_ROOT.total} depth={0} onHover={setHovered} hovered={hovered} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top functions table */}
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm">Top functions by self time</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-xs">
                <div className="grid grid-cols-[1fr_80px_80px_100px] gap-0 border-b bg-muted/50 px-4 py-1.5 text-muted-foreground font-medium uppercase tracking-wide text-[11px]">
                  <span>Function</span><span className="text-right">Self (ms)</span><span className="text-right">Total (ms)</span><span className="text-right">Self %</span>
                </div>
                {[
                  { name: 'sql.QueryContext', self: 180, total: 305 },
                  { name: 'Stripe.CreateCharge', self: 140, total: 180 },
                  { name: 'JWT.Validate', self: 45, total: 120 },
                  { name: 'Inventory.Check', self: 25, total: 180 },
                  { name: 'FraudCheck.Run', self: 15, total: 28 },
                  { name: 'Handler.CreateOrder', self: 15, total: 770 },
                  { name: 'Router.Handle', self: 8, total: 960 },
                ].map((fn) => (
                  <div key={fn.name} className="grid grid-cols-[1fr_80px_80px_100px] gap-0 px-4 py-2 border-b last:border-b-0 hover:bg-muted/30 font-mono">
                    <span className="text-primary/80">{fn.name}</span>
                    <span className="text-right">{fn.self}</span>
                    <span className="text-right text-muted-foreground">{fn.total}</span>
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex-1 max-w-[60px] h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(fn.self / 1000) * 100}%` }} />
                      </div>
                      <span className="w-8 text-right">{((fn.self / 1000) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── TRACE WATERFALL (Tree View) ──────────────────────────────────────────────

type TraceSpan = {
  id: string;
  parent: string | null;
  service: string;
  op: string;
  start: number;
  dur: number;
  status: 'ok' | 'error' | 'warn';
  tags?: Record<string, string | number>;
};

const TRACE_SPANS: TraceSpan[] = [
  { id: 's1', parent: null,  service: 'api-gateway',     op: 'POST /api/v1/orders',           start: 0,    dur: 980, status: 'error' },
  { id: 's2', parent: 's1',  service: 'auth-service',    op: 'jwt.validate',                  start: 10,   dur: 120, status: 'ok',    tags: { user_id: 'usr_8472' } },
  { id: 's3', parent: 's2',  service: 'cache-layer',     op: 'redis.get user:8472:session',   start: 30,   dur: 25,  status: 'ok',    tags: { hit: 'false' } },
  { id: 's4', parent: 's1',  service: 'order-service',   op: 'order.create',                  start: 135,  dur: 750, status: 'error' },
  { id: 's5', parent: 's4',  service: 'db-primary',      op: 'db.query orders',               start: 145,  dur: 320, status: 'warn',  tags: { rows: 142, slow: 'true' } },
  { id: 's6', parent: 's5',  service: 'db-primary',      op: 'db.query products',             start: 200,  dur: 80,  status: 'ok' },
  { id: 's7', parent: 's4',  service: 'user-service',    op: 'user.get_profile',              start: 475,  dur: 60,  status: 'ok' },
  { id: 's8', parent: 's7',  service: 'cache-layer',     op: 'redis.get user:8472:profile',   start: 480,  dur: 12,  status: 'ok',    tags: { hit: 'true' } },
  { id: 's9', parent: 's4',  service: 'payment-service', op: 'payment.charge',                start: 545,  dur: 335, status: 'error', tags: { gateway: 'stripe', amount: '$142.50' } },
  { id: 's10', parent: 's9', service: 'payment-service', op: 'fraud.check',                   start: 550,  dur: 28,  status: 'ok' },
  { id: 's11', parent: 's9', service: 'payment-service', op: 'stripe.create_charge',          start: 582,  dur: 180, status: 'error', tags: { error: 'ECONNREFUSED' } },
];

const SERVICE_COLORS: Record<string, string> = {
  'api-gateway':     'bg-blue-500',
  'auth-service':    'bg-purple-500',
  'cache-layer':     'bg-green-500',
  'order-service':   'bg-amber-500',
  'db-primary':      'bg-orange-500',
  'user-service':    'bg-cyan-500',
  'payment-service': 'bg-red-500',
};

function buildSpanTree(spans: TraceSpan[]): Map<string | null, TraceSpan[]> {
  const map = new Map<string | null, TraceSpan[]>();
  for (const s of spans) {
    const arr = map.get(s.parent) ?? [];
    arr.push(s);
    map.set(s.parent, arr);
  }
  return map;
}

function SpanRow({ span, depth, totalDur, tree, expanded, toggle }: {
  span: TraceSpan;
  depth: number;
  totalDur: number;
  tree: Map<string | null, TraceSpan[]>;
  expanded: Set<string>;
  toggle: (id: string) => void;
}) {
  const children = tree.get(span.id) ?? [];
  const isOpen = expanded.has(span.id);
  const left = (span.start / totalDur) * 100;
  const width = Math.max((span.dur / totalDur) * 100, 0.5);

  return (
    <>
      <div className="grid grid-cols-[320px_1fr] border-b hover:bg-muted/30 transition-colors text-xs">
        <div className="flex items-center gap-1 px-2 py-1.5" style={{ paddingLeft: `${8 + depth * 16}px` }}>
          {children.length > 0 ? (
            <button onClick={() => toggle(span.id)} className="p-0.5 hover:bg-muted rounded">
              {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${SERVICE_COLORS[span.service] ?? 'bg-muted'}`} />
          <span className="font-mono truncate text-foreground/80">{span.op}</span>
          {span.status === 'error' && <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />}
          {span.status === 'warn' && <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
        </div>
        <div className="relative py-1.5 pr-3">
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div
              className={`h-4 rounded-sm opacity-80 flex items-center px-1 overflow-hidden ${SERVICE_COLORS[span.service] ?? 'bg-muted'}`}
              style={{ marginLeft: `${left}%`, width: `${width}%`, minWidth: 4 }}
            >
              <span className="text-white text-[9px] truncate hidden">{span.dur}ms</span>
            </div>
          </div>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">{span.dur}ms</span>
        </div>
      </div>
      {isOpen && children.map((c) => (
        <SpanRow key={c.id} span={c} depth={depth + 1} totalDur={totalDur} tree={tree} expanded={expanded} toggle={toggle} />
      ))}
    </>
  );
}

export const TraceTreeView: Story = {
  name: 'Trace / Tree View',
  render: function Render() {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['s1', 's4', 's9']));
    const tree = buildSpanTree(TRACE_SPANS);
    const roots = tree.get(null) ?? [];
    const total = Math.max(...TRACE_SPANS.map((s) => s.start + s.dur));

    const toggle = useCallback((id: string) =>
      setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);

    const serviceSet = [...new Set(TRACE_SPANS.map((s) => s.service))];
    const errors = TRACE_SPANS.filter((s) => s.status === 'error').length;
    const warns = TRACE_SPANS.filter((s) => s.status === 'warn').length;

    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><GitBranch className="h-5 w-5" /> Distributed Trace</h2>
              <p className="text-sm text-muted-foreground font-mono">trace: abc123def456 · {total}ms · {TRACE_SPANS.length} spans</p>
            </div>
            <div className="flex gap-2">
              {errors > 0 && <Badge variant="destructive">{errors} errors</Badge>}
              {warns > 0 && <Badge className="bg-yellow-500 hover:bg-yellow-600">{warns} slow</Badge>}
            </div>
          </div>

          {/* Service legend */}
          <div className="flex gap-3 flex-wrap">
            {serviceSet.map((svc) => (
              <div key={svc} className="flex items-center gap-1.5 text-xs">
                <div className={`w-2 h-2 rounded-full ${SERVICE_COLORS[svc]}`} />
                <span className="text-muted-foreground">{svc}</span>
              </div>
            ))}
          </div>

          {/* Trace waterfall */}
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[320px_1fr] border-b bg-muted/50 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
              <div className="px-3 py-2">Span</div>
              <div className="px-3 py-2 flex justify-between">
                <span>0ms</span>
                <span className="text-center">{Math.round(total / 2)}ms</span>
                <span>{total}ms</span>
              </div>
            </div>
            <ScrollArea className="h-[380px]">
              {roots.map((r) => (
                <SpanRow key={r.id} span={r} depth={0} totalDur={total} tree={tree} expanded={expanded} toggle={toggle} />
              ))}
            </ScrollArea>
          </Card>

          {/* Selected span detail */}
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm">stripe.create_charge — payment-service</CardTitle>
              <CardDescription className="font-mono text-xs">span: s11 · 582ms → 762ms</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs uppercase font-medium">Tags</div>
                  {Object.entries({ gateway: 'stripe', amount: '$142.50', error: 'ECONNREFUSED', attempt: 3 }).map(([k, v]) => (
                    <div key={k} className="flex gap-2 font-mono text-xs">
                      <span className="text-muted-foreground w-24">{k}</span>
                      <span className={k === 'error' ? 'text-red-500' : 'text-foreground'}>{String(v)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs uppercase font-medium">Events</div>
                  {[
                    { t: '+0ms',   msg: 'Starting Stripe API request' },
                    { t: '+12ms',  msg: 'DNS resolution complete' },
                    { t: '+45ms',  msg: 'TLS handshake complete' },
                    { t: '+180ms', msg: 'Connection refused: EOF' },
                  ].map((ev) => (
                    <div key={ev.t} className="flex gap-2 text-xs font-mono">
                      <span className="text-muted-foreground w-16">{ev.t}</span>
                      <span>{ev.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── NETWORK MAP ──────────────────────────────────────────────────────────────

type Node = { id: string; label: string; type: 'gateway' | 'service' | 'db' | 'cache' | 'external'; x: number; y: number; rps: number; errRate: number };
type Edge = { from: string; to: string; rps: number; p99: number; errRate: number };

const NODES: Node[] = [
  { id: 'gw',      label: 'API Gateway',     type: 'gateway',  x: 50,  y: 180, rps: 420, errRate: 2.1 },
  { id: 'auth',    label: 'auth-service',    type: 'service',  x: 180, y: 80,  rps: 380, errRate: 0.2 },
  { id: 'order',   label: 'order-service',   type: 'service',  x: 180, y: 280, rps: 210, errRate: 5.8 },
  { id: 'user',    label: 'user-service',    type: 'service',  x: 320, y: 80,  rps: 340, errRate: 0.1 },
  { id: 'payment', label: 'payment-service', type: 'service',  x: 320, y: 280, rps: 195, errRate: 8.4 },
  { id: 'cache',   label: 'Redis Cache',     type: 'cache',    x: 460, y: 120, rps: 890, errRate: 0.0 },
  { id: 'db',      label: 'DB Primary',      type: 'db',       x: 460, y: 240, rps: 310, errRate: 0.4 },
  { id: 'stripe',  label: 'Stripe API',      type: 'external', x: 460, y: 360, rps: 185, errRate: 12.1 },
];

const EDGES: Edge[] = [
  { from: 'gw',    to: 'auth',    rps: 380, p99: 145, errRate: 0.2 },
  { from: 'gw',    to: 'order',   rps: 210, p99: 890, errRate: 5.8 },
  { from: 'auth',  to: 'user',    rps: 340, p99: 42,  errRate: 0.1 },
  { from: 'auth',  to: 'cache',   rps: 710, p99: 8,   errRate: 0.0 },
  { from: 'order', to: 'payment', rps: 195, p99: 980, errRate: 8.4 },
  { from: 'order', to: 'db',      rps: 310, p99: 640, errRate: 0.4 },
  { from: 'order', to: 'user',    rps: 195, p99: 38,  errRate: 0.1 },
  { from: 'payment', to: 'stripe', rps: 185, p99: 2100, errRate: 12.1 },
  { from: 'user',  to: 'cache',   rps: 180, p99: 6,   errRate: 0.0 },
  { from: 'user',  to: 'db',      rps: 90,  p99: 22,  errRate: 0.2 },
];

const NODE_ICONS: Record<Node['type'], React.ComponentType<{ className?: string }>> = {
  gateway: Globe, service: Server, db: Database, cache: Zap, external: Network,
};

const NODE_COLORS: Record<Node['type'], string> = {
  gateway: 'border-blue-400 bg-blue-50 dark:bg-blue-950/40',
  service: 'border-border bg-card',
  db: 'border-orange-400 bg-orange-50 dark:bg-orange-950/40',
  cache: 'border-green-400 bg-green-50 dark:bg-green-950/40',
  external: 'border-purple-400 bg-purple-50 dark:bg-purple-950/40',
};

export const NetworkMapView: Story = {
  name: 'Network / Service Map',
  render: function Render() {
    const [selected, setSelected] = useState<string | null>(null);
    const selectedEdges = EDGES.filter((e) => e.from === selected || e.to === selected);
    const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Network className="h-5 w-5" /> Service Dependency Map</h2>
              <p className="text-sm text-muted-foreground">Real-time service topology · click a node to inspect connections</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><RefreshCw className="h-3 w-3 mr-1" />Live</Button>
              <Select defaultValue="rps">
                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rps">RPS</SelectItem>
                  <SelectItem value="p99">P99 latency</SelectItem>
                  <SelectItem value="err">Error rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_260px] gap-4">
            {/* SVG map */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <svg viewBox="0 0 560 460" className="w-full" style={{ height: 380 }}>
                  {/* Edge lines */}
                  {EDGES.map((e) => {
                    const from = nodeMap[e.from]!;
                    const to = nodeMap[e.to]!;
                    const isHighlit = selected && (e.from === selected || e.to === selected);
                    const isErr = e.errRate > 5;
                    return (
                      <g key={`${e.from}-${e.to}`}>
                        <line
                          x1={from.x + 35} y1={from.y + 20}
                          x2={to.x + 35}   y2={to.y + 20}
                          stroke={isErr ? '#f87171' : isHighlit ? '#60a5fa' : '#64748b'}
                          strokeWidth={isHighlit ? 2.5 : 1.5}
                          strokeDasharray={isErr ? '4 2' : undefined}
                          opacity={selected && !isHighlit ? 0.2 : 0.7}
                        />
                        <text
                          x={(from.x + to.x) / 2 + 35}
                          y={(from.y + to.y) / 2 + 20}
                          fontSize="9"
                          fill="#94a3b8"
                          textAnchor="middle"
                          opacity={isHighlit ? 1 : 0.5}
                        >
                          {e.rps}rps
                        </text>
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {NODES.map((n) => {
                    const isSelected = n.id === selected;
                    const hasErr = n.errRate > 3;
                    return (
                      <g key={n.id} onClick={() => setSelected(isSelected ? null : n.id)} style={{ cursor: 'pointer' }}>
                        <rect
                          x={n.x} y={n.y} width={70} height={40} rx={6}
                          fill={isSelected ? '#1d4ed8' : hasErr ? '#fef2f2' : '#f8fafc'}
                          stroke={isSelected ? '#3b82f6' : hasErr ? '#f87171' : '#94a3b8'}
                          strokeWidth={isSelected ? 2 : 1}
                          opacity={selected && !isSelected ? 0.5 : 1}
                        />
                        <text x={n.x + 35} y={n.y + 14} fontSize="8.5" textAnchor="middle" fill={isSelected ? '#fff' : '#334155'} fontWeight="500">
                          {n.label.split('-')[0]}
                        </text>
                        <text x={n.x + 35} y={n.y + 26} fontSize="7.5" textAnchor="middle" fill={isSelected ? '#bfdbfe' : hasErr ? '#ef4444' : '#64748b'}>
                          {n.errRate > 0 ? `${n.errRate}% err` : `${n.rps} rps`}
                        </text>
                        {hasErr && (
                          <circle cx={n.x + 62} cy={n.y + 6} r={5} fill="#ef4444" />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </CardContent>
            </Card>

            {/* Side panel */}
            <div className="space-y-3">
              {selected ? (
                <>
                  {(() => {
                    const selNode = nodeMap[selected]!;
                    return (
                      <Card>
                        <CardHeader className="px-3 py-2">
                          <CardTitle className="text-sm">{selNode.label}</CardTitle>
                          <CardDescription className="text-xs capitalize">{selNode.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-3 pb-3 space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-muted rounded p-2">
                              <div className="text-muted-foreground">RPS</div>
                              <div className="font-semibold text-base">{selNode.rps}</div>
                            </div>
                            <div className={`rounded p-2 ${selNode.errRate > 5 ? 'bg-red-50 dark:bg-red-950/30' : 'bg-muted'}`}>
                              <div className="text-muted-foreground">Error rate</div>
                              <div className={`font-semibold text-base ${selNode.errRate > 5 ? 'text-red-500' : ''}`}>
                                {selNode.errRate}%
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                  <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Connections</div>
                  {selectedEdges.map((e) => {
                    const other = e.from === selected ? nodeMap[e.to]! : nodeMap[e.from]!;
                    const dir = e.from === selected ? '→' : '←';
                    return (
                      <Card key={`${e.from}-${e.to}`} className="text-xs">
                        <CardContent className="px-3 py-2 space-y-1">
                          <div className="flex items-center gap-1 font-medium">
                            <span className="text-muted-foreground">{dir}</span> {other.label}
                          </div>
                          <div className="flex gap-3 text-muted-foreground">
                            <span>{e.rps} rps</span>
                            <span>p99: {e.p99}ms</span>
                            <span className={e.errRate > 5 ? 'text-red-500 font-medium' : ''}>{e.errRate}% err</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-sm">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted rounded p-2"><div className="text-muted-foreground">Services</div><div className="font-semibold text-lg">{NODES.length}</div></div>
                        <div className="bg-muted rounded p-2"><div className="text-muted-foreground">Connections</div><div className="font-semibold text-lg">{EDGES.length}</div></div>
                      </div>
                      <Separator />
                      <div className="text-xs text-muted-foreground space-y-1">
                        {NODES.filter((n) => n.errRate > 3).map((n) => (
                          <div key={n.id} className="flex items-center gap-1.5 text-red-500">
                            <AlertCircle className="h-3 w-3" /> {n.label}: {n.errRate}% errors
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <p className="text-xs text-muted-foreground text-center">Click a node to inspect</p>
                </>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── METRICS EXPLORER ─────────────────────────────────────────────────────────

const METRIC_DATA: { time: string; p50: number; p90: number; p99: number; rps: number }[] = [
  { time: '00:00', p50: 42,  p90: 98,  p99: 210, rps: 312 },
  { time: '00:05', p50: 38,  p90: 88,  p99: 195, rps: 328 },
  { time: '00:10', p50: 55,  p90: 120, p99: 280, rps: 295 },
  { time: '00:15', p50: 71,  p90: 145, p99: 390, rps: 278 },
  { time: '00:20', p50: 89,  p90: 210, p99: 680, rps: 241 },
  { time: '00:25', p50: 122, p90: 380, p99: 940, rps: 198 },
  { time: '00:30', p50: 180, p90: 520, p99: 1240, rps: 160 },
  { time: '00:35', p50: 95,  p90: 230, p99: 720, rps: 210 },
  { time: '00:40', p50: 52,  p90: 110, p99: 240, rps: 290 },
  { time: '00:45', p50: 44,  p90: 95,  p99: 205, rps: 330 },
  { time: '00:50', p50: 40,  p90: 90,  p99: 198, rps: 345 },
  { time: '00:55', p50: 38,  p90: 85,  p99: 190, rps: 360 },
  { time: '01:00', p50: 36,  p90: 82,  p99: 185, rps: 378 },
];

const LATENCY_CONFIG: ChartConfig = {
  p50: { label: 'p50', color: 'var(--chart-2)' },
  p90: { label: 'p90', color: 'var(--chart-4)' },
  p99: { label: 'p99', color: 'var(--chart-5)' },
} satisfies ChartConfig;

const RPS_CONFIG: ChartConfig = {
  rps: { label: 'Requests/s', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export const MetricsExplorer: Story = {
  name: 'Metrics Explorer',
  render: function Render() {
    const [metric, setMetric] = useState('http_request_duration_seconds');
    const [service, setService] = useState('order-service');
    const [tab, setTab] = useState('latency');

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2"><Activity className="h-5 w-5" /> Metrics Explorer</h2>
                <p className="text-sm text-muted-foreground">Query and visualize Prometheus metrics</p>
              </div>
            </div>

            {/* Query bar */}
            <Card>
              <CardContent className="px-4 py-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-2.5 top-2 text-xs text-muted-foreground font-mono">PromQL</div>
                    <Input
                      className="pl-14 h-9 font-mono text-xs"
                      value={`histogram_quantile(0.99, rate(${metric}{service="${service}"}[5m]))`}
                      onChange={() => {}}
                    />
                  </div>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger className="w-40 h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button className="h-9 text-xs">Run query</Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Current p99', value: '185ms', trend: -8, good: true },
                { label: 'Peak p99 (1h)',  value: '1240ms', trend: null, good: false },
                { label: 'Avg RPS',    value: '292',    trend: +4,  good: true },
                { label: 'Error rate', value: '5.8%',   trend: +1.2, good: false },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="px-4 py-3">
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className={`text-2xl font-semibold mt-0.5 ${!stat.good ? 'text-red-500' : ''}`}>{stat.value}</div>
                    {stat.trend !== null && (
                      <div className={`text-xs mt-0.5 ${stat.good ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}% vs last hour
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="latency">Latency percentiles</TabsTrigger>
                <TabsTrigger value="rps">Throughput</TabsTrigger>
              </TabsList>
              <TabsContent value="latency" className="mt-3">
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-sm">Request latency (ms) — {service}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <ChartContainer config={LATENCY_CONFIG} className="h-[220px] w-full">
                      <AreaChart data={METRIC_DATA}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}ms`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area dataKey="p99" stroke="var(--color-p99)" fill="var(--color-p99)" fillOpacity={0.12} />
                        <Area dataKey="p90" stroke="var(--color-p90)" fill="var(--color-p90)" fillOpacity={0.12} />
                        <Area dataKey="p50" stroke="var(--color-p50)" fill="var(--color-p50)" fillOpacity={0.2} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="rps" className="mt-3">
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-sm">Throughput (req/s) — {service}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <ChartContainer config={RPS_CONFIG} className="h-[220px] w-full">
                      <AreaChart data={METRIC_DATA}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area dataKey="rps" stroke="var(--color-rps)" fill="var(--color-rps)" fillOpacity={0.2} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  },
};

// ─── EXPLORE TOOLBAR (full) ───────────────────────────────────────────────────

export const ExploreLayout: Story = {
  name: 'Explore Layout (full page)',
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    const [activePlugin, setActivePlugin] = useState('metrics');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const plugins = [
      { id: 'metrics', label: 'Metrics', icon: Activity },
      { id: 'logs',    label: 'Logs',    icon: GitBranch },
      { id: 'traces',  label: 'Traces',  icon: Clock },
      { id: 'profiles',label: 'Profiles',icon: Flame },
    ];

    const PANEL_CONTENT: Record<string, React.ReactNode> = {
      metrics: (
        <div className="space-y-4 p-4">
          <div className="flex gap-2">
            <Input className="flex-1 h-9 font-mono text-xs" placeholder="Enter PromQL query…" defaultValue='rate(http_requests_total{service="api-gateway"}[5m])' />
            <Button className="h-9 text-xs">Run</Button>
          </div>
          <ChartContainer config={RPS_CONFIG} className="h-[220px] w-full">
            <AreaChart data={METRIC_DATA}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area dataKey="rps" stroke="var(--color-rps)" fill="var(--color-rps)" fillOpacity={0.2} />
            </AreaChart>
          </ChartContainer>
        </div>
      ),
      logs: (
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <Input className="flex-1 h-9 font-mono text-xs" placeholder='Enter LogQL query… e.g. {service="api-gateway"} |= "error"' />
            <Button className="h-9 text-xs">Run</Button>
          </div>
          {LOG_ENTRIES.slice(0, 6).map((log) => (
            <div key={log.id} className="font-mono text-xs flex gap-3 border-b pb-2">
              <span className="text-muted-foreground">{log.ts.split(' ')[1]}</span>
              <LogLevelBadge level={log.level} />
              <span className="text-primary/80">{log.service}</span>
              <span>{log.msg}</span>
            </div>
          ))}
        </div>
      ),
      traces: (
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <Input className="flex-1 h-9 text-xs" placeholder="Search traces by service, trace ID, or operation…" />
            <Button className="h-9 text-xs">Search</Button>
          </div>
          {['abc123def456', 'bbb456eee789', 'ccc789fff012', 'ddd012aaa345'].map((id) => (
            <Card key={id}>
              <CardContent className="px-3 py-2 flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">{id}</span>
                <div className="flex gap-3">
                  <Badge variant="outline" className="text-[10px]">11 spans</Badge>
                  <span className="text-muted-foreground">980ms</span>
                  <Badge variant="destructive" className="text-[10px]">2 errors</Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-xs">View <ArrowRight className="h-3 w-3 ml-1" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
      profiles: (
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">CPU profiling — select a time range to view flame graph</p>
          <ChartContainer config={{ cpu: { label: 'CPU %', color: 'var(--chart-4)' } } satisfies ChartConfig} className="h-[140px] w-full">
            <AreaChart data={METRIC_DATA.map((d) => ({ ...d, cpu: Math.round(d.p90 / 10) }))}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area dataKey="cpu" stroke="var(--color-cpu)" fill="var(--color-cpu)" fillOpacity={0.3} />
            </AreaChart>
          </ChartContainer>
          <p className="text-xs text-muted-foreground mt-3 text-center">Drag on the chart to select a time window, then click "Load profile"</p>
        </div>
      ),
    };

    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Toolbar */}
        <div className="border-b px-4 py-2 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">Explore</span>
            <Select defaultValue="Last 1 hour">
              <SelectTrigger className="w-32 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 1 hour">Last 1 hour</SelectItem>
                <SelectItem value="Last 6 hours">Last 6 hours</SelectItem>
                <SelectItem value="Last 24 hours">Last 24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs"><RefreshCw className="h-3 w-3 mr-1" />Refresh</Button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Plugin tabs sidebar */}
          <div className={`flex flex-col border-r bg-card transition-all ${sidebarCollapsed ? 'w-10' : 'w-36'}`}>
            <div className="relative flex justify-end p-1">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 hover:bg-muted rounded">
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-90" />}
              </button>
            </div>
            {plugins.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePlugin(p.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${activePlugin === p.id ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{p.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <Card className="m-3">
              <ScrollArea className="h-[calc(100vh-120px)]">
                {PANEL_CONTENT[activePlugin]}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    );
  },
};

// ─── TIMELINE VIEW ────────────────────────────────────────────────────────────

type TimelineEventType = 'incident' | 'alert' | 'deploy' | 'change' | 'maintenance';

type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  service: string;
  startMin: number; // minutes from 00:00
  durationMin: number;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'resolved' | 'ongoing';
  tags: string[];
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'e1', type: 'incident', title: 'Payment gateway outage', service: 'payment-service',
    description: 'Stripe API returning ECONNREFUSED. 18% of payment requests failing.',
    startMin: 90, durationMin: 42, severity: 'critical', status: 'resolved',
    tags: ['P1', 'customer-impact', 'stripe'],
  },
  {
    id: 'e2', type: 'alert', title: 'p99 latency > 1s', service: 'order-service',
    description: 'order-service p99 latency exceeded 1000ms SLO threshold.',
    startMin: 85, durationMin: 55, severity: 'high', status: 'resolved',
    tags: ['SLO', 'latency'],
  },
  {
    id: 'e3', type: 'deploy', title: 'payment-service v2.4.1', service: 'payment-service',
    description: 'Rollout of payment-service v2.4.1 — updated Stripe SDK, retry logic changes.',
    startMin: 75, durationMin: 12, severity: undefined, status: 'resolved',
    tags: ['deploy', 'v2.4.1'],
  },
  {
    id: 'e4', type: 'alert', title: 'Error rate > 5%', service: 'api-gateway',
    description: 'API gateway 5xx error rate crossed 5% threshold (currently 8.4%).',
    startMin: 88, durationMin: 48, severity: 'high', status: 'resolved',
    tags: ['error-rate', 'SLO'],
  },
  {
    id: 'e5', type: 'change', title: 'DB connection pool: 50→100', service: 'db-primary',
    description: 'Increased max_connections from 50 to 100 to reduce queue wait times.',
    startMin: 132, durationMin: 2, severity: undefined, status: 'resolved',
    tags: ['config-change', 'db'],
  },
  {
    id: 'e6', type: 'alert', title: 'Slow query detected', service: 'db-primary',
    description: 'SELECT on orders table exceeding 500ms (observed 734ms).',
    startMin: 91, durationMin: 40, severity: 'medium', status: 'resolved',
    tags: ['slow-query', 'performance'],
  },
  {
    id: 'e7', type: 'maintenance', title: 'Redis cache flush', service: 'cache-layer',
    description: 'Scheduled maintenance: full cache eviction for schema migration.',
    startMin: 60, durationMin: 8, severity: undefined, status: 'resolved',
    tags: ['maintenance', 'cache'],
  },
  {
    id: 'e8', type: 'deploy', title: 'order-service v3.1.0', service: 'order-service',
    description: 'Rollout of order-service v3.1.0 — new inventory check logic.',
    startMin: 30, durationMin: 15, severity: undefined, status: 'resolved',
    tags: ['deploy', 'v3.1.0'],
  },
  {
    id: 'e9', type: 'incident', title: 'Auth service degraded', service: 'auth-service',
    description: 'JWT validation latency spike to 450ms (normal: 45ms). Cache miss storm.',
    startMin: 200, durationMin: 20, severity: 'medium', status: 'resolved',
    tags: ['P3', 'auth', 'cache-miss'],
  },
  {
    id: 'e10', type: 'alert', title: 'CPU throttling on payment pods', service: 'payment-service',
    description: '3 of 5 payment-service pods hitting CPU limits. Possible HPA needed.',
    startMin: 210, durationMin: 35, severity: 'medium', status: 'open',
    tags: ['cpu', 'k8s'],
  },
];

// Metric backdrop — error rate + p99 over the same window
const TIMELINE_METRICS: { t: string; errRate: number; p99: number }[] = [
  { t: '00:00', errRate: 0.3, p99: 95 },
  { t: '00:15', errRate: 0.4, p99: 102 },
  { t: '00:30', errRate: 0.6, p99: 120 },
  { t: '00:45', errRate: 0.8, p99: 145 },
  { t: '01:00', errRate: 1.2, p99: 210 },
  { t: '01:15', errRate: 5.8, p99: 680 },
  { t: '01:30', errRate: 8.4, p99: 1240 },
  { t: '01:45', errRate: 7.1, p99: 980 },
  { t: '02:00', errRate: 4.2, p99: 640 },
  { t: '02:15', errRate: 2.1, p99: 320 },
  { t: '02:30', errRate: 1.4, p99: 185 },
  { t: '02:45', errRate: 0.8, p99: 140 },
  { t: '03:00', errRate: 0.5, p99: 110 },
  { t: '03:15', errRate: 3.2, p99: 420 },
  { t: '03:30', errRate: 2.8, p99: 380 },
  { t: '03:45', errRate: 1.1, p99: 160 },
  { t: '04:00', errRate: 0.4, p99: 98 },
];

const TIMELINE_METRIC_CONFIG: ChartConfig = {
  errRate: { label: 'Error rate %', color: 'var(--chart-5)' },
  p99:     { label: 'p99 (ms)',     color: 'var(--chart-4)' },
} satisfies ChartConfig;

const EVENT_TYPE_CONFIG: Record<TimelineEventType, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  trackColor: string;
  dotColor: string;
}> = {
  incident:    { label: 'Incident',    icon: ShieldAlert,   trackColor: 'bg-red-400/80',    dotColor: 'bg-red-500' },
  alert:       { label: 'Alert',       icon: AlertTriangle, trackColor: 'bg-orange-400/80', dotColor: 'bg-orange-500' },
  deploy:      { label: 'Deploy',      icon: Rocket,        trackColor: 'bg-blue-400/80',   dotColor: 'bg-blue-500' },
  change:      { label: 'Change',      icon: Wrench,        trackColor: 'bg-purple-400/80', dotColor: 'bg-purple-500' },
  maintenance: { label: 'Maintenance', icon: Clock,         trackColor: 'bg-muted-foreground/60', dotColor: 'bg-muted-foreground' },
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300',
  high:     'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300',
  medium:   'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-300',
  low:      'bg-muted text-muted-foreground border-border',
};

const TOTAL_MINUTES = 240; // 4-hour window

const TIMELINE_PAGE_SIZE = 5;

export const TimelineView: Story = {
  name: 'Timeline View',
  render: function Render() {
    const [selected, setSelected] = useState<TimelineEvent | null>(null);
    const [typeFilter, setTypeFilter] = useState<TimelineEventType | 'all'>('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [eventPage, setEventPage] = useState(1);

    const services = [...new Set(TIMELINE_EVENTS.map((e) => e.service))].sort();

    const filtered = TIMELINE_EVENTS.filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (serviceFilter !== 'all' && e.service !== serviceFilter) return false;
      return true;
    });

    // Group events by service for swim-lane layout
    const lanes = services.map((svc) => ({
      service: svc,
      events: filtered.filter((e) => e.service === svc),
    })).filter((l) => l.events.length > 0 || serviceFilter === 'all');

    const allLanes = services.map((svc) => ({
      service: svc,
      events: filtered.filter((e) => e.service === svc),
    }));

    const minuteToPercent = (m: number) => (m / TOTAL_MINUTES) * 100;

    // Time axis labels every 30 min
    const timeLabels = Array.from({ length: 9 }, (_, i) => {
      const h = Math.floor((i * 30) / 60).toString().padStart(2, '0');
      const m = ((i * 30) % 60).toString().padStart(2, '0');
      return { label: `${h}:${m}`, pct: (i * 30 / TOTAL_MINUTES) * 100 };
    });

    return (
      <TooltipProvider>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-blue-500" /> Timeline View
              </h2>
              <p className="text-sm text-muted-foreground">
                Events, deployments &amp; incidents correlated with system metrics
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><RefreshCw className="h-3 w-3 mr-1" />Refresh</Button>
              <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" />Export</Button>
            </div>
          </div>

          {/* Summary stat chips */}
          <div className="flex gap-3 flex-wrap">
            {(Object.keys(EVENT_TYPE_CONFIG) as TimelineEventType[]).map((t) => {
              const count = TIMELINE_EVENTS.filter((e) => e.type === t).length;
              const cfg = EVENT_TYPE_CONFIG[t];
              const Icon = cfg.icon;
              return (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(typeFilter === t ? 'all' : t); setEventPage(1); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors ${typeFilter === t ? 'bg-foreground text-background border-foreground' : 'bg-card hover:bg-muted border-border'}`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{cfg.label}</span>
                  <span className="font-semibold">{count}</span>
                </button>
              );
            })}
            <Select value={serviceFilter} onValueChange={(v: string) => { setServiceFilter(v); setEventPage(1); }}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="All services" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Metric backdrop */}
          <Card>
            <CardHeader className="px-4 py-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">System health — error rate &amp; p99 latency</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <ChartContainer config={TIMELINE_METRIC_CONFIG} className="h-[90px] w-full">
                <AreaChart data={TIMELINE_METRICS} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="t" tick={{ fontSize: 9 }} />
                  <YAxis yAxisId="err" orientation="left"  tick={{ fontSize: 9 }} tickFormatter={(v) => `${v}%`} width={30} />
                  <YAxis yAxisId="lat" orientation="right" tick={{ fontSize: 9 }} tickFormatter={(v) => `${v}ms`} width={38} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area yAxisId="err" dataKey="errRate" stroke="var(--color-errRate)" fill="var(--color-errRate)" fillOpacity={0.15} />
                  <Area yAxisId="lat" dataKey="p99"     stroke="var(--color-p99)"     fill="var(--color-p99)"     fillOpacity={0.10} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Swim-lane timeline */}
          <Card className="overflow-hidden">
            <div className="relative">
              {/* Time axis header */}
              <div className="flex border-b bg-muted/30">
                <div className="w-36 flex-shrink-0 px-3 py-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wide border-r">
                  Service
                </div>
                <div className="flex-1 relative h-8">
                  {timeLabels.map(({ label, pct }) => (
                    <div
                      key={label}
                      className="absolute top-0 h-full flex flex-col items-center"
                      style={{ left: `${pct}%` }}
                    >
                      <div className="h-full border-l border-dashed border-border/60" />
                      <span className="absolute top-1.5 text-[10px] text-muted-foreground -translate-x-1/2 whitespace-nowrap font-mono">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lanes */}
              <ScrollArea className="max-h-[420px]">
                {allLanes.map(({ service: svc, events }) => (
                  <div key={svc} className="flex border-b last:border-b-0 min-h-[44px] group hover:bg-muted/10 transition-colors">
                    {/* Service label */}
                    <div className="w-36 flex-shrink-0 px-3 py-2 border-r flex items-center">
                      <span className="text-xs font-medium truncate text-muted-foreground group-hover:text-foreground transition-colors">
                        {svc}
                      </span>
                    </div>

                    {/* Event track */}
                    <div className="flex-1 relative py-2 min-h-[44px]">
                      {/* Grid lines */}
                      {timeLabels.map(({ label, pct }) => (
                        <div
                          key={label}
                          className="absolute top-0 bottom-0 border-l border-dashed border-border/30"
                          style={{ left: `${pct}%` }}
                        />
                      ))}

                      {events.map((evt) => {
                        const left = minuteToPercent(evt.startMin);
                        const width = Math.max(minuteToPercent(evt.durationMin), 0.5);
                        const cfg = EVENT_TYPE_CONFIG[evt.type];
                        const isSelected = selected?.id === evt.id;
                        return (
                          <button
                            key={evt.id}
                            onClick={() => setSelected(isSelected ? null : evt)}
                            className={`absolute top-1/2 -translate-y-1/2 h-6 rounded text-[10px] text-white font-medium px-1.5 flex items-center gap-1 overflow-hidden transition-all hover:brightness-110 hover:z-10 ${cfg.trackColor} ${isSelected ? 'ring-2 ring-foreground z-20' : ''}`}
                            style={{ left: `${left}%`, width: `${width}%`, minWidth: 6 }}
                            title={`${evt.title} · ${evt.startMin}min → ${evt.startMin + evt.durationMin}min`}
                          >
                            <span className="truncate">{evt.title}</span>
                          </button>
                        );
                      })}

                      {/* No events placeholder */}
                      {events.length === 0 && (
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-[11px] text-muted-foreground/40 italic">no events</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </Card>

          {/* Event detail panel */}
          {selected && (
            <Card className={`border-l-4 ${selected.type === 'incident' ? 'border-l-red-500' : selected.type === 'alert' ? 'border-l-orange-500' : selected.type === 'deploy' ? 'border-l-blue-500' : selected.type === 'change' ? 'border-l-purple-500' : 'border-l-border'}`}>
              <CardContent className="px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {(() => {
                        const cfg = EVENT_TYPE_CONFIG[selected.type];
                        const Icon = cfg.icon;
                        return <Icon className="h-4 w-4 text-muted-foreground" />;
                      })()}
                      <span className="font-semibold">{selected.title}</span>
                      {selected.severity && (
                        <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium uppercase ${SEVERITY_COLORS[selected.severity]}`}>
                          {selected.severity}
                        </span>
                      )}
                      <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${selected.status === 'open' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-300' : selected.status === 'ongoing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300'}`}>
                        {selected.status === 'resolved' ? '✓ resolved' : selected.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selected.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span><Server className="inline h-3 w-3 mr-1" />{selected.service}</span>
                      <span><Clock className="inline h-3 w-3 mr-1" />
                        {String(Math.floor(selected.startMin / 60)).padStart(2,'0')}:{String(selected.startMin % 60).padStart(2,'0')} →{' '}
                        {String(Math.floor((selected.startMin + selected.durationMin) / 60)).padStart(2,'0')}:{String((selected.startMin + selected.durationMin) % 60).padStart(2,'0')}
                        {' '}({selected.durationMin}m)
                      </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 bg-muted rounded-full border font-mono">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="h-7 text-xs">View logs</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">View traces</Button>
                    <button onClick={() => setSelected(null)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Event list (condensed) */}
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm">All events ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {(() => {
                const sorted = [...filtered].sort((a, b) => a.startMin - b.startMin);
                const totalPages = Math.ceil(sorted.length / TIMELINE_PAGE_SIZE);
                const paged = sorted.slice((eventPage - 1) * TIMELINE_PAGE_SIZE, eventPage * TIMELINE_PAGE_SIZE);
                return (
                  <>
                    <div className="text-xs">
                      {paged.map((evt) => {
                        const cfg = EVENT_TYPE_CONFIG[evt.type];
                        const Icon = cfg.icon;
                        const isSelected = selected?.id === evt.id;
                        return (
                          <button
                            key={evt.id}
                            onClick={() => setSelected(isSelected ? null : evt)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 text-left hover:bg-muted/40 transition-colors ${isSelected ? 'bg-muted/60' : ''}`}
                          >
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dotColor}`} />
                            <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="font-mono text-muted-foreground w-10 flex-shrink-0">
                              {String(Math.floor(evt.startMin / 60)).padStart(2,'0')}:{String(evt.startMin % 60).padStart(2,'0')}
                            </span>
                            <span className="font-medium flex-1 truncate">{evt.title}</span>
                            <span className="text-muted-foreground text-[11px] w-32 truncate">{evt.service}</span>
                            <span className="text-muted-foreground w-12 text-right">{evt.durationMin}m</span>
                            {evt.severity && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border w-16 text-center flex-shrink-0 ${SEVERITY_COLORS[evt.severity]}`}>
                                {evt.severity}
                              </span>
                            )}
                            <span className={`text-[10px] w-16 text-right flex-shrink-0 ${evt.status === 'open' ? 'text-red-500' : evt.status === 'ongoing' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {evt.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {totalPages > 1 && (
                      <div className="border-t py-2">
                        <PaginationBar page={eventPage} totalPages={totalPages} onPageChange={setEventPage} />
                      </div>
                    )}
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  },
};
