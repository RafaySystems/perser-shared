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

import { Column } from '@tanstack/react-table';
import { ReactElement, useCallback, useState } from 'react';
import { Search, X, Columns3, ChevronsUpDown, ChevronsDownUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../lib/utils';

export interface TableToolbarProps<TableData> {
  isSearchEnabled?: boolean;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  isColumnFilterEnabled?: boolean;
  columns: Array<Column<TableData>>;
  width: number | string;
  columnFilterMenuMaxHeight?: number | string;
  isExpandAllEnabled?: boolean;
  isAllExpanded?: boolean;
  onExpandAllChange?: (event: unknown) => void;
}

export function TableToolbar<TableData>({
  isSearchEnabled,
  globalFilter,
  onGlobalFilterChange,
  isColumnFilterEnabled,
  columns,
  width,
  columnFilterMenuMaxHeight = 400,
  isExpandAllEnabled,
  isAllExpanded,
  onExpandAllChange,
}: TableToolbarProps<TableData>): ReactElement | null {
  const [searchResetKey, setSearchResetKey] = useState(0);

  const handleSearchClear = useCallback(() => {
    onGlobalFilterChange('');
    setSearchResetKey((prev) => prev + 1);
  }, [onGlobalFilterChange]);

  if (!isSearchEnabled && !isColumnFilterEnabled && !isExpandAllEnabled) {
    return null;
  }

  return (
    <div
      className="flex flex-row gap-2 items-center justify-end bg-background p-2"
      style={{ width }}
    >
      {isSearchEnabled && (
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            key={searchResetKey}
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            aria-label="search table"
            className="pl-8 h-8 text-sm"
          />
          {globalFilter !== '' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchClear}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      {isExpandAllEnabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onExpandAllChange as React.MouseEventHandler}
              aria-label={isAllExpanded ? 'collapse all rows' : 'expand all rows'}
              className="text-info h-8 w-8"
            >
              {isAllExpanded ? (
                <ChevronsDownUp className="h-4 w-4" />
              ) : (
                <ChevronsUpDown className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isAllExpanded ? 'Collapse all' : 'Expand all'}</TooltipContent>
        </Tooltip>
      )}

      {isColumnFilterEnabled && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-haspopup="listbox"
              className="text-info h-8 w-8"
              aria-label="Toggle column visibility"
            >
              <Columns3 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn('min-w-[160px]')}
            style={{ maxHeight: columnFilterMenuMaxHeight, overflowY: 'auto' }}
          >
            {columns.map((column) => {
              const header = column.columnDef.header;
              const label = typeof header === 'string' ? header : column.id;
              return (
                <DropdownMenuItem
                  key={column.id}
                  disabled={!column.getCanHide()}
                  onClick={column.getCanHide() ? column.getToggleVisibilityHandler() : undefined}
                  className="flex items-center gap-2 text-sm py-1.5 cursor-pointer"
                >
                  <Checkbox
                    checked={column.getIsVisible()}
                    disabled={!column.getCanHide()}
                    className="h-4 w-4 p-0"
                    aria-label={`Toggle ${label} column`}
                    onCheckedChange={column.getCanHide() ? column.getToggleVisibilityHandler() : undefined}
                  />
                  <span>{label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
