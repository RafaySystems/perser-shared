import type React from 'react';
import { cn } from './lib/utils';

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
  anchor?: 'left' | 'right';
}

export function Drawer({
  open = false,
  onClose,
  anchor = 'right',
  className,
  children,
  ...props
}: DrawerProps): React.ReactElement | null {
  if (!open) return null;
  const sideClass = anchor === 'left' ? 'left-0' : 'right-0';
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close drawer" />
      <div
        className={cn(
          'absolute top-0 h-full w-[min(100%,1080px)] overflow-hidden border bg-background shadow-xl',
          sideClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

