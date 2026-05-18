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
import { Checkbox } from '../ui/checkbox';
import { cn } from '../lib/utils';
import { TableDensity } from './model/table-model';

export interface TableCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color?: string;
  density: TableDensity;
}

export function TableCheckbox({ color, density, checked, indeterminate, onChange }: TableCheckboxProps): ReactElement {
  const isCompact = density === 'compact';

  return (
    <Checkbox
      checked={checked}
      // shadcn Checkbox doesn't natively support indeterminate; wire via data-attr
      data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
      onCheckedChange={(checkedState) => {
        if (onChange) {
          const syntheticEvent = {
            target: { checked: checkedState === true },
            nativeEvent: {},
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }}
      tabIndex={-1}
      className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        isCompact ? 'h-4 w-4' : 'h-[18px] w-[18px]',
        isCompact ? 'p-[1px]' : 'p-0.5'
      )}
      style={color ? { color, borderColor: color } : undefined}
      aria-label="Select row"
    />
  );
}
