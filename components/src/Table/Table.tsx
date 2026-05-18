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

import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import { useFuzzySearch } from './hooks/useFuzzySearch';
import { TableCheckbox } from './TableCheckbox';
import { VirtualizedTable } from './VirtualizedTable';
import { DEFAULT_COLUMN_WIDTH, persesColumnsToTanstackColumns, TableProps } from './model/table-model';

const DEFAULT_GET_ROW_ID = (data: unknown, index: number): string => {
  return `${index}`;
};

const DEFAULT_ROW_SELECTION: NonNullable<TableProps<unknown>['rowSelection']> = {};
const DEFAULT_SORTING: NonNullable<TableProps<unknown>['sorting']> = [];

/**
 * Component used to render tabular data in Perses use cases. This component is
 * **not** intended to be a general use data table for use cases unrelated to Perses.
 *
 * **Note: This component is currently experimental and is likely to have significant breaking changes in the near future. Use with caution outside of the core Perses codebase.**
 */
export function Table<TableData>({
  data,
  columns,
  cellConfigs,
  density = 'standard',
  defaultColumnWidth = DEFAULT_COLUMN_WIDTH,
  defaultColumnHeight = 'auto',
  checkboxSelection,
  onRowSelectionChange,
  onSortingChange,
  getCheckboxColor,
  getRowId = DEFAULT_GET_ROW_ID,
  rowSelection = DEFAULT_ROW_SELECTION,
  sorting = DEFAULT_SORTING,
  getItemActions,
  hasItemActions,
  pagination,
  onPaginationChange,
  rowSelectionVariant = 'standard',
  getSubRows,
  hiddenColumns,
  tableToolbarConfig,
  columnResizeMode = 'onChange',
  defaultColumnConfig,
  ...otherProps
}: TableProps<TableData>): ReactElement {
  const hasSubRows = !!getSubRows;

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const { globalFilter, setGlobalFilter, fuzzySearchOptions } = useFuzzySearch<TableData>(
    tableToolbarConfig?.isSearchEnabled,
    tableToolbarConfig?.fuzzyMatchThreshold ?? 'CONTAINS',
    expanded,
    setExpanded
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    hiddenColumns?.reduce((acc, columnId) => ({ ...acc, [columnId]: false }), {}) ?? {}
  );

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (rowSelectionUpdater) => {
    const newRowSelection =
      typeof rowSelectionUpdater === 'function' ? rowSelectionUpdater(rowSelection) : rowSelectionUpdater;
    onRowSelectionChange?.(newRowSelection);
  };

  const handleRowSelectionEvent = useCallback(
    (table: TanstackTable<TableData>, row: Row<TableData>, isModified: boolean) => {
      if (rowSelectionVariant === 'standard' || isModified) {
        row.toggleSelected();
      } else {
        if (row.getIsSelected() && !table.getIsAllRowsSelected()) {
          table.toggleAllRowsSelected();
        } else {
          onRowSelectionChange?.({
            [row.id]: true,
          });
        }
      }
    },
    [onRowSelectionChange, rowSelectionVariant]
  );

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, table: TanstackTable<TableData>, row: Row<TableData>) => {
      const nativePointerEvent =
        e.nativeEvent && (e.nativeEvent instanceof MouseEvent || e.nativeEvent instanceof KeyboardEvent)
          ? (e.nativeEvent as PointerEvent)
          : undefined;
      const isModifed = !!nativePointerEvent?.metaKey || !!nativePointerEvent?.shiftKey;
      handleRowSelectionEvent(table, row, isModifed);
    },
    [handleRowSelectionEvent]
  );

  const handleSortingChange: OnChangeFn<SortingState> = (sortingUpdater) => {
    const newSorting = typeof sortingUpdater === 'function' ? sortingUpdater(sorting) : sortingUpdater;
    onSortingChange?.(newSorting);
  };

  const actionsColumn: ColumnDef<TableData> = useMemo(() => {
    return {
      id: 'itemActions',
      header: 'Actions',
      cell: ({ row }): ReactElement => {
        return (
          <div className="flex flex-row items-center">
            {getItemActions?.({ id: row.id, data: row.original })}
          </div>
        );
      },
      enableSorting: false,
      enableResizing: false,
    };
  }, [getItemActions]);

  const checkboxColumn: ColumnDef<TableData> = useMemo(() => {
    return {
      id: 'checkboxRowSelect',
      size: 28,
      header: ({ table }): ReactElement => {
        return (
          <TableCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            color="hsl(var(--foreground))"
            density={density}
          />
        );
      },
      cell: ({ row, table }): ReactElement => {
        return (
          <TableCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={(e) => {
              handleCheckboxChange(e, table, row);
            }}
            color={getCheckboxColor?.(row.original)}
            density={density}
          />
        );
      },
      enableSorting: false,
      enableResizing: false,
    };
  }, [density, getCheckboxColor, handleCheckboxChange]);

  const tableColumns: Array<ColumnDef<TableData>> = useMemo(() => {
    const initTableColumns = persesColumnsToTanstackColumns(columns, defaultColumnConfig);

    if (hasItemActions) {
      initTableColumns.unshift(actionsColumn);
    }

    if (checkboxSelection) {
      initTableColumns.unshift(checkboxColumn);
    }

    return initTableColumns;
  }, [columns, defaultColumnConfig, hasItemActions, checkboxSelection, actionsColumn, checkboxColumn]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId: getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    manualPagination: !pagination,
    enableRowSelection: !!checkboxSelection,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getSubRows: getSubRows,
    getExpandedRowModel: hasSubRows ? getExpandedRowModel() : undefined,
    ...fuzzySearchOptions,
    sortDescFirst: true,
    columnResizeMode,
    onExpandedChange: setExpanded,
    state: {
      rowSelection,
      sorting,
      globalFilter: tableToolbarConfig?.isSearchEnabled ? globalFilter : undefined,
      columnVisibility,
      ...(pagination ? { pagination } : {}),
      expanded,
    },
  });

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, rowId: string) => {
      const row = table.getRow(rowId);
      const isModifiedClick = e.metaKey || e.shiftKey;
      handleRowSelectionEvent(table, row, isModifiedClick);
    },
    [handleRowSelectionEvent, table]
  );

  return (
    <VirtualizedTable
      {...otherProps}
      density={density}
      defaultColumnWidth={defaultColumnWidth}
      defaultColumnHeight={defaultColumnHeight}
      onRowClick={handleRowClick}
      rows={table.getRowModel().rows}
      columns={table.getVisibleFlatColumns()}
      columnSizing={table.getState().columnSizing}
      columnSizingInfo={table.getState().columnSizingInfo}
      headers={table.getHeaderGroups()}
      cellConfigs={cellConfigs}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      rowCount={table.getRowCount()}
      toolbarConfig={{
        isSearchEnabled: tableToolbarConfig?.isSearchEnabled,
        globalFilter,
        onGlobalFilterChange: setGlobalFilter,
        isColumnFilterEnabled: tableToolbarConfig?.isColumnFilterEnabled,
        columns: table.getAllColumns(),
        columnFilterMenuMaxHeight: tableToolbarConfig?.columnFilterMenuMaxHeight,
        isExpandAllEnabled: hasSubRows,
        isAllExpanded: table.getIsAllRowsExpanded(),
        onExpandAllChange: table.getToggleAllRowsExpandedHandler(),
      }}
    />
  );
}
