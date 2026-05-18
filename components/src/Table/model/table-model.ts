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

import { Link } from '@perses-dev/spec';
import {
  AccessorKeyColumnDef,
  CellContext,
  ColumnDef,
  CoreOptions,
  FilterFn,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { CSSProperties, ReactNode } from 'react';
import { rankings } from '@tanstack/match-sorter-utils';
import { PaletteMode } from '../../theme/theme';

export const DEFAULT_COLUMN_WIDTH = 150;
export const DEFAULT_COLUMN_MIN_WIDTH = 60;
export const DEFAULT_COLUMN_MAX_WIDTH = 1000;
export const DEFAULT_COLUMN_HEIGHT = 40;

export type TableDensity = 'compact' | 'standard' | 'comfortable';
export type SortDirection = 'asc' | 'desc' | undefined;

export type TableRowEventOpts = {
  /**
   * Unique identifier for the row.
   */
  id: string;

  /**
   * Index of the row in the original data.
   */
  index: number;
};

export interface TableProps<TableData> {
  /**
   * Height of the table.
   */
  height: number;

  /**
   * Width of the table.
   */
  width: number | string;

  /**
   * Array of data to render in the table. Each entry in the array will be
   * rendered as a row in the table.
   */
  data: TableData[];

  /**
   * Array of column configuration for the table. Each entry in the array will
   * be rendered as a column header and impact the rendering of cells within
   * table rows.
   */
  columns: Array<TableColumnConfig<TableData>>;

  /**
   * Custom render cell configurations. Each entry of the object should be an
   * id for cell `${rowIndex}_${columnIndex}`, can apply custom text, text color
   * and background color.
   */
  cellConfigs?: TableCellConfigs;

  /**
   * The density of the table layout. This impacts the size and space taken up
   * by content in the table (e.g. font size, padding).
   */
  density?: TableDensity;

  /**
   *  When using "auto", the table will try to automatically adjust the width of columns to fit without overflowing.
   *  If there is not enough width for each column, the display can unreadable.
   */
  defaultColumnWidth?: 'auto' | number;

  /**
   *  When using "auto", the table will calculate the cell height based on the line height of the theme and the density setting of the table.
   */
  defaultColumnHeight?: 'auto' | number;

  /**
   * When `true`, the first column of the table will include checkboxes.
   */
  checkboxSelection?: boolean;

  /**
   * Determines the behavior of row selection.
   *
   * - `standard`: clicking a checkbox will toggle that rows's selected/unselected
   *    state and will not impact other rows.
   * - `legend`: clicking a checkbox will "focus" that row by selecting it and
   *    unselecting other rows. Clicking a checkbox with a modifier key pressed,
   *    will change this behavior to behave like `standard`.
   *
   * @default 'standard'
   */
  rowSelectionVariant?: 'standard' | 'legend';

  /**
   * State of selected rows in the table when `checkboxSelection` is enabled.
   *
   * Selected row state is a controlled value that should be managed using a
   * combination of this prop and `onRowSelectionChange`.
   */
  rowSelection?: RowSelectionState;

  /**
   * Callback fired when the mouse is moved over a table row.
   */
  onRowMouseOver?: (e: React.MouseEvent, opts: TableRowEventOpts) => void;

  /**
   * Callback fired when the mouse is moved out of a table row.
   */
  onRowMouseOut?: (e: React.MouseEvent, opts: TableRowEventOpts) => void;

  /**
   * State of the column sorting in the table.
   *
   * The column sorting is a controlled value that should be managed using a
   * combination fo this prop and `onSortingChange`.
   */
  sorting?: SortingState;

  /**
   * Callback fired when the selected rows in the table changes.
   */
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;

  /**
   * Callback fired when the table sorting changes.
   */
  onSortingChange?: (sorting: SortingState) => void;

  /**
   * State of the pagination in the table.
   * Default: undefined, i.e. pagination is disabled.
   */
  pagination?: PaginationState;

  /**
   * Callback fired when the table pagination changes.
   */
  onPaginationChange?: (pagination: PaginationState) => void;

  /**
   * Function used to determine the unique identifier used for each row. This
   * value is used to key `rowSelection`. If this value is not set, the index
   * is used as the unique identifier.
   */
  getRowId?: CoreOptions<TableData>['getRowId'];

  /**
   * Function used to determine the color of the checkbox when `checkboxSelection`
   * is enabled. If not set, a default color is used.
   */
  getCheckboxColor?: (rowData: TableData) => string;

  /**
   * Item actions to render for each row.
   */
  getItemActions?: ({ id, data }: { id: string; data: unknown }) => ReactNode[];

  /**
   * Item actions should be created
   */
  hasItemActions?: boolean;

  /**
   * Returns the sub rows for a given row, or `undefined` if there are none.
   */
  getSubRows?: (originalRow: TableData, index: number) => undefined | TableData[];

  /**
   * List of column ids that should be hidden when the table is initially rendered.
   */
  hiddenColumns?: string[];

  /**
   * Configuration for the table toolbar at the top of table, which includes the search input and column filter button.
   * If not provided, the toolbar will not be rendered.
   */
  tableToolbarConfig?: TableToolbarConfig;

  /**
   * Determines when column resizing updates the column width.
   * When set to `onChange`, the column width will update as the user drags the resize handle.
   * When set to `onEnd`, the column width will only update when the user releases the resize handle.
   * @default 'onChange'
   */
  columnResizeMode?: 'onChange' | 'onEnd';

  /**
   * Default configuration applied to all columns in the table. Individual
   * column configurations can override these values. Useful for setting
   * consistent constraints (e.g. min/max width) or enabling resizing across
   * all columns without repeating the configuration per column.
   */
  defaultColumnConfig?: DefaultColumnConfig;
}

export interface DefaultColumnConfig {
  /**
   * Minimum width of a column in pixels.
   * @default 60
   */
  minWidth?: number;

  /**
   * Maximum width of a column in pixels.
   * @default 1000
   */
  maxWidth?: number;

  /**
   * When `true`, columns will be resizable by dragging the column header border.
   * @default false
   */
  enableResizing?: boolean;
}

export type FuzzyMatchThreshold = keyof typeof rankings;

export type TableToolbarConfig = {
  /**
   * When `true`, a search bar will be rendered above the table that allows
   * the user to filter rows using a fuzzy global filter.
   */
  isSearchEnabled?: boolean;

  /**
   * When `isSearchEnabled` is `true`, this determines how fuzzy the matching should be when filtering results.
   * @default 'CONTAINS'
   */
  fuzzyMatchThreshold?: FuzzyMatchThreshold;

  /**
   * When `true`, a "Columns" button will be rendered above the table that
   * opens a dropdown allowing the user to toggle column visibility.
   */
  isColumnFilterEnabled?: boolean;

  /**
   * Max height for the column filter menu.
   */
  columnFilterMenuMaxHeight?: number | string;
};

function calculateTableCellHeight(lineHeight: CSSProperties['lineHeight'], paddingY: string): number {
  const lineHeightNum = typeof lineHeight === 'string' ? parseInt(lineHeight, 10) : (lineHeight ?? 0);
  const verticalPaddingNum = typeof paddingY === 'string' ? parseInt(paddingY, 10) : paddingY;
  return lineHeightNum + verticalPaddingNum * 2;
}

type TableCellLayout = NonNullable<Pick<React.CSSProperties, 'padding' | 'fontSize' | 'lineHeight'>> & {
  height: number;
};

type GetTableCellLayoutOpts = {
  isHeader?: boolean;
  isLastColumn?: boolean;
  isFirstColumn?: boolean;
  defaultColumnHeight?: 'auto' | number;
};

/**
 * Minimal theme-like object used for layout calculations without MUI dependency.
 */
type LayoutTheme = {
  spacing: (n: number) => string;
  typography: {
    body1: { lineHeight: string; fontSize: string };
    body2: { lineHeight: string; fontSize: string };
  };
};

/**
 * Returns the properties to lay out the content of table cells based on the
 * density. Accepts a theme-like object for spacing/typography.
 */
export function getTableCellLayout(
  theme: LayoutTheme,
  density: TableDensity,
  { isHeader, isLastColumn, isFirstColumn, defaultColumnHeight }: GetTableCellLayoutOpts = {}
): TableCellLayout {
  // Density Standard
  let paddingY = theme.spacing(1);
  let basePaddingX = theme.spacing(1.25);
  let edgePaddingX = theme.spacing(2);
  let paddingLeft = isFirstColumn ? edgePaddingX : basePaddingX;
  let paddingRight = isLastColumn ? edgePaddingX : basePaddingX;
  let lineHeight = theme.typography.body1.lineHeight;
  let fontSize = theme.typography.body1.fontSize;

  if (density === 'compact') {
    paddingY = theme.spacing(0.5);
    basePaddingX = theme.spacing(0.5);
    edgePaddingX = theme.spacing(1);
    paddingLeft = isFirstColumn ? edgePaddingX : basePaddingX;
    paddingRight = isLastColumn ? edgePaddingX : basePaddingX;
    lineHeight = theme.typography.body2.lineHeight;
    fontSize = theme.typography.body2.fontSize;
  }

  if (density === 'comfortable') {
    paddingY = theme.spacing(2);
    basePaddingX = theme.spacing(1.5);
    edgePaddingX = theme.spacing(2);
    paddingLeft = isFirstColumn ? edgePaddingX : basePaddingX;
    paddingRight = isLastColumn ? edgePaddingX : basePaddingX;
    lineHeight = theme.typography.body1.lineHeight;
    fontSize = theme.typography.body1.fontSize;
  }

  const height =
    isHeader || !defaultColumnHeight || defaultColumnHeight === 'auto'
      ? calculateTableCellHeight(lineHeight, paddingY)
      : defaultColumnHeight;

  return {
    padding: `${paddingY} ${paddingRight} ${paddingY} ${paddingLeft}`,
    height: height,
    fontSize: fontSize,
    lineHeight: lineHeight,
  };
}

export type TableCellAlignment = 'left' | 'right' | 'center';

export interface TableCellConfigs {
  [id: string]: TableCellConfig;
}

export interface TableCellConfig {
  text?: string;
  textColor?: string;
  backgroundColor?: string;
}

// Overrides of meta value, so it can have a meaningful type in our code instead
// of `any`.
declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: TableColumnConfig<TData>['align'];
    headerDescription?: TableColumnConfig<TData>['headerDescription'];
    cellDescription?: TableColumnConfig<TData>['cellDescription'];
    dataLink?: TableColumnConfig<TData>['dataLink'];
  }
}

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns. Allows us to use "fuzzy" as a value for `globalFilterFn` in our table options.
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

