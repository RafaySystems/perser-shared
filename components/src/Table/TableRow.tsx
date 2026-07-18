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

import { TableRow as MuiTableRow, alpha } from '@rafaysystems-perses/components/compat/mui';
import { forwardRef } from 'react';
import { TableDensity } from './model/table-model';

interface TableRowProps {
  density: TableDensity;
  [key: string]: any;
}

export const TableRow = forwardRef<any, TableRowProps>(function TableRow(props, ref) {
  return (
    <MuiTableRow
      {...props}
      ref={ref}
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        '&:hover': {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        },
      }}
    />
  );
});
