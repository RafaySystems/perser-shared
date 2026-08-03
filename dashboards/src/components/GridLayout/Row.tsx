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

import { Collapse, useTheme } from '@rafaysystems/components/compat/mui';
import { PanelOptions } from '../Panel';
import { ReactElement, useMemo, useState } from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import { ErrorAlert, ErrorBoundary } from '@rafaysystems/components';
import { PanelGroupId } from '@rafaysystems/plugin-system';
import { GRID_LAYOUT_COLS, GRID_LAYOUT_SMALL_BREAKPOINT } from '../../constants';
import { PanelGroupDefinition, PanelGroupItemLayout } from '../../model';
import { GridContainer } from './GridContainer';
import { GridItemContent } from './GridItemContent';
import { GridTitle } from './GridTitle';

const DEFAULT_MARGIN = 10;
const ROW_HEIGHT = 30;

export interface RowProps {
  panelGroupId: PanelGroupId;
  groupDefinition: PanelGroupDefinition;
  gridColWidth: number;
  panelFullHeight?: number;
  panelOptions?: PanelOptions;
  isEditMode?: boolean;
  onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
  onWidthChange?: (
    containerWidth: number,
    margin: [number, number],
    cols: number,
    containerPadding: [number, number]
  ) => void;
  repeatVariable?: [string, string];
}

export function Row({
  panelGroupId,
  groupDefinition,
  gridColWidth,
  panelOptions,
  isEditMode = false,
  onLayoutChange,
  onWidthChange,
  repeatVariable,
}: RowProps): ReactElement {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(!groupDefinition.isCollapsed);

  // Expanded panel opens in ViewPanelDialog (~80% viewport) — keep grid layout unchanged underneath.
  const itemLayouts: PanelGroupItemLayout[] = groupDefinition.itemLayouts;

  return (
    <GridContainer>
      {groupDefinition.title && (
        <GridTitle
          panelGroupId={panelGroupId}
          title={groupDefinition.title}
          collapse={
            groupDefinition.isCollapsed === undefined
              ? undefined
              : { isOpen: isOpen, onToggleOpen: () => setIsOpen((current) => !current) }
          }
        />
      )}
      <Collapse in={isOpen} unmountOnExit appear={false} data-testid="panel-group-content">
        <ResponsiveGridLayout
          className="layout"
          breakpoints={{ [GRID_LAYOUT_SMALL_BREAKPOINT]: theme.breakpoints.values.sm, xxs: 0 }}
          cols={GRID_LAYOUT_COLS}
          rowHeight={ROW_HEIGHT}
          draggableHandle=".drag-handle"
          resizeHandles={['se']}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          margin={[DEFAULT_MARGIN, DEFAULT_MARGIN]}
          containerPadding={[0, 10]}
          layouts={{ sm: itemLayouts }}
          onLayoutChange={onLayoutChange}
          onWidthChange={onWidthChange}
        >
          {itemLayouts.map(({ i, w }) => (
            <div key={i}>
              <ErrorBoundary FallbackComponent={ErrorAlert}>
                <GridItemContent
                  panelOptions={panelOptions}
                  panelGroupItemId={{ panelGroupId, panelGroupItemLayoutId: i, repeatVariable }}
                  width={calculateGridItemWidth(w, gridColWidth)}
                />
              </ErrorBoundary>
            </div>
          ))}
        </ResponsiveGridLayout>
      </Collapse>
    </GridContainer>
  );
}

const calculateGridItemWidth = (w: number, colWidth: number): number => {
  // 0 * Infinity === NaN, which causes problems with resize contraints
  if (!Number.isFinite(w)) return w;
  return Math.round(colWidth * w + Math.max(0, w - 1) * DEFAULT_MARGIN);
};
