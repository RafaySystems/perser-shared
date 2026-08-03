import type React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn, toStyle } from './lib/utils';

export interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  open?: boolean;
  onClose?: (event?: unknown, reason?: string) => void;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  children?: React.ReactNode;
  PaperProps?: { sx?: unknown; className?: string; style?: React.CSSProperties };
  TransitionProps?: { onExited?: () => void };
  slotProps?: { transition?: { onExited?: () => void } };
  'aria-hidden'?: boolean | 'true' | 'false';
}

export function Drawer({
  open = false,
  onClose,
  anchor = 'right',
  className,
  children,
  PaperProps,
  TransitionProps,
  slotProps,
  ...props
}: DrawerProps): React.ReactElement | null {
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
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

  const sideClass =
    anchor === 'left'
      ? 'left-0 top-0 h-full'
      : anchor === 'right'
        ? 'right-0 top-0 h-full'
        : anchor === 'top'
          ? 'left-0 top-0 w-full'
          : 'left-0 bottom-0 w-full';

  return createPortal(
    <div className="fixed inset-0 z-[1500]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={(event) => onClose?.(event, 'backdropClick')}
        aria-label="Close drawer"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute flex flex-col overflow-hidden border border-border bg-background text-foreground shadow-xl',
          sideClass,
          className,
          PaperProps?.className
        )}
        style={{
          ...toStyle((PaperProps as { sx?: unknown } | undefined)?.sx),
          ...PaperProps?.style,
          ...(props.style as React.CSSProperties),
        }}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  ) as React.ReactElement;
}
