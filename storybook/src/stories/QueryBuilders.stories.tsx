import type { Meta, StoryObj } from '@storybook/react';
import { useState, useRef, useEffect } from 'react';
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
  Play,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
  Activity,
  Copy,
  History,
  Lightbulb,
  Search,
  X,
  RefreshCw,
  Table2,
  BarChart2,
} from 'lucide-react';

const meta: Meta = {
  title: 'Query Builders',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

// ─── PROMQL QUERY BUILDER ─────────────────────────────────────────────────────

type PromFilter = { label: string; op: '=' | '!=' | '=~' | '!~'; value: string };

type PromQlQuery = {
  metric: string;
  filters: PromFilter[];
  aggregation: string;
  by: string[];
  range: string;
  fn: string;
};

const METRICS = [
  'http_requests_total',
  'http_request_duration_seconds',
  'process_cpu_seconds_total',
  'process_resident_memory_bytes',
  'go_goroutines',
  'go_gc_duration_seconds',
  'up',
];

const LABEL_NAMES: Record<string, string[]> = {
  http_requests_total: ['service', 'method', 'status', 'path'],
  http_request_duration_seconds: ['service', 'method', 'status', 'quantile'],
  process_cpu_seconds_total: ['service', 'pid'],
  process_resident_memory_bytes: ['service', 'pid'],
  go_goroutines: ['service'],
  go_gc_duration_seconds: ['service', 'quantile'],
  up: ['job', 'instance'],
};

const LABEL_VALUES: Record<string, string[]> = {
  service: ['api-gateway', 'auth-service', 'order-service', 'payment-service', 'user-service', 'cache-layer'],
  method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  status: ['200', '201', '400', '401', '403', '404', '500', '502', '503', '504'],
  quantile: ['0.5', '0.9', '0.95', '0.99', '1'],
  job: ['kubernetes-pods', 'node-exporter'],
  instance: ['10.0.0.1:9090', '10.0.0.2:9090', '10.0.0.3:9090'],
};

const AGGREGATION_FNS = ['', 'sum', 'avg', 'max', 'min', 'count', 'stddev', 'topk'];
const RANGE_FNS = ['rate', 'irate', 'increase', 'delta', 'avg_over_time', 'max_over_time', 'min_over_time'];
const RANGES = ['1m', '5m', '10m', '15m', '30m', '1h', '6h', '24h'];

function buildPromQL(q: PromQlQuery): string {
  const filterStr = q.filters.length
    ? `{${q.filters.map((f) => `${f.label}${f.op}"${f.value}"`).join(', ')}}`
    : '';
  const selector = `${q.metric}${filterStr}`;
  const inner = q.fn && q.range ? `${q.fn}(${selector}[${q.range}])` : selector;
  if (q.aggregation) {
    const by = q.by.length ? ` by (${q.by.join(', ')})` : '';
    return `${q.aggregation}${by}(${inner})`;
  }
  return inner;
}

const PROMQL_PREVIEW: { time: string; v: number }[] = [
  { time: '14:00', v: 142 }, { time: '14:05', v: 168 }, { time: '14:10', v: 155 },
  { time: '14:15', v: 188 }, { time: '14:20', v: 172 }, { time: '14:25', v: 160 },
  { time: '14:30', v: 194 }, { time: '14:32', v: 185 },
];
const PROMQL_CONFIG: ChartConfig = { v: { label: 'Value', color: 'var(--chart-1)' } } satisfies ChartConfig;

const QUERY_HISTORY = [
  'rate(http_requests_total{service="api-gateway"}[5m])',
  'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{service="order-service"}[5m]))',
  'sum by (service) (rate(http_requests_total{status=~"5.."}[5m]))',
  'topk(5, sum by (service) (rate(http_requests_total[5m])))',
];

const SUGGESTIONS = [
  { label: 'Error rate', expr: 'sum by (service) (rate(http_requests_total{status=~"5.."}[5m]))' },
  { label: 'p99 latency', expr: 'histogram_quantile(0.99, sum by (le, service) (rate(http_request_duration_seconds_bucket[5m])))' },
  { label: 'RPS', expr: 'sum by (service) (rate(http_requests_total[5m]))' },
  { label: 'CPU usage', expr: 'sum by (service) (rate(process_cpu_seconds_total[5m]))' },
];

export const PromQLBuilder: Story = {
  name: 'PromQL Query Builder',
  render: function Render() {
    const [mode, setMode] = useState<'visual' | 'raw'>('visual');
    const [query, setQuery] = useState<PromQlQuery>({
      metric: 'http_requests_total',
      filters: [{ label: 'service', op: '=', value: 'api-gateway' }],
      aggregation: 'sum',
      by: ['service'],
      range: '5m',
      fn: 'rate',
    });
    const [rawExpr, setRawExpr] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [executed, setExecuted] = useState(true);

    const promql = buildPromQL(query);
    const displayExpr = mode === 'raw' ? rawExpr || promql : promql;

    const addFilter = () =>
      setQuery((q) => ({ ...q, filters: [...q.filters, { label: 'service', op: '=', value: '' }] }));

    const removeFilter = (i: number) =>
      setQuery((q) => ({ ...q, filters: q.filters.filter((_, idx) => idx !== i) }));

    const updateFilter = (i: number, patch: Partial<PromFilter>) =>
      setQuery((q) => ({ ...q, filters: q.filters.map((f, idx) => idx === i ? { ...f, ...patch } : f) }));

    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Activity className="h-5 w-5 text-blue-500" /> PromQL Builder</h2>
              <p className="text-sm text-muted-foreground">Visual query builder for Prometheus metrics</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
                <History className="h-3 w-3 mr-1" />History
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSuggestions(!showSuggestions)}>
                <Lightbulb className="h-3 w-3 mr-1" />Snippets
              </Button>
            </div>
          </div>

          {/* History drawer */}
          {showHistory && (
            <Card className="border-dashed">
              <CardHeader className="px-4 py-2">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Recent queries</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-1">
                {QUERY_HISTORY.map((h) => (
                  <button
                    key={h}
                    className="w-full text-left text-xs font-mono px-2 py-1.5 hover:bg-muted rounded truncate block"
                    onClick={() => { setMode('raw'); setRawExpr(h); setShowHistory(false); }}
                  >
                    {h}
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {showSuggestions && (
            <div className="flex gap-2 flex-wrap">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-muted transition-colors"
                  onClick={() => { setMode('raw'); setRawExpr(s.expr); setShowSuggestions(false); }}
                >
                  <Lightbulb className="inline h-3 w-3 mr-1 text-yellow-500" />{s.label}
                </button>
              ))}
            </div>
          )}

          <Tabs value={mode} onValueChange={(v: string) => setMode(v as 'visual' | 'raw')}>
            <TabsList className="h-8">
              <TabsTrigger value="visual" className="text-xs">Visual builder</TabsTrigger>
              <TabsTrigger value="raw" className="text-xs">Raw PromQL</TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="mt-3 space-y-4">
              {/* Metric selector */}
              <Card>
                <CardHeader className="px-4 py-2">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Metric</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <Select value={query.metric} onValueChange={(v: string) => setQuery((q) => ({ ...q, metric: v }))}>
                    <SelectTrigger className="h-9 font-mono text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {METRICS.map((m) => <SelectItem key={m} value={m} className="font-mono text-sm">{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader className="px-4 py-2 flex-row items-center justify-between">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Label filters</CardTitle>
                  <Button variant="outline" size="sm" className="h-6 text-xs" onClick={addFilter}><Plus className="h-3 w-3 mr-1" />Add</Button>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2">
                  {query.filters.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No filters — showing all time series</p>
                  )}
                  {query.filters.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Select value={f.label} onValueChange={(v: string) => updateFilter(i, { label: v })}>
                        <SelectTrigger className="h-8 text-xs w-36 font-mono"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(LABEL_NAMES[query.metric] ?? []).map((l) => <SelectItem key={l} value={l} className="font-mono text-xs">{l}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={f.op} onValueChange={(v: string) => updateFilter(i, { op: v as PromFilter['op'] })}>
                        <SelectTrigger className="h-8 text-xs w-14 font-mono"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(['=', '!=', '=~', '!~'] as const).map((op) => <SelectItem key={op} value={op} className="font-mono">{op}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={f.value} onValueChange={(v: string) => updateFilter(i, { value: v })}>
                        <SelectTrigger className="h-8 text-xs flex-1 font-mono"><SelectValue placeholder="select value…" /></SelectTrigger>
                        <SelectContent>
                          {(LABEL_VALUES[f.label] ?? []).map((v) => <SelectItem key={v} value={v} className="font-mono text-xs">{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeFilter(i)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Aggregation & range */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="px-4 py-2">
                    <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Function &amp; range</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 flex gap-2">
                    <Select value={query.fn} onValueChange={(v: string) => setQuery((q) => ({ ...q, fn: v }))}>
                      <SelectTrigger className="h-8 text-xs font-mono flex-1"><SelectValue placeholder="none" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">none</SelectItem>
                        {RANGE_FNS.map((f) => <SelectItem key={f} value={f} className="font-mono text-xs">{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={query.range} onValueChange={(v: string) => setQuery((q) => ({ ...q, range: v }))}>
                      <SelectTrigger className="h-8 text-xs w-20 font-mono"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {RANGES.map((r) => <SelectItem key={r} value={r} className="font-mono text-xs">[{r}]</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="px-4 py-2">
                    <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Aggregation</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 flex gap-2">
                    <Select value={query.aggregation} onValueChange={(v: string) => setQuery((q) => ({ ...q, aggregation: v }))}>
                      <SelectTrigger className="h-8 text-xs font-mono flex-1"><SelectValue placeholder="none" /></SelectTrigger>
                      <SelectContent>
                        {AGGREGATION_FNS.map((a) => <SelectItem key={a || 'none'} value={a} className="font-mono text-xs">{a || 'none'}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={query.by[0] ?? ''} onValueChange={(v: string) => setQuery((q) => ({ ...q, by: v ? [v] : [] }))}>
                      <SelectTrigger className="h-8 text-xs w-28 font-mono"><SelectValue placeholder="by (…)" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">no grouping</SelectItem>
                        {(LABEL_NAMES[query.metric] ?? []).map((l) => <SelectItem key={l} value={l} className="font-mono text-xs">{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="raw" className="mt-3">
              <div className="relative">
                <textarea
                  className="w-full h-28 px-3 py-2 font-mono text-sm border rounded-md bg-card resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  value={rawExpr || promql}
                  onChange={(e) => setRawExpr(e.target.value)}
                  spellCheck={false}
                />
                <Button
                  variant="ghost" size="sm"
                  className="absolute top-2 right-2 h-6 text-xs"
                  onClick={() => navigator.clipboard?.writeText(rawExpr || promql)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Generated expression */}
          <Card className="bg-muted/30">
            <CardContent className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <code className="text-xs font-mono text-blue-600 dark:text-blue-400 flex-1 break-all">{displayExpr}</code>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => navigator.clipboard?.writeText(displayExpr)}>
                    <Copy className="h-3 w-3 mr-1" />Copy
                  </Button>
                  <Button size="sm" className="h-7 text-xs" onClick={() => setExecuted(true)}>
                    <Play className="h-3 w-3 mr-1" />Run
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results chart */}
          {executed && (
            <Card>
              <CardHeader className="px-4 py-3 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Query results</CardTitle>
                  <CardDescription className="text-xs">Last 32 minutes · 8 data points · 1 series</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs"><Table2 className="h-3 w-3 mr-1" />Table</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs bg-muted"><BarChart2 className="h-3 w-3 mr-1" />Chart</Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ChartContainer config={PROMQL_CONFIG} className="h-[180px] w-full">
                  <AreaChart data={PROMQL_PREVIEW}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="v" stroke="var(--color-v)" fill="var(--color-v)" fillOpacity={0.2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </TooltipProvider>
    );
  },
};

// ─── SQL QUERY BUILDER ────────────────────────────────────────────────────────

type SqlColumn = { name: string; type: string; selected: boolean; alias: string };
type SqlFilter = { column: string; op: string; value: string; conjunction: 'AND' | 'OR' };
type SqlOrder = { column: string; dir: 'ASC' | 'DESC' };

const SQL_TABLES: Record<string, SqlColumn[]> = {
  spans: [
    { name: 'trace_id',    type: 'String',  selected: true,  alias: '' },
    { name: 'span_id',     type: 'String',  selected: true,  alias: '' },
    { name: 'service',     type: 'String',  selected: true,  alias: '' },
    { name: 'operation',   type: 'String',  selected: true,  alias: '' },
    { name: 'start_time',  type: 'DateTime',selected: true,  alias: '' },
    { name: 'duration_ms', type: 'Int64',   selected: true,  alias: 'duration' },
    { name: 'status',      type: 'String',  selected: false, alias: '' },
    { name: 'http_method', type: 'String',  selected: false, alias: '' },
    { name: 'http_url',    type: 'String',  selected: false, alias: '' },
    { name: 'error',       type: 'Boolean', selected: false, alias: '' },
    { name: 'parent_id',   type: 'String',  selected: false, alias: '' },
  ],
  logs: [
    { name: 'timestamp',   type: 'DateTime',selected: true,  alias: '' },
    { name: 'level',       type: 'String',  selected: true,  alias: '' },
    { name: 'service',     type: 'String',  selected: true,  alias: '' },
    { name: 'message',     type: 'String',  selected: true,  alias: '' },
    { name: 'trace_id',    type: 'String',  selected: false, alias: '' },
    { name: 'span_id',     type: 'String',  selected: false, alias: '' },
    { name: 'host',        type: 'String',  selected: false, alias: '' },
    { name: 'pod',         type: 'String',  selected: false, alias: '' },
    { name: 'namespace',   type: 'String',  selected: false, alias: '' },
  ],
  metrics: [
    { name: 'timestamp',   type: 'DateTime',selected: true,  alias: '' },
    { name: 'metric_name', type: 'String',  selected: true,  alias: '' },
    { name: 'service',     type: 'String',  selected: true,  alias: '' },
    { name: 'value',       type: 'Float64', selected: true,  alias: '' },
    { name: 'labels',      type: 'Map',     selected: false, alias: '' },
  ],
};

const SQL_FILTER_OPS = ['=', '!=', '>', '>=', '<', '<=', 'LIKE', 'IN', 'IS NULL', 'IS NOT NULL', 'BETWEEN'];

function buildSQL(
  table: string,
  columns: SqlColumn[],
  filters: SqlFilter[],
  groupBy: string[],
  orderBy: SqlOrder[],
  limit: number
): string {
  const sel = columns.filter((c) => c.selected).map((c) => c.alias ? `${c.name} AS ${c.alias}` : c.name);
  const lines: string[] = [`SELECT\n  ${sel.join(',\n  ')}`];
  lines.push(`FROM ${table}`);
  if (filters.length) {
    const where = filters.map((f, i) => {
      const conj = i === 0 ? 'WHERE' : f.conjunction;
      return `${conj} ${f.column} ${f.op} '${f.value}'`;
    });
    lines.push(where.join('\n'));
  }
  if (groupBy.length) lines.push(`GROUP BY ${groupBy.join(', ')}`);
  if (orderBy.length) lines.push(`ORDER BY ${orderBy.map((o) => `${o.column} ${o.dir}`).join(', ')}`);
  if (limit) lines.push(`LIMIT ${limit}`);
  return lines.join('\n');
}

const SQL_RESULT_COLS = ['trace_id', 'service', 'operation', 'start_time', 'duration'];
const SQL_RESULTS = [
  { trace_id: 'abc123de', service: 'payment-service', operation: 'stripe.create_charge', start_time: '14:32:01.582', duration: 180 },
  { trace_id: 'abc123de', service: 'order-service',   operation: 'order.create',          start_time: '14:32:01.135', duration: 750 },
  { trace_id: 'bbb456ee', service: 'db-primary',      operation: 'db.query orders',        start_time: '14:31:59.145', duration: 320 },
  { trace_id: 'ccc789ff', service: 'payment-service', operation: 'fraud.check',            start_time: '14:31:52.550', duration: 28 },
  { trace_id: 'ddd012aa', service: 'user-service',    operation: 'user.get_profile',       start_time: '14:31:51.475', duration: 60 },
];

const SQL_HISTOGRAM_CONFIG: ChartConfig = {
  count: { label: 'Span count', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const SQL_HISTOGRAM = [
  { bucket: '0-10ms', count: 1820 }, { bucket: '10-50ms', count: 3240 },
  { bucket: '50-100ms', count: 1560 }, { bucket: '100-250ms', count: 820 },
  { bucket: '250-500ms', count: 340 }, { bucket: '500ms-1s', count: 180 },
  { bucket: '1s-5s', count: 62 }, { bucket: '>5s', count: 14 },
];

const SQL_PAGE_SIZE = 3;

export const SQLBuilder: Story = {
  name: 'SQL Query Builder',
  render: function Render() {
    const [table, setTable] = useState('spans');
    const [columns, setColumns] = useState<SqlColumn[]>(SQL_TABLES['spans']!);
    const [filters, setFilters] = useState<SqlFilter[]>([
      { column: 'duration_ms', op: '>', value: '100', conjunction: 'AND' },
      { column: 'service', op: '=', value: 'payment-service', conjunction: 'AND' },
    ]);
    const [groupBy] = useState<string[]>([]);
    const [orderBy] = useState<SqlOrder[]>([{ column: 'duration_ms', dir: 'DESC' }]);
    const [limit] = useState(100);
    const [showRaw, setShowRaw] = useState(false);
    const [activeTab, setActiveTab] = useState('table');
    const [resultPage, setResultPage] = useState(1);

    const sql = buildSQL(table, columns, filters, groupBy, orderBy, limit);

    const toggleColumn = (name: string) =>
      setColumns((cs) => cs.map((c) => c.name === name ? { ...c, selected: !c.selected } : c));

    const switchTable = (t: string) => {
      setTable(t);
      setColumns(SQL_TABLES[t] ?? []);
    };

    const addFilter = () =>
      setFilters((fs) => [...fs, { column: columns[0]?.name ?? '', op: '=', value: '', conjunction: 'AND' }]);

    const removeFilter = (i: number) => setFilters((fs) => fs.filter((_, idx) => idx !== i));

    const updateFilter = (i: number, patch: Partial<SqlFilter>) =>
      setFilters((fs) => fs.map((f, idx) => idx === i ? { ...f, ...patch } : f));

    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Database className="h-5 w-5 text-orange-500" /> SQL Query Builder</h2>
              <p className="text-sm text-muted-foreground">Visual SQL builder for ClickHouse / observability data</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowRaw(!showRaw)}>
                {showRaw ? 'Hide SQL' : 'Show SQL'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-[220px_1fr] gap-4">
            {/* Left: table browser */}
            <div className="space-y-3">
              <Card>
                <CardHeader className="px-3 py-2">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Table</CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-2 space-y-1">
                  {Object.keys(SQL_TABLES).map((t) => (
                    <button
                      key={t}
                      onClick={() => switchTable(t)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded flex items-center gap-2 transition-colors ${table === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      <Database className="h-3 w-3 flex-shrink-0" />
                      <span className="font-mono">{t}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-3 py-2">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Columns</CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-0.5">
                      {columns.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => toggleColumn(c.name)}
                          className={`w-full text-left text-xs px-2 py-1.5 rounded flex items-center gap-2 transition-colors hover:bg-muted ${c.selected ? 'font-medium' : 'opacity-60'}`}
                        >
                          <div className={`w-2 h-2 rounded-sm border flex-shrink-0 ${c.selected ? 'bg-primary border-primary' : 'border-border'}`} />
                          <span className="font-mono flex-1 truncate">{c.name}</span>
                          <span className="text-muted-foreground text-[10px]">{c.type}</span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right: builder */}
            <div className="space-y-3">
              {/* Filters */}
              <Card>
                <CardHeader className="px-4 py-2 flex-row items-center justify-between">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">WHERE</CardTitle>
                  <Button variant="outline" size="sm" className="h-6 text-xs" onClick={addFilter}><Plus className="h-3 w-3 mr-1" />Add condition</Button>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2">
                  {filters.length === 0 && <p className="text-xs text-muted-foreground italic">No filters — all rows returned</p>}
                  {filters.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      {i > 0 && (
                        <Select value={f.conjunction} onValueChange={(v: string) => updateFilter(i, { conjunction: v as 'AND' | 'OR' })}>
                          <SelectTrigger className="h-8 w-16 text-xs font-mono"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND" className="font-mono text-xs">AND</SelectItem>
                            <SelectItem value="OR" className="font-mono text-xs">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {i === 0 && <span className="text-xs text-muted-foreground w-16 text-center">WHERE</span>}
                      <Select value={f.column} onValueChange={(v: string) => updateFilter(i, { column: v })}>
                        <SelectTrigger className="h-8 text-xs w-36 font-mono"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {columns.map((c) => <SelectItem key={c.name} value={c.name} className="font-mono text-xs">{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={f.op} onValueChange={(v: string) => updateFilter(i, { op: v })}>
                        <SelectTrigger className="h-8 text-xs w-24 font-mono"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SQL_FILTER_OPS.map((op) => <SelectItem key={op} value={op} className="font-mono text-xs">{op}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input
                        className="h-8 text-xs font-mono flex-1"
                        value={f.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter(i, { value: e.target.value })}
                        placeholder="value…"
                      />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeFilter(i)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Generated SQL */}
              {showRaw && (
                <Card className="bg-muted/30">
                  <CardContent className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <pre className="text-xs font-mono text-foreground flex-1 whitespace-pre-wrap">{sql}</pre>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 flex-shrink-0" onClick={() => navigator.clipboard?.writeText(sql)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Run button */}
              <div className="flex items-center gap-3">
                <Button className="h-9">
                  <Play className="h-3 w-3 mr-1" />Run query
                </Button>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>5 rows · 42ms</span>
                </div>
              </div>

              {/* Results */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-8">
                  <TabsTrigger value="table" className="text-xs"><Table2 className="h-3 w-3 mr-1" />Table</TabsTrigger>
                  <TabsTrigger value="chart" className="text-xs"><BarChart2 className="h-3 w-3 mr-1" />Distribution</TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="mt-3">
                  {(() => {
                    const totalPages = Math.ceil(SQL_RESULTS.length / SQL_PAGE_SIZE);
                    const paged = SQL_RESULTS.slice((resultPage - 1) * SQL_PAGE_SIZE, resultPage * SQL_PAGE_SIZE);
                    return (
                      <Card className="overflow-hidden">
                        <div className="text-xs">
                          <div
                            className="grid border-b bg-muted/50 px-3 py-1.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wide"
                            style={{ gridTemplateColumns: `repeat(${SQL_RESULT_COLS.length}, 1fr)` }}
                          >
                            {SQL_RESULT_COLS.map((c) => <span key={c}>{c}</span>)}
                          </div>
                          {paged.map((row, i) => (
                            <div
                              key={i}
                              className="grid border-b last:border-b-0 px-3 py-2 hover:bg-muted/30 font-mono"
                              style={{ gridTemplateColumns: `repeat(${SQL_RESULT_COLS.length}, 1fr)` }}
                            >
                              <span className="text-muted-foreground truncate">{row.trace_id}</span>
                              <span className="text-primary/80 truncate">{row.service}</span>
                              <span className="truncate">{row.operation}</span>
                              <span className="text-muted-foreground">{row.start_time}</span>
                              <span className={row.duration > 200 ? 'text-red-500 font-medium' : row.duration > 100 ? 'text-yellow-600' : ''}>
                                {row.duration}ms
                              </span>
                            </div>
                          ))}
                        </div>
                        {totalPages > 1 && (
                          <div className="border-t py-2">
                            <PaginationBar page={resultPage} totalPages={totalPages} onPageChange={setResultPage} />
                          </div>
                        )}
                      </Card>
                    );
                  })()}
                </TabsContent>

                <TabsContent value="chart" className="mt-3">
                  <Card>
                    <CardHeader className="px-4 py-3">
                      <CardTitle className="text-sm">Duration distribution (spans matching filters)</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <ChartContainer config={SQL_HISTOGRAM_CONFIG} className="h-[200px] w-full">
                        <BarChart data={SQL_HISTOGRAM}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="bucket" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={40} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="var(--color-count)" radius={[3,3,0,0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── COMBINED QUERY EXPLORER ──────────────────────────────────────────────────

export const QueryExplorer: Story = {
  name: 'Combined Query Explorer',
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    const [activeQuery, setActiveQuery] = useState<'promql' | 'sql' | 'logql'>('promql');
    const [queryText, setQueryText] = useState({
      promql: 'rate(http_requests_total{service="api-gateway"}[5m])',
      sql: 'SELECT service, COUNT(*) AS spans, AVG(duration_ms) AS avg_dur\nFROM spans\nWHERE timestamp >= now() - INTERVAL 1 HOUR\nGROUP BY service\nORDER BY avg_dur DESC\nLIMIT 20',
      logql: '{service="payment-service"} |= "error" | json | duration > 100ms',
    });

    const SAVED = [
      { name: 'Error rate by service', type: 'promql', q: 'sum by (service) (rate(http_requests_total{status=~"5.."}[5m]))' },
      { name: 'Slow spans (>500ms)', type: 'sql', q: 'SELECT * FROM spans WHERE duration_ms > 500 ORDER BY duration_ms DESC LIMIT 100' },
      { name: 'Payment errors', type: 'logql', q: '{service="payment-service"} |= "error"' },
      { name: 'p99 latency', type: 'promql', q: 'histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))' },
    ];

    const TYPE_COLORS: Record<string, string> = {
      promql: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
      sql: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
      logql: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    };

    return (
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div className="w-56 border-r flex flex-col bg-card">
          <div className="px-3 py-3 border-b">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Search className="h-4 w-4" />Query Explorer
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-2 py-2">
              <div className="text-[11px] text-muted-foreground uppercase font-medium px-2 py-1">Saved Queries</div>
              {SAVED.map((s) => (
                <button
                  key={s.name}
                  className="w-full text-left px-2 py-2 rounded text-xs hover:bg-muted transition-colors space-y-1"
                  onClick={() => {
                    setActiveQuery(s.type as 'promql' | 'sql' | 'logql');
                    setQueryText((q) => ({ ...q, [s.type]: s.q }));
                  }}
                >
                  <div className="font-medium truncate">{s.name}</div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${TYPE_COLORS[s.type]}`}>{s.type}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="p-2 border-t">
            <Button variant="outline" size="sm" className="w-full text-xs h-8">
              <Plus className="h-3 w-3 mr-1" />New query
            </Button>
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Query type tabs */}
          <div className="border-b px-4 py-0 flex items-end gap-0">
            {(['promql', 'sql', 'logql'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveQuery(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors uppercase tracking-wide ${activeQuery === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-shrink-0 p-4 border-b">
            <div className="relative">
              <textarea
                className="w-full h-28 px-3 py-2 font-mono text-sm border rounded-md bg-card resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={queryText[activeQuery]}
                onChange={(e) => setQueryText((q) => ({ ...q, [activeQuery]: e.target.value }))}
                spellCheck={false}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />Format
                </Button>
                <Button size="sm" className="h-7 text-xs">
                  <Play className="h-3 w-3 mr-1" />Run
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-auto p-4">
            {activeQuery === 'promql' && (
              <Card>
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm">Timeseries — api-gateway RPS</CardTitle>
                  <CardDescription className="text-xs">8 data points · 1 series</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ChartContainer config={PROMQL_CONFIG} className="h-[200px] w-full">
                    <AreaChart data={PROMQL_PREVIEW}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area dataKey="v" stroke="var(--color-v)" fill="var(--color-v)" fillOpacity={0.2} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
            {activeQuery === 'sql' && (
              <Card>
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm">Result set — 7 rows · 38ms</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="text-xs">
                    <div className="grid grid-cols-3 border-b bg-muted/50 px-4 py-1.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                      <span>service</span><span>spans</span><span>avg_dur</span>
                    </div>
                    {[
                      ['payment-service', 1948, '342ms'], ['db-primary', 3102, '218ms'],
                      ['order-service', 2108, '156ms'], ['user-service', 3410, '42ms'],
                      ['auth-service', 3802, '38ms'], ['api-gateway', 4201, '22ms'],
                      ['cache-layer', 8910, '8ms'],
                    ].map(([svc, cnt, dur]) => (
                      <div key={String(svc)} className="grid grid-cols-3 border-b last:border-b-0 px-4 py-2 hover:bg-muted/30 font-mono">
                        <span className="text-primary/80">{svc}</span>
                        <span>{cnt}</span>
                        <span className={String(dur).replace('ms','') > '200' ? 'text-red-500' : ''}>{dur}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {activeQuery === 'logql' && (
              <Card>
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm">Log stream — 3 lines matching</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="font-mono text-xs">
                    {[
                      { ts: '14:32:01', msg: 'Payment gateway connection refused: EOF', level: 'error' },
                      { ts: '14:31:50', msg: 'Fraud check service unavailable (degraded_mode)', level: 'error' },
                      { ts: '14:30:12', msg: 'Stripe webhook delivery failed: timeout after 30s', level: 'error' },
                    ].map((l) => (
                      <div key={l.ts} className="flex gap-3 border-b last:border-b-0 px-4 py-2 hover:bg-muted/30">
                        <span className="text-muted-foreground w-20">{l.ts}</span>
                        <span className="text-red-500 w-12">{l.level}</span>
                        <span>{l.msg}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  },
};
