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
import { GaugeChartPanel } from './GaugeChartPanel';
import { StatChartPanel } from './StatChartPanel';
import { TimeSeriesChartPanel } from './TimeSeriesChartPanel';

export { GaugeChartPanel, StatChartPanel, TimeSeriesChartPanel };

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

/** Panel plugin name → implementation (matches Perses dashboard `kind` values). */
export const RECHARTS_PANEL_PLUGINS: Record<string, PanelPlugin> = {
  TimeSeriesChart: RechartsTimeSeriesChart,
  StatChart: RechartsStatChart,
  GaugeChart: RechartsGaugeChart,
};

export const RECHARTS_PANEL_KINDS = new Set(Object.keys(RECHARTS_PANEL_PLUGINS));
