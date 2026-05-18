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

import { TimeRangeValue, isRelativeTimeRange, AbsoluteTimeRange, toAbsoluteTimeRange } from '@perses-dev/spec';
import { ReactElement, useMemo, useRef, useState } from 'react';
import { CalendarDays, Globe } from 'lucide-react';
import { useTimeZone } from '../context';
import { TimeZoneOption, getTimeZoneOptions } from '../model/timeZoneOption';
import { TimeOption } from '../model';
import { SettingsAutocomplete, SettingsAutocompleteOption } from '../SettingsAutocomplete';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateTimeRangePicker } from './DateTimeRangePicker';
import { buildCustomTimeOption, formatTimeRange } from './utils';
import { cn } from '../lib/utils';

interface TimeRangeSelectorProps {
  /**
   * The current value of the time range.
   */
  value: TimeRangeValue;
  /**
   * The list of time options to display in the dropdown.
   */
  timeOptions: TimeOption[];
  /**
   * The callback to call when the time range changes.
   */
  onChange: (value: TimeRangeValue) => void;
  /**
   * Custom line height for the select component.
   */
  height?: string;
  /**
   * Whether to show the custom time range option.
   * Defaults to true.
   */
  showCustomTimeRange?: boolean;
  /** Optional explicit timezone and change handler to enable changing tz from the selector */
  timeZone?: string;
  timeZoneOptions?: TimeZoneOption[];
  onTimeZoneChange?: (timeZone: TimeZoneOption) => void;
}

/**
 * Date & time selection component to customize what data renders on dashboard.
 * This includes relative shortcuts and the ability to pick absolute start and end times.
 */
export function TimeRangeSelector({
  value,
  timeOptions,
  onChange,
  height,
  showCustomTimeRange = true,
  timeZone: timeZoneProp,
  timeZoneOptions,
  onTimeZoneChange,
}: TimeRangeSelectorProps): ReactElement {
  const { timeZone: ctxTimeZone } = useTimeZone();
  const timeZone = timeZoneProp ?? ctxTimeZone;

  const [showCustomDateSelector, setShowCustomDateSelector] = useState(false);
  const [tzPopoverOpen, setTzPopoverOpen] = useState(false);

  const convertedTimeRange = useMemo(() => {
    return isRelativeTimeRange(value) ? toAbsoluteTimeRange(value) : value;
  }, [value]);

  const lastOption = useMemo(
    () => buildCustomTimeOption(isRelativeTimeRange(value) ? undefined : value, timeZone),
    [value, timeZone]
  );

  const tzOptions = timeZoneOptions ?? getTimeZoneOptions();
  const tzLabel = tzOptions.find((o) => o.value === timeZone)?.display ?? timeZone;
  const tzAutocompleteOptions = tzOptions.map((o) => ({ id: o.value, label: o.display }));
  let tzAutocompleteValue: SettingsAutocompleteOption | undefined = undefined;
  {
    const current = tzOptions.find((o) => o.value === timeZone);
    if (current) tzAutocompleteValue = { id: current.value, label: current.display };
  }

  const currentDisplay = formatTimeRange(value, timeZone);

  return (
    <div className="flex items-center gap-1">
      {/* Timezone popover */}
      <Popover open={tzPopoverOpen} onOpenChange={setTzPopoverOpen}>
        <PopoverContent
          align="end"
          className="p-2 w-72"
          onClick={(e) => e.stopPropagation()}
        >
          <SettingsAutocomplete
            options={tzAutocompleteOptions}
            value={tzAutocompleteValue}
            onChange={(_e, option) => {
              if (option) {
                const selected = tzOptions.find((o) => o.value === (option as SettingsAutocompleteOption).id);
                if (selected) onTimeZoneChange?.(selected);
              }
              setTzPopoverOpen(false);
            }}
            disableClearable
            placeholder="Search timezones"
          />
        </PopoverContent>

        {/* Custom date selector popover */}
        <Popover open={showCustomDateSelector} onOpenChange={setShowCustomDateSelector}>
          <PopoverContent align="center" className="p-0 w-auto">
            <DateTimeRangePicker
              initialTimeRange={convertedTimeRange}
              onChange={(val: AbsoluteTimeRange) => {
                onChange(val);
                setShowCustomDateSelector(false);
              }}
              onCancel={() => setShowCustomDateSelector(false)}
              timeZone={timeZone}
            />
          </PopoverContent>

          {/* Main time range selector */}
          <Select
            value={currentDisplay}
            onValueChange={(val) => {
              if (val === '__custom__') {
                setShowCustomDateSelector(true);
                return;
              }
              const found = timeOptions.find((o) => formatTimeRange(o.value, timeZone) === val);
              if (found) onChange(found.value);
            }}
          >
            <SelectTrigger
              className={cn('min-w-[160px]', height ? '' : '')}
              style={height ? { lineHeight: height, paddingTop: 0, paddingBottom: 0 } : undefined}
              aria-label={`Select time range. Currently set to ${value}`}
            >
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {/* Header row with timezone info */}
              <div
                className="flex items-center justify-between px-2 py-1.5 cursor-default"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">Time Range</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Timezone: {tzLabel}</span>
                </div>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-2"
                    aria-label="Select timezone"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setTzPopoverOpen(true);
                    }}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </div>

              {timeOptions.map((item, idx) => (
                <SelectItem key={idx} value={formatTimeRange(item.value, timeZone)}>
                  {item.display}
                </SelectItem>
              ))}

              {showCustomTimeRange && (
                <SelectItem value="__custom__">
                  {lastOption.display}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </Popover>
      </Popover>
    </div>
  );
}
