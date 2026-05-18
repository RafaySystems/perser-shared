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

import { generateChartsTheme } from './theme-gen';

describe('generateChartsTheme', () => {
  it('returns shadcn-aligned series colors and thresholds', () => {
    const chartsTheme = generateChartsTheme('light', {
      noDataMessage: 'Empty',
    });

    expect(chartsTheme.noDataMessage).toBe('Empty');
    expect(chartsTheme.seriesColors.length).toBeGreaterThanOrEqual(5);
    expect(chartsTheme.seriesColors[0]).toContain('hsl(var(--chart-1))');
    expect(chartsTheme.thresholds.palette).toHaveLength(3);
    expect(chartsTheme.sparkline.color).toBe('#1473E6');
  });

  it('uses dark-mode primary for sparkline', () => {
    const chartsTheme = generateChartsTheme('dark');
    expect(chartsTheme.sparkline.color).toBe('#438FEB');
  });
});
