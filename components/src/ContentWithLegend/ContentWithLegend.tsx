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
import { getLegendSize } from '../model';
import { Legend } from '../Legend';
import { ContentWithLegendProps, getContentWithLegendLayout } from './model/content-with-legend-model';
import { usePaletteMode } from '../theme/ThemeProvider';

// Minimal theme stub that satisfies the spacing/typography requirements of getContentWithLegendLayout
function buildMinimalTheme(mode: 'light' | 'dark') {
  const spacingUnit = 8;
  const spacing = (...args: number[]): string => {
    if (args.length === 0) return '8px';
    return args.map((v) => `${v * spacingUnit}px`).join(' ');
  };
  return {
    spacing,
    palette: { mode },
    typography: {
      body1: { lineHeight: 1.5, fontSize: '0.875rem' },
      body2: { lineHeight: 1.43, fontSize: '0.875rem' },
    },
  } as any;
}

/**
 * Component to help lay out content alongside a `Legend` component based on the
 * configuration of the legend.
 *
 * See the documentation for the `Legend` component for more details about the
 * features and configuration of the legend.
 */
export function ContentWithLegend({
  children,
  legendProps,
  width,
  height,
  spacing = 0,
  legendSize,
  minChildrenWidth = 100,
  minChildrenHeight = 100,
}: ContentWithLegendProps): ReactElement {
  const mode = usePaletteMode();
  const theme = buildMinimalTheme(mode);

  const { content, legend, margin } = getContentWithLegendLayout({
    width,
    height,
    legendProps,
    minChildrenHeight,
    minChildrenWidth,
    spacing,
    theme,
    legendSize: getLegendSize(legendSize),
  });

  return (
    <div
      className="relative overflow-hidden"
      style={{ width, height }}
    >
      <div
        style={{
          width: content.width,
          height: content.height,
          marginRight: `${margin.right}px`,
          marginBottom: `${margin.bottom}px`,
        }}
      >
        {typeof children === 'function' ? children({ width: content.width, height: content.height }) : children}
      </div>
      {legendProps && legend.show && <Legend {...legendProps} height={legend.height} width={legend.width} />}
    </div>
  );
}
