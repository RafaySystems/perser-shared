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

import { useInView } from 'react-intersection-observer';
import { DataQueriesProvider, usePlugin, useSuggestedStepMs } from '@perses-dev/plugin-system';
import React, { ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { isPanelGroupItemIdEqual, PanelGroupItemId } from '../../model'; // TODO
import { useEditMode, usePanel, usePanelActions, useViewPanelGroup } from '../../context';
import { usePanelFocusHandlers } from '../../keyboard-shortcuts';
import { Panel, PanelProps, PanelOptions } from '../Panel';
import { QueryViewerDialog } from '../QueryViewerDialog';

export interface GridItemContentProps {
  panelGroupItemId: PanelGroupItemId;
  width: number; // necessary for determining the suggested step ms
  panelOptions?: PanelOptions;
}

/**
 * Merge two refs into a single callback ref.
 */
function useMergedRef<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return useCallback(
    (value: T | null) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref && typeof ref === 'object') {
          (ref as React.MutableRefObject<T | null>).current = value;
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}

/**
 * Resolves the reference to panel content in a GridItemDefinition and renders the panel.
 */
export function GridItemContent(props: GridItemContentProps): ReactElement {
  const { panelGroupItemId, width } = props;
  const panelDefinition = usePanel(panelGroupItemId);

  const {
    spec: { queries },
  } = panelDefinition;

  const { isEditMode } = useEditMode();
  const { openEditPanel, openDeletePanelDialog, duplicatePanel, viewPanel } = usePanelActions(panelGroupItemId);
  const viewPanelGroupItemId = useViewPanelGroup();

  // Panel focus tracking for keyboard shortcuts
  const { onMouseEnter, onMouseLeave } = usePanelFocusHandlers(
    `${panelGroupItemId.panelGroupId}-${panelGroupItemId.panelGroupItemLayoutId}`
  );

  const { ref: queryRef, inView: shouldQuery } = useInView({
    threshold: 0,
    initialInView: true,
    triggerOnce: true,
  });

  const { ref: renderRef, inView: shouldRender } = useInView({
    threshold: 0.2,
    initialInView: false,
    triggerOnce: false,
  });

  const mergedRef = useMergedRef<HTMLDivElement>(renderRef, queryRef);

  const [openQueryViewer, setOpenQueryViewer] = useState(false);

  const viewQueriesHandler = useMemo(() => {
    return isEditMode || !queries?.length
      ? undefined
      : {
          onClick: (): void => {
            setOpenQueryViewer(true);
          },
        };
  }, [isEditMode, queries]);

  const readHandlers = {
    isPanelViewed: isPanelGroupItemIdEqual(viewPanelGroupItemId, panelGroupItemId),
    onViewPanelClick: function (): void {
      if (viewPanelGroupItemId === undefined) {
        viewPanel(panelGroupItemId);
      } else {
        viewPanel(undefined);
      }
    },
  };

  // Provide actions to the panel when in edit mode
  let editHandlers: PanelProps['editHandlers'] = undefined;
  if (isEditMode) {
    editHandlers = {
      onEditPanelClick: openEditPanel,
      onDuplicatePanelClick: duplicatePanel,
      onDeletePanelClick: openDeletePanelDialog,
    };
  }

  // map TimeSeriesQueryDefinition to Definition<UnknownSpec>
  const suggestedStepMs = useSuggestedStepMs(width);

  const { data: plugin } = usePlugin('Panel', panelDefinition.spec.plugin.kind);

  const queryDefinitions = queries ?? [];
  const definitions = queryDefinitions.map((query) => {
    return {
      kind: query.spec.plugin.kind,
      spec: query.spec.plugin.spec,
    };
  });

  const pluginQueryOptions =
    typeof plugin?.queryOptions === 'function'
      ? plugin?.queryOptions(panelDefinition.spec.plugin.spec)
      : plugin?.queryOptions;

  return (
    <div
      ref={mergedRef}
      tabIndex={-1}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full h-full outline-none"
    >
      <DataQueriesProvider
        definitions={definitions}
        options={{ suggestedStepMs, ...pluginQueryOptions }}
        queryOptions={{ enabled: shouldQuery }}
      >
        {shouldRender && (
          <Panel
            definition={panelDefinition}
            readHandlers={readHandlers}
            editHandlers={editHandlers}
            viewQueriesHandler={viewQueriesHandler}
            panelOptions={props.panelOptions}
            panelGroupItemId={panelGroupItemId}
          />
        )}
      </DataQueriesProvider>
      <QueryViewerDialog
        open={openQueryViewer}
        queryDefinitions={queryDefinitions}
        onClose={() => setOpenQueryViewer(false)}
      />
    </div>
  );
}
