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
import { CHART_SERIES_COLORS } from '../charts/chartColors';
import { PersesChartsTheme } from '../model';
import { PaletteMode } from '../theme/theme';

const LIGHT = {
  success: { main: '#4CAF50' },
  warning: { main: '#FF9800' },
  error: { main: '#EA4747' },
  primary: '#1473E6',
};

const DARK = {
  success: { main: '#66BB6A' },
  warning: { main: '#FFA726' },
  error: { main: '#EE6C6C' },
  primary: '#438FEB',
};

/**
 * Builds a Perses chart theme from the active colour mode, using shadcn chart CSS variables.
 */
export function generateChartsTheme(
  mode: PaletteMode,
  persesChartsThemeOverride: Partial<PersesChartsTheme> = {}
): PersesChartsTheme {
  const palette = mode === 'dark' ? DARK : LIGHT;

  return merge(
    {
      seriesColors: [...CHART_SERIES_COLORS],
      noDataMessage: 'No data',
      sparkline: { width: 2, color: palette.primary, areaOpacity: 0.25 },
      container: { padding: { default: 12 } },
      thresholds: {
        defaultColor: palette.success.main,
        palette: ['#FFCC00', palette.warning.main, palette.error.main],
      },
    },
    persesChartsThemeOverride
  );
}
