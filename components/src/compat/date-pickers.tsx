import type React from 'react';
import { useEffect, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { cn } from '../ui/lib/utils';

interface BasicProps {
  value?: Date | string | null;
  onChange?: (value: Date | null) => void;
  onAccept?: (value: Date | null) => void;
  label?: string;
  className?: string;
}

function pad(v: number): string {
  return `${v}`.padStart(2, '0');
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const d = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(d.getTime()) ? null : d;
}

function toTimeValue(value: Date | null): string {
  if (!value) return '00:00:00';
  return `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
}

function mergeDateAndTime(day: Date, timeValue: string): Date {
  const [h = '0', m = '0', s = '0'] = timeValue.split(':');
  const next = new Date(day);
  next.setHours(Number(h), Number(m), Number(s), 0);
  return next;
}

function formatDisplay(value: Date | null): string {
  if (!value) return '';
  return value.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function LocalizationProvider({ children }: { children: React.ReactNode } & Record<string, unknown>): React.ReactElement {
  return <>{children}</>;
}

/**
 * Editable datetime field — date via shadcn Calendar, time via styled input.
 * Replaces the previous native `<input type="datetime-local">` (white OS calendar).
 */
export function DateTimeField({
  value,
  onChange,
  label,
  className,
  ...props
}: BasicProps & Record<string, unknown>): React.ReactElement {
  const {
    ['data-testid']: dataTestId,
    timezone: _timezone,
    format: _format,
    onBlur,
    ...rest
  } = props as Record<string, unknown>;

  const [inner, setInner] = useState<Date | null>(() => toDate(value));
  const [showCal, setShowCal] = useState(false);

  useEffect(() => {
    setInner(toDate(value));
  }, [value]);

  const commit = (next: Date | null): void => {
    setInner(next);
    onChange?.(next);
  };

  return (
    <label className={cn('relative grid min-w-0 flex-1 gap-1 text-xs', className)} data-testid={dataTestId as string | undefined}>
      {label ? <span className="text-muted-foreground">{label}</span> : null}
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 text-left text-sm text-foreground"
        onClick={() => setShowCal((v) => !v)}
        onBlur={onBlur as React.FocusEventHandler<HTMLButtonElement> | undefined}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <span className="truncate">{formatDisplay(inner) || 'Pick date & time'}</span>
      </button>
      {showCal ? (
        <div
          className="absolute left-0 top-full z-50 mt-1 rounded-md border border-border p-2 shadow-md"
          style={{
            backgroundColor: 'hsl(var(--popover))',
            color: 'hsl(var(--popover-foreground))',
          }}
        >
          <Calendar
            mode="single"
            selected={inner ?? undefined}
            onSelect={(day) => {
              if (!day) return;
              commit(mergeDateAndTime(day, toTimeValue(inner)));
            }}
          />
          <div className="mt-2 flex items-center gap-2 px-1 pb-1">
            <span className="text-muted-foreground">Time</span>
            <input
              type="time"
              step={1}
              className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-sm text-foreground"
              value={toTimeValue(inner)}
              onChange={(e) => {
                const base = inner ?? new Date();
                commit(mergeDateAndTime(base, e.target.value));
              }}
            />
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground"
              onClick={() => setShowCal(false)}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </label>
  );
}

/**
 * Stand-in for MUI X StaticDateTimePicker using shadcn Calendar + time input.
 */
export function StaticDateTimePicker({
  value,
  onChange,
  onAccept,
  className,
  ...props
}: BasicProps & Record<string, unknown>): React.ReactElement {
  const [inner, setInner] = useState<Date | null>(() => toDate(value));

  useEffect(() => {
    setInner(toDate(value));
  }, [value]);

  const {
    ['data-testid']: dataTestId,
    displayStaticWrapperAs: _displayStaticWrapperAs,
    openTo: _openTo,
    disableHighlightToday: _disableHighlightToday,
    showDaysOutsideCurrentMonth: _showDaysOutsideCurrentMonth,
    timezone: _timezone,
    format: _format,
    slots: _slots,
    slotProps: _slotProps,
    ampm: _ampm,
    views: _views,
    sx: _sx,
    minDateTime: _minDateTime,
    maxDateTime: _maxDateTime,
  } = props as Record<string, unknown>;

  const commit = (next: Date | null): void => {
    setInner(next);
    onChange?.(next);
  };

  return (
    <div
      data-testid={dataTestId as string | undefined}
      className={cn('flex w-[min(100%,20rem)] flex-col gap-3', className)}
      style={{
        backgroundColor: 'hsl(var(--popover))',
        color: 'hsl(var(--popover-foreground))',
      }}
    >
      <Calendar
        mode="single"
        selected={inner ?? undefined}
        onSelect={(day) => {
          if (!day) return;
          commit(mergeDateAndTime(day, toTimeValue(inner)));
        }}
      />
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-muted-foreground">Time</span>
        <input
          type="time"
          step={1}
          className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          value={toTimeValue(inner)}
          onChange={(e) => {
            const base = inner ?? new Date();
            commit(mergeDateAndTime(base, e.target.value));
          }}
        />
      </div>
      <button
        type="button"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        onClick={() => onAccept?.(inner)}
      >
        Accept
      </button>
    </div>
  );
}

export class AdapterDateFns {}
