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

import { format } from 'date-fns';
import { ReactElement, useId } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { formatValue, type FormatOptions } from '../model';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui/chart';

export type CartesianChartVariant = 'line' | 'area' | 'bar';

export interface CartesianTimeSeriesChartProps {
  rows: Array<Record<string, number | null>>;
  chartConfig: ChartConfig;
  seriesKeys: string[];
  height: number;
  yFormat?: FormatOptions;
  variant?: CartesianChartVariant;
  areaOpacity?: number;
  lineWidth?: number;
  stacked?: boolean;
  showLegend?: boolean;
  legendVerticalAlign?: 'top' | 'bottom';
}

export function CartesianTimeSeriesChart({
  rows,
  chartConfig,
  seriesKeys,
  height,
  yFormat,
  variant = 'line',
  areaOpacity = 0.3,
  lineWidth = 1.5,
  stacked = false,
  showLegend = false,
  legendVerticalAlign = 'bottom',
}: CartesianTimeSeriesChartProps): ReactElement {
  const gradientPrefix = useId().replace(/:/g, '');

  const margin = { top: 8, right: 12, bottom: showLegend ? 4 : 0, left: 4 };
  const xAxis = (
    <XAxis
      dataKey="timestamp"
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      minTickGap={32}
      tickFormatter={(ts) => format(new Date(ts), 'HH:mm')}
    />
  );
  const yAxis = (
    <YAxis
      tickLine={false}
      axisLine={false}
      width={48}
      tickMargin={4}
      tickFormatter={(value) => formatValue(Number(value), yFormat)}
    />
  );
  const grid = <CartesianGrid vertical={false} strokeDasharray="3 3" />;
  const tooltip = (
    <ChartTooltip
      content={
        <ChartTooltipContent
          labelFormatter={(_, payload) => {
            const ts = payload?.[0]?.payload?.timestamp;
            return ts != null ? format(new Date(ts as number), 'MMM d, HH:mm:ss') : '';
          }}
          formatter={(value) => formatValue(Number(value), yFormat)}
        />
      }
    />
  );
  const legend =
    showLegend ? (
      <ChartLegend verticalAlign={legendVerticalAlign} content={<ChartLegendContent />} />
    ) : null;

  const renderSeries = (): ReactElement[] => {
    if (variant === 'bar') {
      return seriesKeys.map((key) => (
        <Bar
          key={key}
          dataKey={key}
          fill={`var(--color-${key})`}
          stackId={stacked ? 'stack' : undefined}
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
        />
      ));
    }
    if (variant === 'area') {
      return seriesKeys.map((key) => (
        <Area
          key={key}
          type="monotone"
          dataKey={key}
          stroke={`var(--color-${key})`}
          fill={`url(#${gradientPrefix}-${key})`}
          strokeWidth={lineWidth}
          dot={false}
          connectNulls
          stackId={stacked ? 'stack' : undefined}
          isAnimationActive={false}
        />
      ));
    }
    return seriesKeys.map((key) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={`var(--color-${key})`}
        strokeWidth={lineWidth}
        dot={false}
        connectNulls
        isAnimationActive={false}
      />
    ));
  };

  const defs =
    variant === 'area' ? (
      <defs>
        {seriesKeys.map((key) => (
          <linearGradient key={key} id={`${gradientPrefix}-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={areaOpacity} />
            <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.02} />
          </linearGradient>
        ))}
      </defs>
    ) : null;

  const body = (
    <>
      {defs}
      {grid}
      {xAxis}
      {yAxis}
      {tooltip}
      {legend}
      {renderSeries()}
    </>
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto w-full [&>div]:!aspect-auto"
      style={{ height }}
    >
      {variant === 'bar' ? (
        <BarChart data={rows} margin={margin}>
          {body}
        </BarChart>
      ) : variant === 'area' ? (
        <AreaChart data={rows} margin={margin}>
          {body}
        </AreaChart>
      ) : (
        <LineChart data={rows} margin={margin}>
          {body}
        </LineChart>
      )}
    </ChartContainer>
  );
}
