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

import { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { TableDensity } from './model/table-model';

interface InnerTableProps extends React.HTMLAttributes<HTMLTableElement> {
  density: TableDensity;
  width?: number | string;
}

export const InnerTable = forwardRef<HTMLTableElement, InnerTableProps>(function InnerTable(
  { density, className, width, style, ...otherProps },
  ref
) {
  return (
    <table
      {...otherProps}
      tabIndex={-1}
      ref={ref}
      className={cn('w-full bg-background [border-collapse:separate] [table-layout:fixed]', className)}
      style={{ width: width ?? '100%', ...style }}
    />
  );
});
