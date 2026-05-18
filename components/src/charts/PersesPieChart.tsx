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
import { Cell, Pie, PieChart } from 'recharts';
import { formatValue, type FormatOptions } from '../model';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui/chart';

export type PieSlice = {
  name: string;
  value: number;
  key: string;
  fill?: string;
};

export interface PersesPieChartProps {
  data: PieSlice[];
  config: ChartConfig;
  height: number;
  valueFormat?: FormatOptions;
  /** Donut / ring chart when > 0 (e.g. "55%" or 60). */
  innerRadius?: number | string;
  outerRadius?: number | string;
  showLegend?: boolean;
}

export function PersesPieChart({
  data,
  config,
  height,
  valueFormat,
  innerRadius = 0,
  outerRadius = '80%',
  showLegend = true,
}: PersesPieChartProps): ReactElement {
  const isDonut = innerRadius !== 0 && innerRadius !== '0' && innerRadius !== '0%';

  return (
    <ChartContainer config={config} className="aspect-auto w-full [&>div]:!aspect-auto" style={{ height }}>
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => [
                formatValue(Number(value), valueFormat),
                String(name),
              ]}
            />
          }
        />
        {showLegend && <ChartLegend content={<ChartLegendContent nameKey="name" />} />}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={isDonut ? 2 : 0}
          strokeWidth={1}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.fill ?? `var(--color-${entry.key})`} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
