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

import { Column, ColumnSizingInfoState, ColumnSizingState, flexRender, HeaderGroup, Row } from '@tanstack/react-table';
import { TableComponents, TableVirtuoso, TableVirtuosoHandle, TableVirtuosoProps } from 'react-virtuoso';
import { ReactElement, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableToolbar, TableToolbarProps } from './TableToolbar';
import { TableRow } from './TableRow';
import { TableBody } from './TableBody';
import { InnerTable } from './InnerTable';
import { TableHead } from './TableHead';
import { TableHeaderCell } from './TableHeaderCell';
import { TableCell, TableCellProps } from './TableCell';
import { VirtualizedTableContainer } from './VirtualizedTableContainer';
import { TableCellConfigs, TableProps, TableRowEventOpts } from './model/table-model';
import { useVirtualizedTableKeyboardNav } from './hooks/useVirtualizedTableKeyboardNav';
import { TableFoot } from './TableFoot';
import { Button } from '../ui/button';

type TableCellPosition = {
  row: number;
  column: number;
};

export type VirtualizedTableProps<TableData> = Required<
  Pick<TableProps<TableData>, 'height' | 'width' | 'density' | 'defaultColumnHeight' | 'defaultColumnWidth'>
> &
  Pick<TableProps<TableData>, 'onRowMouseOver' | 'onRowMouseOut' | 'pagination' | 'onPaginationChange'> & {
    onRowClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => void;
    rows: Array<Row<TableData>>;
    columns: Array<Column<TableData, unknown>>;
    headers: Array<HeaderGroup<TableData>>;
    columnSizing: ColumnSizingState;
    columnSizingInfo: ColumnSizingInfoState;
    cellConfigs?: TableCellConfigs;
    rowCount: number;
    toolbarConfig: Pick<
      TableToolbarProps<TableData>,
      | 'isSearchEnabled'
      | 'globalFilter'
      | 'onGlobalFilterChange'
      | 'isColumnFilterEnabled'
      | 'columns'
      | 'columnFilterMenuMaxHeight'
      | 'isExpandAllEnabled'
      | 'isAllExpanded'
      | 'onExpandAllChange'
    >;
  };

