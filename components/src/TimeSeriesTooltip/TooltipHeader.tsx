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

import { Pin, PinOff as PinOutline } from 'lucide-react';
import { memo, ReactElement } from 'react';
import { useTimeZone } from '../context/TimeZoneProvider';
import { NearbySeriesArray } from './nearby-series';
import {
  TOOLTIP_BG_COLOR_FALLBACK,
  TOOLTIP_MAX_WIDTH,
  PIN_TOOLTIP_HELP_TEXT,
  UNPIN_TOOLTIP_HELP_TEXT,
} from './tooltip-model';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';

export interface TooltipHeaderProps {
  nearbySeries: NearbySeriesArray;
  totalSeries: number;
  isTooltipPinned: boolean;
  showAllSeries: boolean;
  enablePinning?: boolean;
  onShowAllClick?: (checked: boolean) => void;
  onUnpinClick?: () => void;
}

export const TooltipHeader = memo(function TooltipHeader({
  nearbySeries,
  totalSeries,
  isTooltipPinned,
  showAllSeries,
  enablePinning = true,
  onShowAllClick,
  onUnpinClick,
}: TooltipHeaderProps) {
  const { formatWithUserTimeZone } = useTimeZone();
  const seriesTimeMs = nearbySeries[0]?.date ?? null;
  if (seriesTimeMs === null) {
    return null;
  }

  const formatTimeSeriesHeader = (timeMs: number): ReactElement => {
    const date = new Date(timeMs);
    const formattedDate = formatWithUserTimeZone(date, 'MMM dd, yyyy - ');
    const formattedTime = formatWithUserTimeZone(date, 'HH:mm:ss');
    return (
      <div>
        <span className="text-xs text-white">{formattedDate}</span>
        <span className="text-xs">
          <strong>{formattedTime}</strong>
        </span>
      </div>
    );
  };

  // TODO: accurately calc whether more series are outside scrollable region using yBuffer, avg series name length, TOOLTIP_MAX_HEIGHT
  const showAllSeriesToggle = enablePinning && totalSeries > 5;

  const pinTooltipHelpText = isTooltipPinned ? UNPIN_TOOLTIP_HELP_TEXT : PIN_TOOLTIP_HELP_TEXT;

  return (
    <div
      className="w-full sticky top-0 left-0"
      style={{
        maxWidth: TOOLTIP_MAX_WIDTH,
        padding: '12px 16px 4px 16px',
        backgroundColor: TOOLTIP_BG_COLOR_FALLBACK,
      }}
    >
      <div className="w-full flex justify-start items-center pb-0.5">
        {formatTimeSeriesHeader(seriesTimeMs)}
        <div className="flex flex-row gap-2 ml-auto">
          {showAllSeriesToggle && (
            <div className="flex flex-row gap-0.5 items-center text-right">
              <span style={{ fontSize: 11 }}>Show All</span>
              <Switch
                checked={showAllSeries}
                onCheckedChange={(checked) => {
                  if (onShowAllClick !== undefined) {
                    return onShowAllClick(checked);
                  }
                }}
                className="[&>span]:bg-white data-[state=unchecked]:bg-white/30"
              />
            </div>
          )}
          {enablePinning && (
            <div className="flex flex-row items-center">
              <span
                style={{ marginRight: '4px', fontSize: 11, verticalAlign: 'middle' }}
              >
                {pinTooltipHelpText}
              </span>
              {isTooltipPinned ? (
                <Pin
                  onClick={() => {
                    if (onUnpinClick !== undefined) {
                      onUnpinClick();
                    }
                  }}
                  style={{ fontSize: 16, cursor: 'pointer' }}
                />
              ) : (
                <PinOutline style={{ fontSize: 16 }} />
              )}
            </div>
          )}
        </div>
      </div>
      <Separator className="w-full border-gray-500" />
    </div>
  );
});
