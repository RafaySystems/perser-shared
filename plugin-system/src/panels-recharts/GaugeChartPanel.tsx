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
  ChartContainer,
  collectTimeSeries,
  computeSeriesValue,
  formatValue,
  getChartSeriesColor,
  type FormatOptions,
} from '@perses-dev/components';
import type { CalculationType, TimeSeriesData } from '@perses-dev/core';
import type { PanelProps } from '../model';
import { useMemo, type ReactElement } from 'react';
import { RadialBar, RadialBarChart } from 'recharts';

type GaugeChartSpec = {
  calculation?: CalculationType;
  format?: FormatOptions;
  max?: number;
  thresholds?: { steps?: Array<{ value: number }> };
};

export function GaugeChartPanel({
  spec,
  queryResults,
  contentDimensions,
}: PanelProps<GaugeChartSpec, TimeSeriesData>): ReactElement {
  const chartSpec = spec as GaugeChartSpec;
  const calculation = chartSpec.calculation ?? 'last-number';
  const height = Math.max(contentDimensions?.height ?? 140, 100);

  const { value, formatted, fill } = useMemo(() => {
    const series = collectTimeSeries(queryResults)[0];
    const raw = series ? computeSeriesValue(series, calculation) : undefined;
    const num = typeof raw === 'number' && !Number.isNaN(raw) ? raw : 0;
    const max = chartSpec.max ?? (chartSpec.format?.unit === 'percent' ? 100 : 100);
    const pct = Math.min(100, Math.max(0, (num / max) * 100));

    const steps = chartSpec.thresholds?.steps ?? [];
    let color = getChartSeriesColor(1);
    if (steps.length >= 2 && num >= steps[1].value) {
      color = getChartSeriesColor(4);
    } else if (steps.length >= 1 && num >= steps[0].value) {
      color = getChartSeriesColor(3);
    }

    return {
      value: pct,
      formatted: formatValue(num, chartSpec.format),
      fill: color,
    };
  }, [queryResults, calculation, chartSpec]);

  const chartConfig = {
    value: { label: 'Value', color: fill },
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center" style={{ height }}>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[85%] w-full max-w-[220px]">
        <RadialBarChart
          data={[{ name: 'value', value, fill: 'var(--color-value)' }]}
          startAngle={180}
          endAngle={0}
          innerRadius="70%"
          outerRadius="100%"
        >
          <RadialBar
            dataKey="value"
            cornerRadius={4}
            background={{ fill: 'hsl(var(--muted))' }}
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ChartContainer>
      <span className="absolute bottom-[18%] text-2xl font-semibold tabular-nums">{formatted}</span>
    </div>
  );
}
