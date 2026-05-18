import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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
  Label,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@perses-dev/components';
import {
  CalculationSelector,
  LegendOptionsEditor,
  SelectionOptionsEditor,
  OptionsEditorTabs,
  VariablePreview,
  TimeRangeControls,
  TimeRangeProvider,
} from '@perses-dev/plugin-system';
import type { LegendSpecOptions } from '@perses-dev/plugin-system';
import type { CalculationType } from '@perses-dev/plugin-system';

const meta: Meta = {
  title: 'Plugin System/Components',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

// ─── Shared QueryClient for stories that need react-query ────────────────────

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

// ─── CalculationSelector ─────────────────────────────────────────────────────

export const CalculationSelectorStory: Story = {
  name: 'CalculationSelector',
  render: function Render() {
    const [calc, setCalc] = useState<CalculationType>('last');
    return (
      <TooltipProvider>
        <div className="p-6 space-y-6 max-w-xl">
          <div>
            <h2 className="text-lg font-semibold mb-1">CalculationSelector</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Dropdown that lets users pick an aggregation / calculation type (last, mean, sum, etc.)
            </p>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Default state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CalculationSelector value={calc} onChange={setCalc} />
              <div className="flex items-center gap-2 mt-2">
                <Label className="text-xs text-muted-foreground">Selected:</Label>
                <Badge variant="secondary" className="font-mono text-xs">{calc}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">All calculation types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(['last', 'first', 'mean', 'sum', 'min', 'max'] as CalculationType[]).map((c) => (
                  <Button
                    key={c}
                    variant={calc === c ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs font-mono"
                    onClick={() => setCalc(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Click a type above to pre-select it in the selector.
              </p>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── LegendOptionsEditor ─────────────────────────────────────────────────────

export const LegendOptionsEditorStory: Story = {
  name: 'LegendOptionsEditor',
  render: function Render() {
    const [legend, setLegend] = useState<LegendSpecOptions | undefined>({
      position: 'bottom',
      mode: 'list',
    });
    return (
      <TooltipProvider>
        <div className="p-6 space-y-6 max-w-xl">
          <div>
            <h2 className="text-lg font-semibold mb-1">LegendOptionsEditor</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Controls legend visibility, position (top/bottom), mode (list/table), size, and values.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <LegendOptionsEditor value={legend} onChange={setLegend} />
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Current value</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-muted rounded p-3 whitespace-pre-wrap break-all">
                  {JSON.stringify(legend, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>

          <Separator />
          <div className="space-y-4">
            <p className="text-sm font-semibold">Table mode (shows Size + Values)</p>
            <LegendOptionsEditor
              value={{ position: 'right', mode: 'table', size: 'medium', values: ['mean', 'last'] }}
              onChange={() => {}}
              showValuesEditor={true}
            />
          </div>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── SelectionOptionsEditor ──────────────────────────────────────────────────

export const SelectionOptionsEditorStory: Story = {
  name: 'SelectionOptionsEditor',
  render: function Render() {
    const [selection, setSelection] = useState<{ enabled?: boolean } | undefined>(undefined);
    return (
      <TooltipProvider>
        <div className="p-6 space-y-6 max-w-xl">
          <div>
            <h2 className="text-lg font-semibold mb-1">SelectionOptionsEditor</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Toggle that enables item selection in panels (used for drill-down / action flows).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <SelectionOptionsEditor value={selection} onChange={setSelection} />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Current value</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-muted rounded p-3">
                  {JSON.stringify(selection ?? null, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── OptionsEditorTabs ───────────────────────────────────────────────────────

export const OptionsEditorTabsStory: Story = {
  name: 'OptionsEditorTabs',
  render: function Render() {
    const [calc, setCalc] = useState<CalculationType>('last');
    const [legend, setLegend] = useState<LegendSpecOptions | undefined>({ position: 'bottom' });
    const [selection, setSelection] = useState<{ enabled?: boolean } | undefined>(undefined);

    return (
      <TooltipProvider>
        <div className="p-6 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-semibold mb-1">OptionsEditorTabs</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tabbed panel settings layout used in the panel options sidebar. Each tab holds a group of editors.
            </p>
          </div>

          <Card>
            <CardContent className="pt-4 pb-6">
              <OptionsEditorTabs
                tabs={[
                  {
                    label: 'Query',
                    content: (
                      <div className="p-3 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs">PromQL Expression</Label>
                          <Input
                            defaultValue="rate(http_requests_total{job='api-server'}[5m])"
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Legend format</Label>
                          <Input defaultValue="{{service}} — {{method}}" className="h-8 text-xs" />
                        </div>
                        <CalculationSelector value={calc} onChange={setCalc} />
                      </div>
                    ),
                  },
                  {
                    label: 'Display',
                    content: (
                      <div className="p-3 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Unit</Label>
                          <Select defaultValue="short">
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short" className="text-xs">Short</SelectItem>
                              <SelectItem value="bytes" className="text-xs">Bytes</SelectItem>
                              <SelectItem value="percent" className="text-xs">Percent</SelectItem>
                              <SelectItem value="ms" className="text-xs">Milliseconds</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <LegendOptionsEditor value={legend} onChange={setLegend} showValuesEditor={false} />
                      </div>
                    ),
                  },
                  {
                    label: 'Interactions',
                    content: (
                      <div className="p-3 space-y-4">
                        <SelectionOptionsEditor value={selection} onChange={setSelection} />
                        <div className="text-xs text-muted-foreground pt-1">
                          Enable selection to allow drill-down and item actions in this panel.
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── VariablePreview ─────────────────────────────────────────────────────────

export const VariablePreviewStory: Story = {
  name: 'VariablePreview',
  render: function Render() {
    const MOCK_VALUES = [
      'api-server', 'auth-service', 'cache-layer', 'data-pipeline', 'notifier',
      'scheduler', 'gateway', 'metrics-collector', 'log-aggregator', 'alertmanager',
      'prometheus', 'grafana', 'loki', 'tempo', 'mimir',
      'node-exporter', 'kube-state-metrics', 'cadvisor', 'blackbox-exporter', 'pushgateway',
      'thanos-query', 'thanos-store', 'thanos-compact', 'thanos-receive', 'thanos-rule',
      'cortex-distributor', 'cortex-ingester', 'cortex-querier', 'cortex-ruler', 'cortex-alertmanager',
    ];

    return (
      <TooltipProvider>
        <div className="p-6 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-semibold mb-1">VariablePreview</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Shows a paginated badge list of resolved variable values. Includes copy-to-clipboard and "show all" toggle.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Loaded values (30 items, paginated to 50)</CardTitle>
              </CardHeader>
              <CardContent>
                <VariablePreview values={MOCK_VALUES} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Loading state</CardTitle>
              </CardHeader>
              <CardContent>
                <VariablePreview isLoading={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Error state</CardTitle>
              </CardHeader>
              <CardContent>
                <VariablePreview error="failed to execute query: context deadline exceeded (10s)" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Empty state</CardTitle>
              </CardHeader>
              <CardContent>
                <VariablePreview values={[]} />
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    );
  },
};

// ─── TimeRangeControls ───────────────────────────────────────────────────────

function TimeRangeStoryWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  const [timeRange, setTimeRange] = useState({ pastDuration: '1h' as const });
  const [refreshInterval, setRefreshInterval] = useState<string>('0s');

  return (
    <QueryClientProvider client={queryClient}>
      <TimeRangeProvider
        timeRange={timeRange}
        refreshInterval={refreshInterval as any}
        setTimeRange={setTimeRange as any}
        setRefreshInterval={setRefreshInterval as any}
      >
        {children}
      </TimeRangeProvider>
    </QueryClientProvider>
  );
}

export const TimeRangeControlsStory: Story = {
  name: 'TimeRangeControls',
  render: function Render() {
    return (
      <TooltipProvider>
        <TimeRangeStoryWrapper>
          <div className="p-6 space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-semibold mb-1">TimeRangeControls</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Toolbar with time-range selector, zoom in/out buttons, refresh button, and interval picker.
                Used in the explore view and dashboard toolbar.
              </p>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Full toolbar</CardTitle>
                <CardDescription className="text-xs">All controls visible</CardDescription>
              </CardHeader>
              <CardContent>
                <TimeRangeControls timeZone="local" onTimeZoneChange={() => {}} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Time range selector only</CardTitle>
                <CardDescription className="text-xs">No zoom or refresh controls</CardDescription>
              </CardHeader>
              <CardContent>
                <TimeRangeControls
                  timeZone="local"
                  onTimeZoneChange={() => {}}
                  showZoomButtons={false}
                  showRefreshButton={false}
                  showRefreshInterval={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Compact height (28px)</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeRangeControls
                  timeZone="UTC"
                  onTimeZoneChange={() => {}}
                  heightPx={28}
                />
              </CardContent>
            </Card>
          </div>
        </TimeRangeStoryWrapper>
      </TooltipProvider>
    );
  },
};

// ─── Full Panel Options Editor ────────────────────────────────────────────────

export const PanelOptionsEditor: Story = {
  name: 'Full Panel Options Editor',
  render: function Render() {
    const [calc, setCalc] = useState<CalculationType>('last');
    const [legend, setLegend] = useState<LegendSpecOptions | undefined>({ position: 'bottom', mode: 'list' });
    const [selection, setSelection] = useState<{ enabled?: boolean } | undefined>(undefined);
    const [title, setTitle] = useState('HTTP Request Rate');
    const [desc, setDesc] = useState('rate(http_requests_total[5m]) by (service)');

    return (
      <TooltipProvider>
        <div className="p-6 max-w-2xl">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Full Panel Options Editor</h2>
            <p className="text-sm text-muted-foreground">
              Assembled panel editor using OptionsEditorTabs + all option editors together,
              as it would appear in the panel settings sidebar.
            </p>
          </div>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">Panel Settings</CardTitle>
              <CardDescription className="text-xs">Configure queries, display, and interactions</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <OptionsEditorTabs
                tabs={[
                  {
                    label: 'General',
                    content: (
                      <div className="space-y-3 p-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Panel Title</Label>
                          <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Description</Label>
                          <Input
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: 'Visualization',
                    content: (
                      <div className="space-y-3 p-2">
                        <CalculationSelector value={calc} onChange={setCalc} />
                        <Separator />
                        <LegendOptionsEditor value={legend} onChange={setLegend} showValuesEditor />
                      </div>
                    ),
                  },
                  {
                    label: 'Interactions',
                    content: (
                      <div className="space-y-3 p-2">
                        <SelectionOptionsEditor value={selection} onChange={setSelection} />
                      </div>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">Resolved settings</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-muted rounded p-3 whitespace-pre-wrap">
                {JSON.stringify({ title, description: desc, calculation: calc, legend, selection }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  },
};
