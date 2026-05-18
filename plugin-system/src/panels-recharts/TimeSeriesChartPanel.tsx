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
  buildChartConfig,
  ChartContainer,
  ChartEmptyState,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  collectTimeSeries,
  formatValue,
  timeSeriesToRechartsRows,
  type FormatOptions,
} from '@perses-dev/components';
import type { TimeSeriesData } from '@perses-dev/core';
import type { PanelProps } from '../model';
import { format } from 'date-fns';
import { useMemo, type ReactElement } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

type TimeSeriesChartSpec = {
  legend?: { position?: 'bottom' | 'top' };
  yAxis?: { format?: FormatOptions; label?: string };
};

export function TimeSeriesChartPanel({
  spec,
  queryResults,
  contentDimensions,
}: PanelProps<TimeSeriesChartSpec, TimeSeriesData>): ReactElement {
  const chartSpec = spec as TimeSeriesChartSpec;
  const yFormat = chartSpec.yAxis?.format;

  const { rows, chartConfig, seriesKeys } = useMemo(() => {
    const seriesList = collectTimeSeries(queryResults);
    const { chartConfig: config, seriesKeys: keys } = buildChartConfig(seriesList);
    const data = timeSeriesToRechartsRows(queryResults, seriesList, keys);
    return { rows: data, chartConfig: config, seriesKeys: keys };
  }, [queryResults]);

  const height = Math.max(contentDimensions?.height ?? 160, 120);
  const showLegend = chartSpec.legend?.position !== undefined && seriesKeys.length > 1;
  const legendVerticalAlign = chartSpec.legend?.position === 'top' ? 'top' : 'bottom';

  if (rows.length === 0 || seriesKeys.length === 0) {
    return <ChartEmptyState style={{ height }} />;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto w-full [&>div]:!aspect-auto"
      style={{ height }}
    >
      <LineChart data={rows} margin={{ top: 8, right: 12, bottom: showLegend ? 4 : 0, left: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(ts) => format(new Date(ts), 'HH:mm')}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tickMargin={4}
          tickFormatter={(value) => formatValue(Number(value), yFormat)}
        />
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
        {showLegend && (
          <ChartLegend verticalAlign={legendVerticalAlign} content={<ChartLegendContent />} />
        )}
        {seriesKeys.map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={1.5}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
