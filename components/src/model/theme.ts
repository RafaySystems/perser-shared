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

import { ThresholdColorPalette } from './thresholds';

/**
 * Chart theming aligned with shadcn/ui CSS variables (`--chart-1` … `--chart-5` in globals.css).
 */
export interface PersesChartsTheme {
  /** Series stroke/fill colors (typically `hsl(var(--chart-N))`). */
  seriesColors: string[];
  noDataMessage: string;
  sparkline: {
    width: number;
    color: string;
    areaOpacity: number;
  };
  container: {
    padding: {
      default: number;
    };
  };
  thresholds: ThresholdColorPalette;
  tooltipPortalContainerId?: string;
}
