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
  ChartEmptyState,
  collectTimeSeries,
  computeSeriesValue,
  formatSeriesValue,
  type FormatOptions,
} from '@perses-dev/components';
import type { CalculationType, TimeSeriesData } from '@perses-dev/core';
import type { PanelProps } from '../model';
import { useMemo, type ReactElement } from 'react';

type StatChartSpec = {
  calculation?: CalculationType;
  format?: FormatOptions;
};

export function StatChartPanel({
  spec,
  queryResults,
  contentDimensions,
}: PanelProps<StatChartSpec, TimeSeriesData>): ReactElement {
  const chartSpec = spec as StatChartSpec;
  const calculation = chartSpec.calculation ?? 'last-number';

  const stats = useMemo(() => {
    return collectTimeSeries(queryResults).map((series) => {
      const value = computeSeriesValue(series, calculation);
      return {
        label: series.formattedName ?? series.name ?? 'Value',
        formatted: formatSeriesValue(value, chartSpec.format),
      };
    });
  }, [queryResults, calculation, chartSpec.format]);

  const height = contentDimensions?.height ?? 120;

  if (stats.length === 0) {
    return <ChartEmptyState style={{ height }} />;
  }

  if (stats.length === 1) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-2" style={{ height }}>
        <span className="text-3xl font-semibold tabular-nums tracking-tight">{stats[0].formatted}</span>
      </div>
    );
  }

  return (
    <div
      className="grid h-full gap-2 overflow-auto p-1"
      style={{
        height,
        gridTemplateColumns: 'repeat(auto-fit, minmax(6rem, 1fr))',
      }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex min-w-0 flex-col items-center justify-center gap-0.5">
          <span className="max-w-full truncate text-[10px] text-muted-foreground">{stat.label}</span>
          <span className="text-lg font-semibold tabular-nums">{stat.formatted}</span>
        </div>
      ))}
    </div>
  );
}
