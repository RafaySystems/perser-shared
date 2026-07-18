import type React from 'react';
import { cn } from './lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  severity?: 'error' | 'warning' | 'info' | 'success';
}

const severityClasses: Record<NonNullable<AlertProps['severity']>, string> = {
  error: 'border-destructive/40 text-destructive bg-destructive/10',
  warning: 'border-yellow-500/40 text-yellow-700 bg-yellow-500/10 dark:text-yellow-300',
  info: 'border-blue-500/40 text-blue-700 bg-blue-500/10 dark:text-blue-300',
  success: 'border-green-500/40 text-green-700 bg-green-500/10 dark:text-green-300',
};

export function Alert({ className, severity = 'info', ...props }: AlertProps): React.ReactElement {
  return (
    <div
      role="alert"
      className={cn('w-full rounded-md border px-4 py-3 text-sm', severityClasses[severity], className)}
      {...props}
    />
  );
}

