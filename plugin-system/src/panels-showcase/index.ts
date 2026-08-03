import type { PanelPlugin } from '../model';
import { GeoMapPanel } from './GeoMapPanel';
import { LogsPanel } from './LogsPanel';
import { TablePanel } from './TablePanel';
import { TopologyPanel } from './TopologyPanel';
import { TracePanel } from './TracePanel';

export { GeoMapPanel } from './GeoMapPanel';
export { LogsPanel } from './LogsPanel';
export { TablePanel } from './TablePanel';
export { TopologyPanel } from './TopologyPanel';
export { TracePanel } from './TracePanel';
export * from './mockFixtures';

export const ShowcaseLogsPanel: PanelPlugin = {
  PanelComponent: LogsPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: [],
  hideQueryEditor: true,
  createInitialOptions: () => ({}),
};

export const ShowcaseTracePanel: PanelPlugin = {
  PanelComponent: TracePanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: [],
  hideQueryEditor: true,
  createInitialOptions: () => ({}),
};

export const ShowcaseTablePanel: PanelPlugin = {
  PanelComponent: TablePanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: [],
  hideQueryEditor: true,
  createInitialOptions: () => ({}),
};

export const ShowcaseTopologyPanel: PanelPlugin = {
  PanelComponent: TopologyPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: [],
  hideQueryEditor: true,
  createInitialOptions: () => ({}),
};

export const ShowcaseGeoMapPanel: PanelPlugin = {
  PanelComponent: GeoMapPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: [],
  hideQueryEditor: true,
  createInitialOptions: () => ({}),
};

/** Panel plugin name → implementation for local showcase dashboards. */
export const SHOWCASE_PANEL_PLUGINS: Record<string, PanelPlugin> = {
  LogsPanel: ShowcaseLogsPanel,
  TracePanel: ShowcaseTracePanel,
  TablePanel: ShowcaseTablePanel,
  TopologyPanel: ShowcaseTopologyPanel,
  GeoMapPanel: ShowcaseGeoMapPanel,
};

export const SHOWCASE_PANEL_KINDS = new Set(Object.keys(SHOWCASE_PANEL_PLUGINS));
