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
import { ListLegendItem, ListLegendItemProps } from './ListLegendItem';
import { LegendItem, SelectedLegendItemState, isLegendItemVisuallySelected } from './legend-model';

export interface CompactLegendProps {
  height: number;
  items: LegendItem[];
  selectedItems: SelectedLegendItemState;
  onLegendItemClick: ListLegendItemProps['onClick'];
  onItemMouseOver: ListLegendItemProps['onMouseOver'];
  onItemMouseOut: ListLegendItemProps['onMouseOut'];
}

/**
 * CompactLegend is default and used when legend items need to show side by side
 * which corresponds to when legend.position is `bottom` with a relatively small
 * number of items. The `ListLegend` is used for cases with large numbers of items
 * because it is virtualized.
 */
export function CompactLegend({
  height,
  items,
  selectedItems,
  onLegendItemClick,
  onItemMouseOver,
  onItemMouseOut,
}: CompactLegendProps): ReactElement {
  return (
    <ul className="w-full overflow-y-scroll m-0 pr-1 pl-0" style={{ height }}>
      {items.map((item, index) => (
        <ListLegendItem
          key={item.id}
          item={item}
          index={index}
          isVisuallySelected={isLegendItemVisuallySelected(item, selectedItems)}
          onMouseOver={onItemMouseOver}
          onMouseOut={onItemMouseOut}
          onClick={onLegendItemClick}
          className="w-auto float-left pr-6"
        />
      ))}
    </ul>
  );
}
