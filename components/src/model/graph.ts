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

import { TimeSeriesValueTuple } from '@perses-dev/spec';
import { LegendItem } from '../Legend';

// adjust display when there are many time series to help with performance
export const OPTIMIZED_MODE_SERIES_LIMIT = 1000;

export type UnixTimeMs = number;

export interface GraphSeries {
  name: string;
  values: TimeSeriesValueTuple[];
  id?: string;
}

/** Numeric series values used by chart adapters (legacy ECharts name retained for callers). */
export type EChartsValues = number | null | '-';

/**
 * Renderer-agnostic series option used by tooltip/legend helpers.
 * Formerly typed against ECharts LineSeriesOption / BarSeriesOption.
 */
export interface TimeSeriesOption {
  name?: string;
  type?: 'line' | 'bar';
  stack?: string | number;
  color?: string;
  datasetIndex?: number;
  yAxisIndex?: number;
  [key: string]: unknown;
}

export interface LegacyTimeSeries extends TimeSeriesOption {
  data: EChartsValues[];
}

export type TimeChartSeriesMapping = TimeSeriesOption[];
export type TimeChartLegendItems = LegendItem[];

export type EChartsDataFormat = {
  timeSeries: LegacyTimeSeries[];
  xAxis: number[];
  legendItems?: LegendItem[];
  xAxisMax?: number | string;
  rangeMs?: number;
};

export type ChartInstanceFocusOpts = {
  name?: string;
};

export type ChartInstance = {
  highlightSeries: (opts: ChartInstanceFocusOpts) => void;
  clearHighlightedSeries: () => void;
};

export const PINNED_CROSSHAIR_SERIES_NAME = 'Pinned Crosshair';

export const DEFAULT_PINNED_CROSSHAIR: TimeSeriesOption = {
  name: PINNED_CROSSHAIR_SERIES_NAME,
  type: 'line',
};

export interface DatapointInfo {
  dataIndex: number;
  seriesIndex: number;
  seriesName: string;
  yValue: number;
}

/**
 * Minimal chart coordinate API used by nearby-series / tooltip helpers.
 * Implemented by Recharts-backed charts (was previously an ECharts instance).
 */
export interface ChartCoordinateSystem {
  containPixel?: (space: string, point: number[]) => boolean;
  convertFromPixel?: (space: string | Record<string, unknown>, point: number[]) => number[] | null;
  convertToPixel?: (space: string | Record<string, unknown>, point: number[]) => number[] | null;
  dispatchAction?: (action: Record<string, unknown>) => void;
  getDom?: () => HTMLElement | null;
}
