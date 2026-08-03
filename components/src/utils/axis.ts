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

import merge from 'lodash/merge';
import { FormatOptions, formatValue } from '../model';

export interface YAxisConfig {
  format?: FormatOptions;
  position?: 'left' | 'right';
  show?: boolean;
  min?: number;
  max?: number;
  type?: string;
  offset?: number;
  boundaryGap?: unknown;
  axisLabel?: {
    formatter?: (value: number) => string;
    overflow?: string;
  };
  splitLine?: { show?: boolean };
  [key: string]: unknown;
}

export type XAXisConfig = YAxisConfig;

// Character width multipliers (approximate for typical UI fonts)
const CHAR_WIDTH_BASE = 6;
const AXIS_LABEL_PADDING = 10;

function estimateLabelWidth(format: FormatOptions | undefined, maxValue: number): number {
  const formattedLabel = formatValue(maxValue, format);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return formattedLabel.length * CHAR_WIDTH_BASE;
  }
  context.font = '12px sans-serif';
  return context.measureText(formattedLabel).width;
}

/*
 * Populate yAxis or xAxis properties, returns an Array since multiple axes are supported
 */
export function getFormattedAxis(axis?: YAxisConfig | XAXisConfig, unit?: FormatOptions): unknown[] {
  const AXIS_DEFAULT = {
    type: 'value',
    boundaryGap: [0, '10%'],
    axisLabel: {
      formatter: (value: number): string => {
        return formatValue(value, unit);
      },
    },
  };
  return [merge(AXIS_DEFAULT, axis)];
}

/**
 * Create multiple Y axes configurations for cartesian charts.
 * The first axis (index 0) is always on the left side.
 * Additional axes are placed on the right side.
 */
export function getFormattedMultipleYAxes(
  baseAxis: YAxisConfig | undefined,
  baseFormat: FormatOptions | undefined,
  additionalFormats: FormatOptions[],
  maxValues?: number[]
): YAxisConfig[] {
  const axes: YAxisConfig[] = [];

  const baseAxisConfig: YAxisConfig = merge(
    {
      type: 'value',
      position: 'left' as const,
      boundaryGap: [0, '10%'],
      axisLabel: {
        formatter: (value: number): string => {
          return formatValue(value, baseFormat);
        },
        overflow: 'truncate',
      },
    },
    baseAxis
  );
  axes.push(baseAxisConfig);

  let cumulativeOffset = 0;

  additionalFormats.forEach((format, index) => {
    const rightAxisConfig: YAxisConfig = {
      type: 'value',
      position: 'right',
      offset: cumulativeOffset,
      boundaryGap: [0, '10%'],
      axisLabel: {
        formatter: (value: number): string => {
          return formatValue(value, format);
        },
      },
      splitLine: {
        show: false,
      },
      show: baseAxis?.show,
    };
    axes.push(rightAxisConfig);
    if (maxValues) {
      cumulativeOffset += estimateLabelWidth(format, maxValues[index] ?? 1000) + AXIS_LABEL_PADDING;
    }
  });

  return axes;
}
