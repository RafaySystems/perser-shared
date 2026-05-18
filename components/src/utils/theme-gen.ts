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
import { EChartsTheme, PersesChartsTheme } from '../model';
import { PaletteMode } from '../theme/theme';

// Perses design-system colour tokens (mirrors globals.css CSS variables)
const LIGHT = {
  text: { primary: '#2A2E42', secondary: '#3E4662', disabled: '#A4ACC8' },
  grey: {
    50: '#F0F1F6', 100: '#E1E3ED', 200: '#C3C7DB', 300: '#A4ACC8',
    400: '#8690B6', 500: '#717CA4', 600: '#535D83', 700: '#3E4662',
    800: '#2A2E42', 850: '#1F2331', 900: '#151721',
  },
  success: { main: '#4CAF50' },
  warning: { main: '#FF9800' },
  error:   { main: '#EA4747' },
  divider: '#C3C7DB',
  action:  { active: '#535D83', disabled: '#A4ACC8' },
};

const DARK = {
  text: { primary: '#FFFFFF', secondary: '#F0F1F6', disabled: '#535D83' },
  grey: {
    50: '#0A0C10', 100: '#151721', 200: '#1F2331', 300: '#2A2E42',
    400: '#3E4662', 500: '#535D83', 600: '#717CA4', 700: '#8690B6',
    800: '#A4ACC8', 850: '#C3C7DB', 900: '#E1E3ED',
  },
  success: { main: '#66BB6A' },
  warning: { main: '#FFA726' },
  error:   { main: '#EE6C6C' },
  divider: '#535D83',
  action:  { active: '#8690B6', disabled: '#535D83' },
};

/**
 * Generates ECharts / Perses chart theme from the current colour-mode.
 * Replaces the previous MUI-Theme-based version.
 */
export function generateChartsTheme(
  mode: PaletteMode,
  persesChartsThemeOverride: Partial<PersesChartsTheme>
): PersesChartsTheme {
  const palette = mode === 'dark' ? DARK : LIGHT;
  const primaryTextColor = palette.text.primary;
  const fontFamily = "'Inter', sans-serif";

  const echartsTheme: EChartsTheme = {
    title: { show: false },
    textStyle: { color: primaryTextColor, fontFamily, fontSize: 12 },
    grid: { top: 5, right: 20, bottom: 0, left: 20, containLabel: true },
    color: ['#56B4E9', '#009E73', '#0072B2', '#CC79A7', '#F0E442', '#E69F00', '#D55E00'],
    categoryAxis: {
      show: true,
      axisLabel: { show: true, color: primaryTextColor, margin: 15 },
      axisTick: { show: false, length: 6, lineStyle: { color: palette.grey[600] } },
      axisLine: { show: true, lineStyle: { color: palette.grey[600] } },
      splitLine: { show: true, lineStyle: { width: 0.5, color: palette.grey[300], opacity: 0.4 } },
      splitArea: { show: false, areaStyle: { color: [palette.grey[300]] } },
    },
    timeAxis: {
      show: true,
      axisLabel: { show: true, color: primaryTextColor, margin: 15 },
      axisTick: { show: false, length: 6, lineStyle: { color: palette.grey[600] } },
      axisLine: { show: true, lineStyle: { color: palette.grey[600] } },
      splitLine: { show: true, lineStyle: { width: 0.5, color: palette.grey[300], opacity: 0.4 } },
      splitArea: { show: false, areaStyle: { color: [palette.grey[300]] } },
    },
    valueAxis: {
      show: true,
      axisLabel: { color: primaryTextColor, margin: 12 },
      axisLine: { show: false },
      splitLine: { show: true, lineStyle: { width: 0.5, color: palette.grey[300], opacity: 0.6 } },
    },
    legend: {
      orient: 'horizontal',
      textStyle: { color: primaryTextColor },
      pageTextStyle: { color: palette.grey[600] },
      pageIconColor: palette.action.active,
      pageIconInactiveColor: palette.action.disabled,
    },
    toolbox: { show: true, top: 10, right: 10, iconStyle: { borderColor: primaryTextColor } },
    tooltip: {
      backgroundColor: palette.grey[800],
      borderColor: palette.grey[800],
      textStyle: { color: '#fff', fontSize: 11 },
    },
    axisPointer: { lineStyle: { color: palette.grey[500] } },
    markLine: {
      symbol: 'none',
      symbolSize: 0,
      itemStyle: { color: palette.grey[500] },
      lineStyle: { type: 'dashed', width: 1 },
    },
    line: {
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 4,
      smooth: false,
      lineStyle: { width: 1 },
      emphasis: { lineStyle: { width: 1.5 } },
    },
    bar: {
      barMaxWidth: 150,
      itemStyle: { borderWidth: 0, borderRadius: 0, borderColor: palette.grey[300] },
      label: { show: false, color: primaryTextColor },
    },
    gauge: {
      detail: { fontSize: 18, fontWeight: 600, valueAnimation: false },
      splitLine: { distance: 0, length: 4, lineStyle: { width: 1 } },
      splitNumber: 12,
    },
  };

  return merge(
    {
      echartsTheme,
      noDataOption: {
        title: {
          show: true,
          textStyle: { color: primaryTextColor, fontSize: 16, fontWeight: 400 },
          text: 'No data',
          left: 'center',
          top: 'center',
        },
        xAxis: { show: false },
        yAxis: { show: false },
      },
      sparkline: { width: 2, color: '#1473E6' },
      container: { padding: { default: 12 } },
      thresholds: {
        defaultColor: palette.success.main,
        palette: ['#FFCC00', palette.warning.main, palette.error.main],
      },
    },
    persesChartsThemeOverride
  );
}
