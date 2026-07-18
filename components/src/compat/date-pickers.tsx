import type React from 'react';
import { useState } from 'react';

interface BasicProps {
  value?: Date | string | null;
  onChange?: (value: Date | null) => void;
}

function pad(v: number): string {
  return `${v}`.padStart(2, '0');
}

function formatDateTime(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}`;
}

function toInputValue(value: Date | string | null | undefined): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  return formatDateTime(new Date(d.getTime() - d.getTimezoneOffset() * 60000));
}

function fromInputValue(value: string): Date | null {
  if (!value) return null;
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function LocalizationProvider({ children }: { children: React.ReactNode } & Record<string, unknown>): React.ReactElement {
  return <>{children}</>;
}

export function DateTimeField({ value, onChange, ...props }: BasicProps & Record<string, unknown>): React.ReactElement {
  const { type: _type, ['data-testid']: dataTestId, ...rest } = props as React.InputHTMLAttributes<HTMLInputElement> &
    Record<string, unknown>;
  return (
    <div data-testid={dataTestId as string | undefined}>
      <input
        type="text"
        value={toInputValue(value)}
        onChange={(e) => onChange?.(fromInputValue(e.target.value))}
        {...rest}
      />
    </div>
  );
}

export function StaticDateTimePicker({ value, onChange, ...props }: BasicProps & Record<string, unknown>): React.ReactElement {
  const [inner, setInner] = useState<string>(toInputValue(value));
  const {
    type: _type,
    ['data-testid']: dataTestId,
    displayStaticWrapperAs: _displayStaticWrapperAs,
    openTo: _openTo,
    disableHighlightToday: _disableHighlightToday,
    showDaysOutsideCurrentMonth: _showDaysOutsideCurrentMonth,
    timezone: _timezone,
    format: _format,
    onAccept: _onAccept,
    slots: _slots,
    slotProps: _slotProps,
    ampm: _ampm,
    views: _views,
    sx: _sx,
    ...rest
  } = props as React.InputHTMLAttributes<HTMLInputElement> & Record<string, unknown>;
  return (
    <div data-testid={dataTestId as string | undefined}>
      <input
        type="text"
        value={inner}
        onChange={(e) => {
          setInner(e.target.value);
          onChange?.(fromInputValue(e.target.value));
        }}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    </div>
  );
}

export class AdapterDateFns {}

