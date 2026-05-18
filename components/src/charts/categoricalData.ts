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

import type { CalculationType } from '@perses-dev/core';
import type { ChartConfig } from '../ui/chart';
import { getChartSeriesColor } from './chartColors';
import { buildChartConfig, collectTimeSeries, computeSeriesValue } from './timeSeriesData';
import type { TimeSeriesQuerySlice } from './timeSeriesData';

export type CategoryDatum = {
  name: string;
  value: number;
  key: string;
};

export function buildCategoryChartData(
  queryResults: TimeSeriesQuerySlice[],
  calculation: CalculationType = 'last-number'
): { rows: CategoryDatum[]; chartConfig: ChartConfig } {
  const seriesList = collectTimeSeries(queryResults);
  const { chartConfig, seriesKeys } = buildChartConfig(seriesList);

  const rows: CategoryDatum[] = [];
  seriesList.forEach((series, index) => {
    const raw = computeSeriesValue(series, calculation);
    if (raw === null || raw === undefined || Number.isNaN(raw)) {
      return;
    }
    const key = seriesKeys[index];
    const name = series.formattedName ?? series.name ?? key;
    rows.push({ name, value: raw, key });
    if (!chartConfig[key]) {
      chartConfig[key] = { label: name, color: getChartSeriesColor(index) };
    }
  });

  return { rows, chartConfig };
}

/** Pie / ring slices: one row per series with a numeric value. */
export function buildPieChartData(
  queryResults: TimeSeriesQuerySlice[],
  calculation: CalculationType = 'last-number'
): { slices: Array<CategoryDatum & { fill: string }>; chartConfig: ChartConfig } {
  const { rows, chartConfig } = buildCategoryChartData(queryResults, calculation);
  const slices = rows.map((row, index) => ({
    ...row,
    fill: chartConfig[row.key]?.color ?? getChartSeriesColor(index),
  }));
  return { slices, chartConfig };
}
