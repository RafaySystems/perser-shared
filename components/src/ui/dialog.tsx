import type React from 'react';
import { cn } from './lib/utils';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
}

export function Dialog({ open = false, onClose, className, children, ...props }: DialogProps): React.ReactElement | null {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className={cn('relative z-10 w-full max-w-2xl rounded-lg border bg-background shadow-lg', className)} {...props}>
        {children}
      </div>
    </div>
  );
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return <h2 className={cn('px-6 pt-5 text-lg font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('px-6 py-4 text-sm', className)} {...props} />;
}

export function DialogActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('flex items-center justify-end gap-2 px-6 pb-5 pt-2', className)} {...props} />;
}

