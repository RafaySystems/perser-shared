import type React from 'react';
import { cn } from './lib/utils';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title'> {
  title?: React.ReactNode;
}

export function Tooltip({ title, className, children, ...props }: TooltipProps): React.ReactElement {
  return (
    <span className={cn('group relative inline-flex', className)} {...props}>
      {children}
      {title ? (
        <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow group-hover:block">
          {title}
        </span>
      ) : null}
    </span>
  );
}

