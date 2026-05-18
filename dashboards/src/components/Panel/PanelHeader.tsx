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

import { Tooltip, TooltipContent, TooltipTrigger, cn } from '@perses-dev/components';
import { Link } from '@perses-dev/spec';
import { ItemAction, QueryData, useAllVariableValues, useReplaceVariablesInString } from '@perses-dev/plugin-system';
import { HTMLAttributes, ReactElement, ReactNode, useRef } from 'react';
import { HEADER_ACTIONS_CONTAINER_NAME } from '../../constants';
import { PanelActions, PanelActionsProps } from './PanelActions';
import { PanelOptions } from './Panel';
import { useSelectionItemActions } from './useSelectionItemActions';

type OmittedProps = 'children' | 'action' | 'title' | 'disableTypography';

export interface PanelHeaderProps extends Omit<HTMLAttributes<HTMLElement>, OmittedProps> {
  id: string;
  title?: string;
  description?: string;
  links?: Link[];
  extra?: ReactNode;
  queryResults: QueryData[];
  viewQueriesHandler?: PanelActionsProps['viewQueriesHandler'];
  readHandlers?: PanelActionsProps['readHandlers'];
  editHandlers?: PanelActionsProps['editHandlers'];
  pluginActions?: ReactNode[];
  itemActionsListConfig?: ItemAction[];
  showIcons: PanelOptions['showIcons'];
  dimension?: { width: number };
}

export function PanelHeader({
  id,
  title: rawTitle,
  description: rawDescription,
  links,
  queryResults,
  readHandlers,
  editHandlers,
  className,
  extra,
  pluginActions,
  itemActionsListConfig,
  showIcons,
  viewQueriesHandler,
  dimension,
  ...rest
}: PanelHeaderProps): ReactElement {
  const titleElementId = `${id}-title`;
  const descriptionTooltipId = `${id}-description`;

  const title = useReplaceVariablesInString(rawTitle);
  const description = useReplaceVariablesInString(rawDescription);
  const variableState = useAllVariableValues();

  const textRef = useRef<HTMLDivElement>(null);

  const isEllipsisActive =
    textRef.current && dimension?.width ? textRef.current.scrollWidth > textRef.current.clientWidth : false;

  const { actionButtons, confirmDialog } = useSelectionItemActions({
    actions: itemActionsListConfig,
    variableState,
    disabledWithEmptySelection: true,
  });

  return (
    <>
      {title ? (
        <header
          id={id}
          aria-labelledby={titleElementId}
          aria-describedby={descriptionTooltipId}
          className={cn(
            '[container-type:inline-size]',
            `[container-name:${HEADER_ACTIONS_CONTAINER_NAME}]`,
            'p-1 border-b border-border overflow-hidden',
            className
          )}
          {...rest}
        >
          <div className="flex flex-row items-center h-[var(--panel-header-height,30px)]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  id={titleElementId}
                  ref={textRef}
                  className="text-sm font-medium leading-6 min-h-[26px] whitespace-nowrap overflow-hidden text-ellipsis"
                  title={isEllipsisActive ? title : undefined}
                >
                  {title}
                </div>
              </TooltipTrigger>
              {isEllipsisActive && <TooltipContent>{title}</TooltipContent>}
            </Tooltip>
            <PanelActions
              title={title}
              description={description}
              descriptionTooltipId={descriptionTooltipId}
              links={links}
              readHandlers={readHandlers}
              editHandlers={editHandlers}
              viewQueriesHandler={viewQueriesHandler}
              extra={extra}
              queryResults={queryResults}
              pluginActions={pluginActions}
              itemActions={actionButtons}
              showIcons={showIcons}
            />
          </div>
        </header>
      ) : (
        <header
          id={id}
          aria-describedby={descriptionTooltipId}
          className={cn(
            'absolute right-0 top-0 z-[5]',
            '[container-type:inline-size]',
            `[container-name:${HEADER_ACTIONS_CONTAINER_NAME}]`,
            className
          )}
          {...rest}
        >
          <PanelActions
            title={title}
            description={description}
            descriptionTooltipId={descriptionTooltipId}
            links={links}
            readHandlers={readHandlers}
            editHandlers={editHandlers}
            viewQueriesHandler={viewQueriesHandler}
            extra={extra}
            queryResults={queryResults}
            pluginActions={pluginActions}
            itemActions={actionButtons}
            showIcons={showIcons}
          />
        </header>
      )}
      {confirmDialog}
    </>
  );
}
