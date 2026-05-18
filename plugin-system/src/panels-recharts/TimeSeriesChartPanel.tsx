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
  CartesianTimeSeriesChart,
  ChartEmptyState,
  collectTimeSeries,
  timeSeriesToRechartsRows,
} from '@perses-dev/components';
import type { TimeSeriesData } from '@perses-dev/core';
import type { PanelProps } from '../model';
import { useMemo, type ReactElement } from 'react';
import { resolveTimeSeriesVariant, type TimeSeriesChartSpec } from './chartSpec';

export function TimeSeriesChartPanel({
  spec,
  queryResults,
  contentDimensions,
}: PanelProps<TimeSeriesChartSpec, TimeSeriesData>): ReactElement {
  const chartSpec = spec as TimeSeriesChartSpec;
  const variant = resolveTimeSeriesVariant(chartSpec);

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
    <CartesianTimeSeriesChart
      rows={rows}
      chartConfig={chartConfig}
      seriesKeys={seriesKeys}
      height={height}
      yFormat={chartSpec.yAxis?.format}
      variant={variant}
      areaOpacity={chartSpec.visual?.areaOpacity ?? 0.3}
      lineWidth={chartSpec.visual?.lineWidth ?? 1.5}
      stacked={chartSpec.visual?.stack ?? false}
      showLegend={showLegend}
      legendVerticalAlign={legendVerticalAlign}
    />
  );
}
