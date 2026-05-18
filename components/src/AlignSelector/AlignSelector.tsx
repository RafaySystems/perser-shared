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
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { cn } from '../lib/utils';

export type AlignOption = 'left' | 'center' | 'right';

export interface AlignSelectorProps {
  onChange: (align: AlignOption) => void;
  value?: AlignOption;
  className?: string;
}

export function AlignSelector({ onChange, value = 'left', className }: AlignSelectorProps): ReactElement {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as AlignOption)}
      aria-label="Alignment"
      className={cn('gap-0', className)}
    >
      <ToggleGroupItem value="left" variant="outline" className="rounded-r-none border-r-0">Left</ToggleGroupItem>
      <ToggleGroupItem value="center" variant="outline" className="rounded-none border-r-0">Center</ToggleGroupItem>
      <ToggleGroupItem value="right" variant="outline" className="rounded-l-none">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}
