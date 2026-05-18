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

import type { CartesianChartVariant, FormatOptions } from '@perses-dev/components';
import type { CalculationType } from '@perses-dev/core';

export type ChartLegendSpec = { position?: 'bottom' | 'top' | 'hidden' };
export type ChartYAxisSpec = { format?: FormatOptions; label?: string };
export type ChartVisualSpec = {
  display?: 'line' | 'area' | 'bar';
  areaOpacity?: number;
  lineWidth?: number;
  stack?: boolean;
};

export type TimeSeriesChartSpec = {
  legend?: ChartLegendSpec;
  yAxis?: ChartYAxisSpec;
  visual?: ChartVisualSpec;
};

export type BarChartSpec = {
  calculation?: CalculationType;
  format?: FormatOptions;
  legend?: ChartLegendSpec;
  layout?: 'horizontal' | 'vertical';
};

export type PieChartSpec = {
  calculation?: CalculationType;
  format?: FormatOptions;
  legend?: ChartLegendSpec;
  /** Inner radius for donut / ring charts (e.g. "55%" or 48). */
  innerRadius?: number | string;
  outerRadius?: number | string;
  donut?: boolean;
};

export function resolveTimeSeriesVariant(spec: TimeSeriesChartSpec): CartesianChartVariant {
  const display = spec.visual?.display;
  if (display === 'bar' || display === 'area' || display === 'line') {
    return display;
  }
  if (spec.visual?.areaOpacity !== undefined && spec.visual.areaOpacity > 0) {
    return 'area';
  }
  return 'line';
}

export function resolvePieInnerRadius(spec: PieChartSpec): number | string {
  if (spec.innerRadius !== undefined) {
    return spec.innerRadius;
  }
  if (spec.donut) {
    return '55%';
  }
  return 0;
}
