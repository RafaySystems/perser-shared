import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { buttonVariants } from './button';

// ─── Primitives (shadcn-style) ────────────────────────────────────────────────

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  )
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<'button'>;

const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
  <button
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({ variant: isActive ? 'outline' : 'ghost', size: 'icon' }),
      'h-8 w-8 text-xs',
      isActive && 'border-primary text-primary font-semibold',
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<'button'>) => (
  <button
    aria-label="Go to previous page"
    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-8 px-2 gap-1', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only sm:not-sr-only text-xs">Previous</span>
  </button>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: React.ComponentProps<'button'>) => (
  <button
    aria-label="Go to next page"
    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-8 px-2 gap-1', className)}
    {...props}
  >
    <span className="sr-only sm:not-sr-only text-xs">Next</span>
    <ChevronRight className="h-4 w-4" />
  </button>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-8 w-8 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

// ─── High-level controlled component ─────────────────────────────────────────

export interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Max page buttons to show before collapsing with ellipsis (default 7) */
  siblingCount?: number;
}

function buildPageRange(page: number, total: number, siblingCount = 1): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left  = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, total - 1);
  const pages: (number | '…')[] = [1];

  if (left > 2)  pages.push('…');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

export const PaginationBar = ({ page, totalPages, onPageChange, className, siblingCount }: PaginationBarProps) => {
  if (totalPages <= 1) return null;
  const range = buildPageRange(page, totalPages, siblingCount);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => onPageChange(page - 1)} disabled={page <= 1} />
        </PaginationItem>
        {range.map((p, i) =>
          p === '…' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => onPageChange(p as number)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// ─── DataTablePagination — full table footer with rows-per-page + first/last ─

export interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  totalRows: number;
  selectedRows: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export const DataTablePagination = ({
  page,
  totalPages,
  totalRows,
  selectedRows,
  pageSize,
  pageSizeOptions = [10, 20, 30, 50],
  onPageChange,
  onPageSizeChange,
  className,
}: DataTablePaginationProps) => {
  const btnCls = cn(
    buttonVariants({ variant: 'outline', size: 'icon' }),
    'h-8 w-8'
  );
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-t text-sm', className)}>
      <span className="text-muted-foreground">
        {selectedRows} of {totalRows} row(s) selected.
      </span>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-medium whitespace-nowrap">Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <span className="font-medium whitespace-nowrap">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <div className="flex items-center gap-1">
          <button className={btnCls} onClick={() => onPageChange(1)} disabled={page <= 1} aria-label="First page">
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button className={btnCls} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className={btnCls} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className={btnCls} onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} aria-label="Last page">
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
