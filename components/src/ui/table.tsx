import type React from 'react';
import { createContext, forwardRef, useContext } from 'react';
import { cn } from './lib/utils';

const SectionContext = createContext<'head' | 'body' | 'foot' | null>(null);

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>): React.ReactElement {
  return <table className={cn('w-full caption-bottom text-sm', className)} {...props} />;
}

export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...props }, ref) {
    return (
      <SectionContext.Provider value="head">
        <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
      </SectionContext.Provider>
    );
  }
);

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...props }, ref) {
    return (
      <SectionContext.Provider value="body">
        <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
      </SectionContext.Provider>
    );
  }
);

export const TableFooter = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  function TableFooter({ className, ...props }, ref) {
    return (
      <SectionContext.Provider value="foot">
        <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium', className)} {...props} />
      </SectionContext.Provider>
    );
  }
);

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  function TableRow({ className, ...props }, ref) {
    return <tr ref={ref} className={cn('border-b transition-colors hover:bg-muted/50', className)} {...props} />;
  }
);

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>): React.ReactElement {
  return <th className={cn('h-10 px-2 text-left align-middle font-medium text-muted-foreground', className)} {...props} />;
}

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement> & Record<string, unknown>>(
  function TableCell({ className, ...props }, ref) {
    const section = useContext(SectionContext);
    const { component, variant, ...rest } = props;
    if (component === 'th' || variant === 'head' || section === 'head') {
      return (
        <th
          ref={ref as React.Ref<HTMLTableCellElement>}
          className={cn('h-10 px-2 align-middle text-left font-medium text-muted-foreground', className)}
          {...(rest as any)}
        />
      );
    }
    return <td ref={ref} className={cn('p-2 align-middle', className)} {...(rest as any)} />;
  }
);

