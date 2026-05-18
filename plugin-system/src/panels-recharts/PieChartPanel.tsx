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

import { buildPieChartData, ChartEmptyState, PersesPieChart } from '@perses-dev/components';
import type { TimeSeriesData } from '@perses-dev/core';
import type { PanelProps } from '../model';
import { useMemo, type ReactElement } from 'react';
import { resolvePieInnerRadius, type PieChartSpec } from './chartSpec';

export function PieChartPanel({
  spec,
  queryResults,
  contentDimensions,
}: PanelProps<PieChartSpec, TimeSeriesData>): ReactElement {
  const chartSpec = spec as PieChartSpec;
  const calculation = chartSpec.calculation ?? 'last-number';
  const height = Math.max(contentDimensions?.height ?? 180, 120);
  const innerRadius = resolvePieInnerRadius(chartSpec);

  const { slices, chartConfig } = useMemo(
    () => buildPieChartData(queryResults, calculation),
    [queryResults, calculation]
  );

  if (slices.length === 0) {
    return <ChartEmptyState style={{ height }} />;
  }

  const showLegend = chartSpec.legend?.position !== 'hidden' && slices.length > 0;

  return (
    <PersesPieChart
      data={slices}
      config={chartConfig}
      height={height}
      valueFormat={chartSpec.format}
      innerRadius={innerRadius}
      outerRadius={chartSpec.outerRadius ?? '80%'}
      showLegend={showLegend}
    />
  );
}

/** Ring / donut chart — same as pie with default inner radius. */
export function RingChartPanel(props: PanelProps<PieChartSpec, TimeSeriesData>): ReactElement {
  const spec = {
    ...(props.spec as PieChartSpec),
    donut: true,
    innerRadius: (props.spec as PieChartSpec)?.innerRadius ?? '55%',
  };
  return <PieChartPanel {...props} spec={spec} />;
}
