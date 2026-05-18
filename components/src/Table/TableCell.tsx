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

import { ReactElement, useEffect, useMemo, useRef } from 'react';
import { cn } from '../lib/utils';
import { hasDataFieldPatterns, replaceDataFields } from '../utils/data-field-interpolation';
import { DataLink, TableCellAlignment, TableDensity, getTableCellLayout } from './model/table-model';

// Minimal theme-like object for getTableCellLayout spacing/typography
const MOCK_THEME = {
  spacing: (n: number): string => `${n * 8}px`,
  typography: {
    body1: { lineHeight: '24px', fontSize: '0.875rem' },
    body2: { lineHeight: '20px', fontSize: '0.75rem' },
  },
};

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  density: TableDensity;
  defaultColumnHeight?: 'auto' | number;
  isLastColumn: boolean;
  isFirstColumn: boolean;
  align?: TableCellAlignment;
  description?: string;
  focusState?: 'trigger-focus' | 'focus-next' | 'none';
  onFocusTrigger?: (e: React.MouseEvent<HTMLTableCellElement> | React.KeyboardEvent<HTMLTableCellElement>) => void;
  color?: string;
  backgroundColor?: string;
  dataLink?: DataLink;
  adjacentCellsValuesMap?: Record<string, string>;
  /** variant="head" marks this cell as a header cell */
  variant?: 'head' | 'body' | 'footer';
}

export function TableCell({
  children,
  density,
  variant,
  width,
  defaultColumnHeight,
  focusState = 'none',
  onFocusTrigger,
  isFirstColumn,
  isLastColumn,
  description,
  align,
  color,
  backgroundColor,
  dataLink,
  adjacentCellsValuesMap,
  className,
  style,
  ...otherProps
}: TableCellProps): ReactElement {
  const elRef = useRef<HTMLTableCellElement>(null);

  const isHeader = variant === 'head';

  useEffect(() => {
    if (focusState === 'trigger-focus' && elRef.current) {
      elRef.current.focus();
    }
  }, [focusState]);

  const handleFocus: React.FocusEventHandler<HTMLTableCellElement> = (e) => {
    const nestedFocusTarget = e.currentTarget?.querySelector<HTMLElement>(
      'a[href], button, input, textarea, select, details,[role="button"]'
    );
    if (nestedFocusTarget) {
      nestedFocusTarget.focus();
    }
  };

  const handleInteractionFocusTrigger: TableCellProps['onFocusTrigger'] = (e) => {
    onFocusTrigger?.(e);
  };

  const modifiedDataLink = useMemo((): DataLink | undefined => {
    if (!dataLink) return undefined;
    if (adjacentCellsValuesMap && hasDataFieldPatterns(dataLink.url)) {
      const { text } = replaceDataFields(dataLink.url, adjacentCellsValuesMap, { urlEncode: true });
      return { ...dataLink, url: text };
    }
    return dataLink;
  }, [dataLink, adjacentCellsValuesMap]);

  const cellLayout = getTableCellLayout(MOCK_THEME, density, {
    isHeader,
    isLastColumn,
    isFirstColumn,
    defaultColumnHeight,
  });

  const Tag = isHeader ? 'th' : 'td';

  return (
    <Tag
      {...(otherProps as React.HTMLAttributes<HTMLTableCellElement>)}
      tabIndex={focusState !== 'none' ? 0 : -1}
      onFocus={handleFocus}
      onClick={handleInteractionFocusTrigger as React.MouseEventHandler<HTMLTableCellElement>}
      onKeyUp={handleInteractionFocusTrigger as React.KeyboardEventHandler<HTMLTableCellElement>}
      ref={elRef}
      className={cn(
        'relative p-0 bg-inherit',
        isHeader && 'bg-background border-b border-border/50',
        !isHeader && 'border-b border-border/25',
        'focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-[-1px] focus-visible:rounded-none',
        '[&:hover_#original-cell]:absolute [&:hover_#original-cell]:top-0 [&:hover_#original-cell]:left-0 [&:hover_#original-cell]:z-10 [&:hover_#original-cell]:w-fit [&:hover_#original-cell]:min-w-full [&:hover_#original-cell]:whitespace-nowrap [&:hover_#original-cell]:overflow-visible [&:hover_#original-cell]:outline [&:hover_#original-cell]:outline-1 [&:hover_#original-cell]:outline-info [&:hover_#original-cell]:outline-offset-[-1px]',
        className
      )}
      style={{ width, ...style }}
    >
      <div
        id="original-cell"
        className={cn('relative overflow-hidden whitespace-nowrap text-ellipsis')}
        style={{
          padding: cellLayout.padding,
          height: cellLayout.height,
          fontSize: cellLayout.fontSize as string,
          lineHeight: cellLayout.lineHeight as string,
          backgroundColor: backgroundColor ?? 'inherit',
          color: color ?? 'inherit',
          flexDirection: 'inherit',
          textAlign: align,
        }}
        title={description}
        aria-label={description}
      >
        {modifiedDataLink ? (
          <a
            href={modifiedDataLink.url}
            target={modifiedDataLink.targetBlank ? '_blank' : '_self'}
            rel={modifiedDataLink.targetBlank ? 'noopener noreferrer' : undefined}
            className="underline text-primary"
          >
            {children}
          </a>
        ) : (
          children
        )}
      </div>
    </Tag>
  );
}
