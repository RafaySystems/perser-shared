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

import type { ChartCoordinateSystem } from '../model';
import { TimeSeries, TimeSeriesValueTuple } from '@perses-dev/spec';
import { DatapointInfo, PINNED_CROSSHAIR_SERIES_NAME, TimeChartSeriesMapping } from '../model';

export interface ZoomEventData {
  start: number;
  end: number;
}

/**
 * @deprecated No-op under Recharts. Zoom is handled by chart brush/interaction props.
 */
export function enableDataZoom(_chart: ChartCoordinateSystem): void {
  // intentionally empty
}

/**
 * @deprecated No-op under Recharts.
 */
export function restoreChart(chart: ChartCoordinateSystem): void {
  chart.dispatchAction?.({ type: 'restore' });
}

/**
 * Clear highlighted series when cursor exits the plot.
 */
export function clearHighlightedSeries(chart: ChartCoordinateSystem): void {
  chart.dispatchAction?.({ type: 'unselect' });
  chart.dispatchAction?.({ type: 'downplay' });
}

/**
 * Convert a point from pixel coordinate to logical coordinate.
 */
export function getPointInGrid(cursorCoordX: number, cursorCoordY: number, chart?: ChartCoordinateSystem): number[] | null {
  if (chart === undefined || !chart.convertFromPixel || !chart.containPixel) {
    return null;
  }

  const pointInPixel = [cursorCoordX, cursorCoordY];
  if (!chart.containPixel('grid', pointInPixel)) {
    return null;
  }

  return chart.convertFromPixel('grid', pointInPixel) ?? null;
}

/**
 * Dispatch nearby-series highlight actions when a chart coordinate system supports them.
 */
export function batchDispatchNearbySeriesActions(
  chart: ChartCoordinateSystem,
  nearbySeriesIndexes: number[],
  emphasizedSeriesIndexes: number[],
  nonEmphasizedSeriesIndexes: number[],
  emphasizedDatapoints: DatapointInfo[],
  duplicateDatapoints: DatapointInfo[]
): void {
  if (!chart.dispatchAction) return;

  const lastEmphasizedDatapoint =
    duplicateDatapoints.length > 0
      ? duplicateDatapoints[duplicateDatapoints.length - 1]
      : emphasizedDatapoints[emphasizedDatapoints.length - 1];
  if (lastEmphasizedDatapoint !== undefined) {
    chart.dispatchAction({
      type: 'select',
      seriesIndex: lastEmphasizedDatapoint.seriesIndex,
      dataIndex: lastEmphasizedDatapoint.dataIndex,
      escapeConnect: true,
    });
  }

  chart.dispatchAction({ type: 'downplay' });

  if (nonEmphasizedSeriesIndexes.length > 0) {
    chart.dispatchAction({
      type: 'downplay',
      seriesIndex: nonEmphasizedSeriesIndexes,
    });
  }

  if (emphasizedSeriesIndexes.length > 0) {
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: emphasizedSeriesIndexes,
      notBlur: false,
      escapeConnect: true,
    });
  } else {
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: nearbySeriesIndexes,
      notBlur: true,
      escapeConnect: true,
    });
    chart.dispatchAction({ type: 'toggleSelect' });
  }
}

export function checkCrosshairPinnedStatus(seriesMapping: TimeChartSeriesMapping): boolean {
  return seriesMapping[seriesMapping.length - 1]?.name === PINNED_CROSSHAIR_SERIES_NAME;
}

export function getClosestTimestamp(timeSeriesValues?: TimeSeriesValueTuple[], cursorX?: number): number | null {
  if (timeSeriesValues === undefined || cursorX === undefined) {
    return null;
  }

  let currentClosestTimestamp: number | null = null;
  let currentClosestDistance = Infinity;

  for (const [timestamp] of timeSeriesValues) {
    const distance = Math.abs(timestamp - cursorX);
    if (distance < currentClosestDistance) {
      currentClosestTimestamp = timestamp;
      currentClosestDistance = distance;
    }
  }
  return currentClosestTimestamp;
}

export function getClosestTimestampInFullDataset(data: TimeSeries[], cursorX?: number): number | null {
  if (cursorX === undefined) {
    return null;
  }
  const totalSeries = data.length;
  let closestTimestamp = null;
  for (let seriesIdx = 0; seriesIdx < totalSeries; seriesIdx++) {
    const currentDataset = totalSeries > 0 ? data[seriesIdx] : null;
    if (!currentDataset) break;
    closestTimestamp = getClosestTimestamp(currentDataset.values, cursorX);
  }
  return closestTimestamp;
}
