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

import { ReactElement } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { formatValue, type FormatOptions } from '../model';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui/chart';
import type { CategoryDatum } from './categoricalData';

export interface PersesBarChartProps {
  data: CategoryDatum[];
  config: ChartConfig;
  height: number;
  valueFormat?: FormatOptions;
  dataKey?: string;
  categoryKey?: string;
  layout?: 'horizontal' | 'vertical';
  showLegend?: boolean;
  stacked?: boolean;
}

export function PersesBarChart({
  data,
  config,
  height,
  valueFormat,
  dataKey = 'value',
  categoryKey = 'name',
  layout = 'horizontal',
  showLegend = false,
}: PersesBarChartProps): ReactElement {
  return (
    <ChartContainer config={config} className="aspect-auto w-full [&>div]:!aspect-auto" style={{ height }}>
      <BarChart
        data={data}
        layout={layout}
        margin={{ top: 8, right: 12, bottom: showLegend ? 4 : 0, left: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={layout === 'horizontal'} />
        {layout === 'horizontal' ? (
          <>
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) => formatValue(Number(v), valueFormat)}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatValue(Number(v), valueFormat)}
            />
            <YAxis type="category" dataKey={categoryKey} tickLine={false} axisLine={false} width={80} />
          </>
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent formatter={(value) => formatValue(Number(value), valueFormat)} />
          }
        />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        <Bar dataKey={dataKey} radius={[3, 3, 0, 0]} isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
