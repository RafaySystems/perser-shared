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

import {
  ChevronDown as ExpandedIcon,
  ChevronRight as CollapsedIcon,
  PlusSquare as AddPanelIcon,
  Pencil as PencilIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  Trash2 as DeleteIcon,
} from 'lucide-react';
import { Button, InfoTooltip } from '@perses-dev/components';
import { useReplaceVariablesInString } from '@perses-dev/plugin-system';
import { PanelGroupId } from '@perses-dev/spec';
import { ReactElement } from 'react';
import { ARIA_LABEL_TEXT, TOOLTIP_TEXT } from '../../constants';
import { usePanelGroupActions, useEditMode, useDeletePanelGroupDialog } from '../../context';

export interface GridTitleProps {
  panelGroupId: PanelGroupId;
  title: string;
  collapse?: {
    isOpen: boolean;
    onToggleOpen: () => void;
  };
}

/**
 * Renders the title for a Grid section, optionally also supporting expanding
 * and collapsing
 */
export function GridTitle(props: GridTitleProps): ReactElement {
  const { panelGroupId, title: rawTitle, collapse } = props;

  const title = useReplaceVariablesInString(rawTitle) as string;

  const { openAddPanel, openEditPanelGroup, moveUp, moveDown } = usePanelGroupActions(panelGroupId);
  const { openDeletePanelGroupDialog } = useDeletePanelGroupDialog();
  const { isEditMode } = useEditMode();

  const text = <h2 className="text-base font-semibold">{title}</h2>;

  return (
    <div
      onClick={collapse?.onToggleOpen}
      className="flex justify-start items-center cursor-auto bg-card data-[collapsible=true]:cursor-pointer"
      data-collapsible={collapse ? 'true' : undefined}
      data-testid="panel-group-header"
    >
      {collapse ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 h-auto w-auto p-1"
            aria-label={`${collapse.isOpen ? 'collapse' : 'expand'} group ${title}`}
          >
            {collapse.isOpen ? <ExpandedIcon /> : <CollapsedIcon />}
          </Button>
          {text}
          {isEditMode && (
            <div className="flex flex-row ml-auto">
              <InfoTooltip description={TOOLTIP_TEXT.addPanelToGroup}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto w-auto p-2"
                  aria-label={ARIA_LABEL_TEXT.addPanelToGroup(title)}
                  onClick={(e) => {
                    // Don't trigger expand/collapse
                    e.stopPropagation();
                    openAddPanel();
                  }}
                >
                  <AddPanelIcon />
                </Button>
              </InfoTooltip>
              <InfoTooltip description={TOOLTIP_TEXT.editGroup}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto w-auto p-2"
                  aria-label={ARIA_LABEL_TEXT.editGroup(title)}
                  onClick={(e) => {
                    // Don't trigger expand/collapse
                    e.stopPropagation();
                    openEditPanelGroup();
                  }}
                >
                  <PencilIcon />
                </Button>
              </InfoTooltip>
              <InfoTooltip description={TOOLTIP_TEXT.deleteGroup}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto w-auto p-2"
                  aria-label={ARIA_LABEL_TEXT.deleteGroup(title)}
                  onClick={(e) => {
                    // Don't trigger expand/collapse
                    e.stopPropagation();
                    openDeletePanelGroupDialog(panelGroupId);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </InfoTooltip>
              <InfoTooltip description={TOOLTIP_TEXT.moveGroupDown}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto w-auto p-2"
                  aria-label={ARIA_LABEL_TEXT.moveGroupDown(title)}
                  disabled={moveDown === undefined}
                  onClick={(e) => {
                    // Don't trigger expand/collapse
                    e.stopPropagation();
                    moveDown?.();
                  }}
                >
                  <ArrowDownIcon />
                </Button>
              </InfoTooltip>
              <InfoTooltip description={TOOLTIP_TEXT.moveGroupUp}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto w-auto p-2"
                  aria-label={ARIA_LABEL_TEXT.moveGroupUp(title)}
                  disabled={moveUp === undefined}
                  onClick={(e) => {
                    // Don't trigger expand/collapse
                    e.stopPropagation();
                    moveUp?.();
                  }}
                >
                  <ArrowUpIcon />
                </Button>
              </InfoTooltip>
            </div>
          )}
        </>
      ) : (
        // If we don't need expand/collapse, just render the title text
        text
      )}
    </div>
  );
}
