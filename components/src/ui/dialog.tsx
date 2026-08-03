import type React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './lib/utils';

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  open?: boolean;
  onClose?: (event?: unknown, reason?: string) => void;
  children?: React.ReactNode;
  /** MUI compat — ignored visually, kept so callers can pass them. */
  fullWidth?: boolean;
  maxWidth?: string | false;
  scroll?: string;
  TransitionProps?: { onExited?: () => void };
  slotProps?: { transition?: { onExited?: () => void } };
}

export function Dialog({
  open = false,
  onClose,
  className,
  children,
  fullWidth: _fullWidth,
  maxWidth: _maxWidth,
  scroll: _scroll,
  TransitionProps,
  slotProps,
  ...props
}: DialogProps): React.ReactElement | null {
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    // MUI Transition onExited — callers rely on this to finish close.
    const exited = slotProps?.transition?.onExited ?? TransitionProps?.onExited;
    exited?.();
  }, [open, slotProps, TransitionProps]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose?.(event, 'escapeKeyDown');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 bg-black/50"
        onClick={(event) => onClose?.(event, 'backdropClick')}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  ) as React.ReactElement;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('min-h-0 flex-1 overflow-auto px-6 py-4 text-sm', className)} {...props} />;
}

export function DialogActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('flex items-center justify-end gap-2 border-t border-border px-6 py-4', className)} {...props} />;
}