export function VirtualizedTable<TableData>({
  width,
  height,
  density,
  defaultColumnWidth,
  defaultColumnHeight,
  onRowClick,
  onRowMouseOver,
  onRowMouseOut,
  rows,
  columns,
  headers,
  columnSizing,
  columnSizingInfo,
  cellConfigs,
  pagination,
  onPaginationChange,
  rowCount,
  toolbarConfig,
}: VirtualizedTableProps<TableData>): ReactElement {
  const virtuosoRef = useRef<TableVirtuosoHandle>(null);
  const visibleRange = useRef({
    startIndex: 0,
    endIndex: 0,
  });

  const setVisibleRange: TableVirtuosoProps<TableData, unknown>['rangeChanged'] = (newVisibleRange) => {
    visibleRange.current = newVisibleRange;
  };

  const keyboardNav = useVirtualizedTableKeyboardNav({
    visibleRange: visibleRange,
    virtualTable: virtuosoRef,
    maxRows: rows.length + 1,
    maxColumns: columns.length,
  });

  const getFocusState = (cellPosition: TableCellPosition): TableCellProps['focusState'] => {
    if (cellPosition.row === keyboardNav.activeCell.row && cellPosition.column === keyboardNav.activeCell.column) {
      return keyboardNav.isActive ? 'trigger-focus' : 'focus-next';
    }
    return 'none';
  };

  const VirtuosoTableComponents: TableComponents<TableData> = useMemo(() => {
    return {
      Scroller: VirtualizedTableContainer,
      Table: (props): ReactElement => {
        return (
          <InnerTable
            {...props}
            width={width}
            density={density}
            onKeyDown={keyboardNav.onTableKeyDown}
            onBlur={keyboardNav.onTableBlur}
          />
        );
      },
      TableHead,
      TableFoot,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      TableRow: ({ item, ...props }): ReactElement | null => {
        const index = props['data-index'];
        const row = rows[index];
        if (!row) {
          return null;
        }

        const rowEventOpts: TableRowEventOpts = { id: row.id, index: row.index };

        return (
          <TableRow
            {...props}
            onClick={(e) => onRowClick(e, row.id)}
            density={density}
            onMouseOver={(e) => {
              onRowMouseOver?.(e, rowEventOpts);
            }}
            onMouseOut={(e) => {
              onRowMouseOut?.(e, rowEventOpts);
            }}
          />
        );
      },
      TableBody,
    };
  }, [
    density,
    keyboardNav.onTableKeyDown,
    keyboardNav.onTableBlur,
    onRowClick,
    onRowMouseOut,
    onRowMouseOver,
    rows,
    width,
  ]);

  const handleChangePage = (_event: unknown, newPage: number): void => {
    if (!pagination || !onPaginationChange) return;
    onPaginationChange({ ...pagination, pageIndex: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    if (!pagination || !onPaginationChange) return;
    onPaginationChange({ pageIndex: 0, pageSize: parseInt(event.target.value, 10) });
  };

  const columnSizeVars = useMemo(() => {
    const colSizes: { [key: string]: number } = {};
    headers.forEach((headerGroup) => {
      headerGroup.headers
        .filter((header) => header.column.getCanResize())
        .forEach((header) => {
          colSizes[`--header-${header.id}-size`] = header.getSize();
          colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
        });
    });
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizingInfo, columnSizing, headers]);

  const totalPages = pagination ? Math.ceil(rowCount / pagination.pageSize) : 0;
  const currentPage = pagination ? pagination.pageIndex : 0;

  return (
    <div style={{ width, height, ...columnSizeVars }}>
      <TableToolbar {...toolbarConfig} width={width} />
      <TableVirtuoso
        ref={virtuosoRef}
        totalCount={rows.length}
        components={VirtuosoTableComponents}
        rangeChanged={setVisibleRange}
        fixedHeaderContent={() => {
          return (
            <>
              {headers.map((headerGroup) => {
                return (
                  <TableRow key={headerGroup.id} density={density}>
                    {headerGroup.headers.map((header, i, headers) => {
                      const column = header.column;
                      const position: TableCellPosition = {
                        row: 0,
                        column: i,
                      };

                      const isSorted = column.getIsSorted();
                      const nextSorting = column.getNextSortingOrder();

                      return (
                        <TableHeaderCell
                          key={header.id}
                          onSort={column.getCanSort() ? column.getToggleSortingHandler() : undefined}
                          sortDirection={typeof isSorted === 'string' ? isSorted : undefined}
                          nextSortDirection={typeof nextSorting === 'string' ? nextSorting : undefined}
                          width={
                            header.column.getCanResize()
                              ? `calc(var(--header-${header?.id}-size) * 1px)`
                              : column.getSize() || defaultColumnWidth
                          }
                          defaultColumnHeight={defaultColumnHeight}
                          align={column.columnDef.meta?.align}
                          variant="head"
                          density={density}
                          description={column.columnDef.meta?.headerDescription}
                          focusState={getFocusState(position)}
                          onFocusTrigger={() => keyboardNav.onCellFocus(position)}
                          isFirstColumn={i === 0}
                          isLastColumn={i === headers.length - 1}
                          resizeConfig={
                            header.column.getCanResize()
                              ? {
                                  resizeHandler: header.getResizeHandler(),
                                  resetSizeHandler: header.column.resetSize,
                                  isResizing: header.column.getIsResizing(),
                                }
                              : undefined
                          }
                        >
                          {flexRender(column.columnDef.header, header.getContext())}
                        </TableHeaderCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </>
          );
        }}
        fixedFooterContent={
          pagination
            ? (): ReactElement => (
                <tr className="bg-background">
                  <td colSpan={columns.length} className="px-3 py-2">
                    <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span>Rows per page:</span>
                        <select
                          value={pagination.pageSize}
                          onChange={handleChangeRowsPerPage}
                          className="bg-background border border-border rounded px-1 py-0.5 text-sm cursor-pointer"
                          aria-label="rows per page"
                        >
                          {[10, 25, 50, 100].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span>
                        {currentPage * pagination.pageSize + 1}–
                        {Math.min((currentPage + 1) * pagination.pageSize, rowCount)} of {rowCount}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => handleChangePage(e, currentPage - 1)}
                          disabled={currentPage === 0}
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => handleChangePage(e, currentPage + 1)}
                          disabled={currentPage >= totalPages - 1}
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            : undefined
        }
        itemContent={(index) => {
          const row = rows[index];
          if (!row) {
            return null;
          }

          return (
            <>
              {row.getVisibleCells().map((cell, i, cells) => {
                const position: TableCellPosition = {
                  row: index + 1,
                  column: i,
                };

                const cellContext = cell.getContext();
                const cellConfig = cellConfigs?.[cellContext.cell.id];

                const cellRenderFn = cell.column.columnDef.cell;
                const cellContent = typeof cellRenderFn === 'function' ? cellRenderFn(cellContext) : null;

                const cellDescriptionDef = cell.column.columnDef.meta?.cellDescription;
                let description: string | undefined = undefined;
                if (typeof cellDescriptionDef === 'function') {
                  description = cellDescriptionDef(cellContext);
                } else if (cellDescriptionDef && typeof cellContent === 'string') {
                  description = cellContent;
                }

                const adjacentCellsValuesMap = Object.entries(row.original as Record<string, unknown>)
                  ?.filter(([_, value]) => ['string', 'number'].includes(typeof value))
                  .reduce(
                    (acc, [key, value]) => ({
                      ...acc,
                      [key]: String(value),
                    }),
                    {}
                  );

                return (
                  <TableCell
                    key={cell.id}
                    data-testid={cell.id}
                    title={description || cellConfig?.text || (cellContent as string | undefined)}
                    width={
                      cell.column.getCanResize()
                        ? `calc(var(--col-${cell.column.id}-size) * 1px)`
                        : cell.column.getSize() || defaultColumnWidth
                    }
                    defaultColumnHeight={defaultColumnHeight}
                    align={cell.column.columnDef.meta?.align}
                    density={density}
                    focusState={getFocusState(position)}
                    onFocusTrigger={() => keyboardNav.onCellFocus(position)}
                    isFirstColumn={i === 0}
                    isLastColumn={i === cells.length - 1}
                    description={description}
                    color={cellConfig?.textColor ?? undefined}
                    backgroundColor={cellConfig?.backgroundColor ?? undefined}
                    dataLink={cell.column.columnDef.meta?.dataLink}
                    adjacentCellsValuesMap={adjacentCellsValuesMap}
                  >
                    {cellConfig?.text || cellContent}
                  </TableCell>
                );
              })}
            </>
          );
        }}
      />
    </div>
  );
}
