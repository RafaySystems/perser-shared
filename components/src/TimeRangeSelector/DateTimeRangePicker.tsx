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

import { ReactElement, useState } from 'react';
import { AbsoluteTimeRange } from '@perses-dev/spec';
import { TZDate } from '@date-fns/tz';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { cn } from '../ui/lib/utils';
import { validateDateRange } from './utils';

export interface AbsoluteTimeFormProps {
  initialTimeRange: AbsoluteTimeRange;
  onChange: (timeRange: AbsoluteTimeRange) => void;
  onCancel: () => void;
  timeZone: string;
}

function pad(v: number): string {
  return `${v}`.padStart(2, '0');
}

function toTimeValue(value: Date): string {
  return `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
}

function mergeDateAndTime(day: Date, timeValue: string): Date {
  const [h = '0', m = '0', s = '0'] = timeValue.split(':');
  const next = new Date(day);
  next.setHours(Number(h), Number(m), Number(s), 0);
  return next;
}

function formatDisplay(value: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: ['local', 'browser'].includes(timeZone.toLowerCase())
        ? undefined
        : timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(value);
  } catch {
    return value.toLocaleString();
  }
}

/**
 * Absolute start/end picker using shadcn Calendar (react-day-picker).
 */
export const DateTimeRangePicker = ({
  initialTimeRange,
  onChange,
  onCancel,
  timeZone,
}: AbsoluteTimeFormProps): ReactElement => {
  const stdTimeZone = ['local', 'browser'].includes(timeZone.toLowerCase())
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : timeZone;
  const [timeRange, setTimeRange] = useState<AbsoluteTimeRange>(initialTimeRange);
  const [active, setActive] = useState<'start' | 'end'>('start');

  const activeDate =
    active === 'start'
      ? new TZDate(timeRange.start, stdTimeZone)
      : new TZDate(timeRange.end, stdTimeZone);

  const changeSegment = (segment: 'start' | 'end', next: Date): void => {
    setTimeRange((prev) => ({ ...prev, [segment]: next }));
  };

  const onApply = (): void => {
    if (validateDateRange(timeRange.start, timeRange.end)) {
      onChange({ start: timeRange.start, end: timeRange.end });
    }
  };

  return (
    <div
      className="flex w-[20rem] flex-col gap-3 p-3"
      style={{
        backgroundColor: 'hsl(var(--popover))',
        color: 'hsl(var(--popover-foreground))',
      }}
    >
      <div className="flex gap-1 rounded-md border border-border p-1">
        {(['start', 'end'] as const).map((segment) => (
          <button
            key={segment}
            type="button"
            className={cn(
              'flex-1 rounded-sm px-2 py-1.5 text-xs font-medium capitalize transition-colors',
              active === segment
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={() => setActive(segment)}
          >
            {segment}
          </button>
        ))}
      </div>

      <Calendar
        mode="single"
        selected={activeDate}
        onSelect={(day) => {
          if (!day) return;
          const prev = active === 'start' ? timeRange.start : timeRange.end;
          changeSegment(active, mergeDateAndTime(day, toTimeValue(prev)));
        }}
      />

      <label className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Time</span>
        <input
          type="time"
          step={1}
          className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          value={toTimeValue(active === 'start' ? timeRange.start : timeRange.end)}
          onChange={(e) => {
            const prev = active === 'start' ? timeRange.start : timeRange.end;
            changeSegment(active, mergeDateAndTime(prev, e.target.value));
          }}
        />
      </label>

      <div className="grid gap-1 text-xs text-muted-foreground">
        <button
          type="button"
          className={cn(
            'rounded-md border border-border px-2 py-1.5 text-left transition-colors hover:bg-accent',
            active === 'start' && 'border-primary text-foreground'
          )}
          onClick={() => setActive('start')}
        >
          Start: {formatDisplay(timeRange.start, stdTimeZone)}
        </button>
        <button
          type="button"
          className={cn(
            'rounded-md border border-border px-2 py-1.5 text-left transition-colors hover:bg-accent',
            active === 'end' && 'border-primary text-foreground'
          )}
          onClick={() => setActive('end')}
        >
          End: {formatDisplay(timeRange.end, stdTimeZone)}
        </button>
      </div>

      <div className="flex gap-2">
        <Button variant="contained" className="flex-1" onClick={onApply}>
          Apply
        </Button>
        <Button variant="outlined" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
