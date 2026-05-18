// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ReactElement } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { TableCell, TableCellProps } from './TableCell';
import { SortDirection } from './model/table-model';

export interface TableHeaderCellProps extends TableCellProps {
  onSort?: ((event: unknown) => void) | undefined;
  sortDirection?: SortDirection;
  nextSortDirection?: SortDirection;
  resizeConfig?: ResizeConfig;
}

export interface ResizeConfig {
  resizeHandler: (event: unknown) => void;
  resetSizeHandler: () => void;
  isResizing: boolean;
}

export function TableHeaderCell({
  onSort,
  sortDirection,
  nextSortDirection,
  children,
  resizeConfig,
  ...cellProps
}: TableHeaderCellProps): ReactElement {
  const showSortLabel = !!onSort;
  const isActive = !!sortDirection;
  const direction = isActive ? sortDirection : nextSortDirection;

  const SortIcon = isActive
    ? direction === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  const headerText = (
    <span className="truncate max-w-full">{children}</span>
  );

  return (
    <TableCell {...cellProps}>
      {showSortLabel ? (
        <button
          onClick={onSort as React.MouseEventHandler}
          className={cn(
            'inline-flex items-center gap-1 max-w-full align-middle cursor-pointer select-none',
            'focus-visible:outline-none',
            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          type="button"
        >
          {headerText}
          <SortIcon
            className={cn(
              'h-3.5 w-3.5 shrink-0',
              isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'
            )}
          />
        </button>
      ) : (
        headerText
      )}
      {resizeConfig && (
        <div
          onMouseDown={(e) => {
            if (e.detail === 2) {
              resizeConfig.resetSizeHandler();
              return;
            }
            resizeConfig.resizeHandler(e);
          }}
          onTouchStart={resizeConfig.resizeHandler as React.TouchEventHandler}
          className="absolute h-full top-0 right-1 cursor-col-resize"
        >
          <div
            className={cn(
              'h-full w-0.5 rounded-sm border-l-2 touch-none select-none translate-x-1',
              resizeConfig.isResizing ? 'border-foreground' : 'border-border'
            )}
          />
        </div>
      )}
    </TableCell>
  );
}
