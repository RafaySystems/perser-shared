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
import { Button } from '../ui/button';
import { ErrorBoundary } from '../ErrorBoundary';
import { ErrorAlert } from '../ErrorAlert';
import { validateDateRange } from './utils';

export interface AbsoluteTimeFormProps {
  initialTimeRange: AbsoluteTimeRange;
  onChange: (timeRange: AbsoluteTimeRange) => void;
  onCancel: () => void;
  timeZone: string;
}

/**
 * Converts a Date to a local datetime-local input string value (YYYY-MM-DDTHH:MM).
 */
function toDatetimeLocalString(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/**
 * Start and End datetime picker, allowing users to select a specific time range
 * using two absolute dates and times.
 */
export const DateTimeRangePicker = ({
  initialTimeRange,
  onChange,
  onCancel,
}: AbsoluteTimeFormProps): ReactElement => {
  const [timeRange, setTimeRange] = useState<AbsoluteTimeRange>(initialTimeRange);

  const changeTimeRange = (newTime: Date, segment: keyof AbsoluteTimeRange): void => {
    setTimeRange((prev) => ({ ...prev, [segment]: newTime }));
  };

  const updateDateRange = (): { start: Date; end: Date } | undefined => {
    const newDates = { start: timeRange.start, end: timeRange.end };
    return validateDateRange(newDates.start, newDates.end) ? newDates : undefined;
  };

  const onApply = (): void => {
    const newDates = updateDateRange();
    if (newDates) {
      onChange(newDates);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 pb-4">
      <ErrorBoundary FallbackComponent={ErrorAlert}>
        <div className="flex flex-col gap-1">
          <label htmlFor="start-time-input" className="text-sm font-medium text-foreground">
            Start Time
          </label>
          <input
            id="start-time-input"
            data-testid="start_time_input"
            type="datetime-local"
            value={toDatetimeLocalString(new Date(timeRange.start))}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) {
                changeTimeRange(date, 'start');
              }
            }}
            onBlur={() => updateDateRange()}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ErrorAlert}>
        <div className="flex flex-col gap-1">
          <label htmlFor="end-time-input" className="text-sm font-medium text-foreground">
            End Time
          </label>
          <input
            id="end-time-input"
            data-testid="end_time_input"
            type="datetime-local"
            value={toDatetimeLocalString(new Date(timeRange.end))}
            min={toDatetimeLocalString(new Date(timeRange.start))}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) {
                changeTimeRange(date, 'end');
              }
            }}
            onBlur={() => updateDateRange()}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </ErrorBoundary>
      <div className="flex flex-row gap-2 px-1">
        <Button variant="default" onClick={onApply} className="flex-1">
          Apply
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};