// Column link settings
export type DataLink = Omit<Link, 'name'>;

// Only exposing a very simplified version of the very extensive column definitions
// possible with tanstack table to make it easier for us to control rendering
// and functionality.
export interface TableColumnConfig<TableData>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Pick<AccessorKeyColumnDef<TableData, any>, 'accessorKey' | 'cell' | 'sortingFn' | 'id' | 'enableResizing'> {
  /**
   * Text to display in the header for the column.
   */
  header: string;

  /**
   * Alignment of the content in the cell.
   */
  align?: TableCellAlignment;

  /**
   * Text to display when hovering over a cell.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellDescription?: ((props: CellContext<TableData, any>) => string) | boolean | undefined;

  /**
   * When `true`, the column will be sortable.
   * @default false
   */
  enableSorting?: boolean;

  /**
   * Text to display when hovering over the header text.
   */
  headerDescription?: string;

  /**
   * Width of the column when rendered in a table.
   * @default 'auto'
   */
  width?: number | 'auto';

  /**
   * Dynamic link setting.
   */
  dataLink?: DataLink;
}

/**
 * Takes in a perses table column and transforms it into a tanstack column.
 */
export function persesColumnsToTanstackColumns<TableData>(
  columns: Array<TableColumnConfig<TableData>>,
  defaultColumnConfig?: DefaultColumnConfig
): Array<ColumnDef<TableData>> {
  return columns.map(
    ({ width, align, headerDescription, cellDescription, enableSorting, dataLink, enableResizing, ...otherProps }) => {
      const isResizingEnabled = enableResizing ?? defaultColumnConfig?.enableResizing ?? false;
      const sizeProps =
        width === 'auto' || width === undefined
          ? getDefaultSizeProps(isResizingEnabled, defaultColumnConfig?.minWidth, defaultColumnConfig?.maxWidth)
          : getUserProvidedSizeProps(
              isResizingEnabled,
              width,
              defaultColumnConfig?.minWidth,
              defaultColumnConfig?.maxWidth
            );

      return {
        ...otherProps,
        ...sizeProps,
        enableSorting: !!enableSorting,
        enableResizing: isResizingEnabled,
        meta: {
          align,
          headerDescription,
          cellDescription,
          dataLink,
        },
      };
    }
  );
}

function getUserProvidedSizeProps<TableData>(
  isResizingEnabled: boolean,
  width: number,
  minWidth?: number,
  maxWidth?: number
): Pick<ColumnDef<TableData>, 'size' | 'minSize' | 'maxSize'> {
  return isResizingEnabled
    ? {
        size: width,
        minSize: minWidth ?? DEFAULT_COLUMN_MIN_WIDTH,
        maxSize: maxWidth ?? DEFAULT_COLUMN_MAX_WIDTH,
      }
    : {
        size: width,
      };
}

function getDefaultSizeProps<TableData>(
  isResizingEnabled: boolean,
  minWidth?: number,
  maxWidth?: number
): Pick<ColumnDef<TableData>, 'size' | 'minSize' | 'maxSize'> {
  return isResizingEnabled
    ? {
        size: DEFAULT_COLUMN_WIDTH,
        minSize: minWidth ?? DEFAULT_COLUMN_MIN_WIDTH,
        maxSize: maxWidth ?? DEFAULT_COLUMN_MAX_WIDTH,
      }
    : {
        size: 0,
        minSize: 0,
        maxSize: 0,
      };
}

// Re-export PaletteMode for consumers that previously imported Theme from this module
export type { PaletteMode };
