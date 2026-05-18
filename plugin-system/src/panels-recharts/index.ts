// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { PanelPlugin } from '../model';
import { BarChartPanel } from './BarChartPanel';
import { GaugeChartPanel } from './GaugeChartPanel';
import { PieChartPanel, RingChartPanel } from './PieChartPanel';
import { StatChartPanel } from './StatChartPanel';
import { TimeSeriesChartPanel } from './TimeSeriesChartPanel';

export { BarChartPanel, GaugeChartPanel, PieChartPanel, RingChartPanel, StatChartPanel, TimeSeriesChartPanel };
export * from './chartSpec';

export const RechartsTimeSeriesChart: PanelPlugin = {
  PanelComponent: TimeSeriesChartPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: ['TimeSeriesQuery'],
  createInitialOptions: () => ({}),
};

export const RechartsStatChart: PanelPlugin = {
  PanelComponent: StatChartPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: ['TimeSeriesQuery'],
  createInitialOptions: () => ({ calculation: 'last-number' }),
};

export const RechartsGaugeChart: PanelPlugin = {
  PanelComponent: GaugeChartPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: ['TimeSeriesQuery'],
  createInitialOptions: () => ({ calculation: 'last-number' }),
};

export const RechartsBarChart: PanelPlugin = {
  PanelComponent: BarChartPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: ['TimeSeriesQuery'],
  createInitialOptions: () => ({ calculation: 'last-number' }),
};

export const RechartsPieChart: PanelPlugin = {
  PanelComponent: PieChartPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: ['TimeSeriesQuery'],
  createInitialOptions: () => ({ calculation: 'last-number' }),
};

export const RechartsRingChart: PanelPlugin = {
  PanelComponent: RingChartPanel as PanelPlugin['PanelComponent'],
  supportedQueryTypes: ['TimeSeriesQuery'],
  createInitialOptions: () => ({ calculation: 'last-number', donut: true, innerRadius: '55%' }),
};

/** Panel plugin name → implementation (matches Perses dashboard `kind` values). */
export const RECHARTS_PANEL_PLUGINS: Record<string, PanelPlugin> = {
  TimeSeriesChart: RechartsTimeSeriesChart,
  StatChart: RechartsStatChart,
  GaugeChart: RechartsGaugeChart,
  BarChart: RechartsBarChart,
  PieChart: RechartsPieChart,
  RingChart: RechartsRingChart,
};

export const RECHARTS_PANEL_KINDS = new Set(Object.keys(RECHARTS_PANEL_PLUGINS));
