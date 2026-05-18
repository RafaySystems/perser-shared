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

import {
  getCalculation,
  getCommonTimeScale,
  getTimeSeriesValues,
  type CalculationType,
  type TimeSeries,
  type TimeSeriesData,
} from '@perses-dev/core';
import type { ChartConfig } from '../ui/chart';
import { formatValue, type FormatOptions } from '../model';
import { getChartSeriesColor } from './chartColors';

export function sanitizeSeriesKey(name: string, index: number): string {
  const base = name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1');
  return base || `series_${index}`;
}

export type TimeSeriesQuerySlice = { data?: TimeSeriesData };

export function collectTimeSeries(queryResults: TimeSeriesQuerySlice[]): TimeSeries[] {
  const series: TimeSeries[] = [];
  for (const result of queryResults) {
    if (result.data?.series) {
      series.push(...result.data.series);
    }
  }
  return series;
}

export function buildChartConfig(seriesList: TimeSeries[]): {
  chartConfig: ChartConfig;
  seriesKeys: string[];
} {
  const chartConfig: ChartConfig = {};
  const seriesKeys: string[] = [];

  seriesList.forEach((series, index) => {
    const label = series.formattedName ?? series.name ?? `Series ${index + 1}`;
    const key = sanitizeSeriesKey(label, index);
    seriesKeys.push(key);
    chartConfig[key] = {
      label,
      color: getChartSeriesColor(index),
    };
  });

  return { chartConfig, seriesKeys };
}

export function timeSeriesToRechartsRows(
  queryResults: TimeSeriesQuerySlice[],
  seriesList: TimeSeries[],
  seriesKeys: string[]
): Array<Record<string, number | null>> {
  const timeScale = getCommonTimeScale(queryResults.map((q) => q.data));
  if (!timeScale) {
    return [];
  }

  const rowMap = new Map<number, Record<string, number | null>>();

  seriesList.forEach((series, index) => {
    const key = seriesKeys[index];
    const values = getTimeSeriesValues(series, timeScale);
    for (const [timestamp, value] of values) {
      let row = rowMap.get(timestamp);
      if (!row) {
        row = { timestamp };
        rowMap.set(timestamp, row);
      }
      row[key] = value;
    }
  });

  return Array.from(rowMap.values()).sort(
    (a, b) => (a.timestamp as number) - (b.timestamp as number)
  );
}

export function computeSeriesValue(
  series: TimeSeries,
  calculation: CalculationType = 'last-number'
): number | null | undefined {
  return getCalculation(series.values, calculation);
}

export function formatSeriesValue(
  value: number | null | undefined,
  format?: FormatOptions
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return formatValue(value, format);
}
