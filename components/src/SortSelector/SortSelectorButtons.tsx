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
import { SortOption } from './SortSelector';

export interface SortSelectorButtonsProps {
  value?: SortOption;
  onChange: (sort?: SortOption) => void;
  className?: string;
}

export function SortSelectorButtons({ onChange, value, className }: SortSelectorButtonsProps): ReactElement {
  return (
    <ToggleGroup
      type="single"
      value={value ?? ''}
      onValueChange={(v) => onChange((v as SortOption) || undefined)}
      aria-label="Sort"
      className={cn('gap-0', className)}
    >
      <ToggleGroupItem value="" variant="outline" className="rounded-r-none border-r-0">None</ToggleGroupItem>
      <ToggleGroupItem value="asc" variant="outline" className="rounded-none border-r-0">Asc</ToggleGroupItem>
      <ToggleGroupItem value="desc" variant="outline" className="rounded-l-none">Desc</ToggleGroupItem>
    </ToggleGroup>
  );
}
