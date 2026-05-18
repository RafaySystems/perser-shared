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

import { buildCategoryChartData, ChartEmptyState, PersesBarChart } from '@perses-dev/components';
import type { TimeSeriesData } from '@perses-dev/core';
import type { PanelProps } from '../model';
import { useMemo, type ReactElement } from 'react';
import type { BarChartSpec } from './chartSpec';

export function BarChartPanel({
  spec,
  queryResults,
  contentDimensions,
}: PanelProps<BarChartSpec, TimeSeriesData>): ReactElement {
  const chartSpec = spec as BarChartSpec;
  const calculation = chartSpec.calculation ?? 'last-number';
  const height = Math.max(contentDimensions?.height ?? 160, 120);

  const { rows, chartConfig } = useMemo(
    () => buildCategoryChartData(queryResults, calculation),
    [queryResults, calculation]
  );

  if (rows.length === 0) {
    return <ChartEmptyState style={{ height }} />;
  }

  const showLegend = chartSpec.legend?.position !== undefined && rows.length > 1;

  return (
    <PersesBarChart
      data={rows}
      config={chartConfig}
      height={height}
      valueFormat={chartSpec.format}
      layout={chartSpec.layout ?? 'horizontal'}
      showLegend={showLegend}
    />
  );
}
