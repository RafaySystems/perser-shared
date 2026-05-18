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

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  density: TableDensity;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { density, className, ...props },
  ref
) {
  return (
    <tr
      {...props}
      ref={ref}
      className={cn('bg-background hover:bg-primary/10 transition-colors', className)}
    />
  );
});
