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

import { Popover, PopoverContent, PopoverTrigger, Spinner, cn } from '@perses-dev/components';
import { isValidElement, PropsWithChildren, ReactElement, ReactNode, useMemo, useState } from 'react';
import { InfoTooltip } from '@perses-dev/components';
import { QueryData } from '@perses-dev/plugin-system';
import {
  DatabaseZap as DatabaseSearch,
  Minimize2 as ArrowCollapseIcon,
  Maximize2 as ArrowExpandIcon,
  Pencil as PencilIcon,
  Trash2 as DeleteIcon,
  GripVertical as DragIcon,
  Copy as ContentCopyIcon,
  Menu as MenuIcon,
  AlertTriangle as AlertIcon,
  AlertCircle as AlertCircleIcon,
  Info as InformationOutlineIcon,
  Zap as LightningBoltIcon,
} from 'lucide-react';
import { Link, Notice } from '@perses-dev/spec';
import {
  ARIA_LABEL_TEXT,
  HEADER_ACTIONS_CONTAINER_NAME,
  HEADER_MEDIUM_WIDTH,
  HEADER_SMALL_WIDTH,
  TOOLTIP_TEXT,
} from '../../constants';
import { LinksDisplay } from '../LinksDisplay';
import { HeaderIconButton } from './HeaderIconButton';
import { PanelOptions } from './Panel';

const noticeTypeToIcon: Record<Notice['type'], ReactNode> = {
  error: <AlertCircleIcon color="error" />,
  warning: <AlertIcon fontSize="inherit" color="warning" />,
  info: <InformationOutlineIcon fontSize="inherit" color="info" />,
};

export interface PanelActionsProps {
  title?: string;
  description?: string;
  descriptionTooltipId: string;
  links?: Link[];
  extra?: React.ReactNode;
  editHandlers?: {
    onEditPanelClick: () => void;
    onDuplicatePanelClick: () => void;
    onDeletePanelClick: () => void;
  };
  readHandlers?: {
    isPanelViewed?: boolean;
    onViewPanelClick: () => void;
  };
  viewQueriesHandler?: {
    onClick: () => void;
  };
  queryResults: QueryData[];
  pluginActions?: ReactNode[];
  itemActions?: ReactNode[];
  areItemActionsDisabled?: boolean;
  showIcons: PanelOptions['showIcons'];
}

/** Flex container that is conditionally shown based on container query. Hidden by default. */
function ConditionalBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactElement {
  return (
    <div className={cn('hidden items-center grow justify-end', className)}>
      {children}
    </div>
  );
}

export const PanelActions: React.FC<PanelActionsProps> = ({
  editHandlers,
  readHandlers,
  viewQueriesHandler,
  extra,
  title,
  description,
  descriptionTooltipId,
  links,
  queryResults,
  pluginActions = [],
  itemActions = [],
  showIcons,
}) => {
  const descriptionAction = useMemo((): ReactNode | undefined => {
    if (description && description.trim().length > 0) {
      return (
        <InfoTooltip id={descriptionTooltipId} description={description} enterDelay={100}>
          <HeaderIconButton aria-label="panel description" size="small">
            <InformationOutlineIcon
              aria-describedby="info-tooltip"
              aria-hidden={false}
              fontSize="inherit"
              className="text-muted-foreground"
            />
          </HeaderIconButton>
        </InfoTooltip>
      );
    }
    return undefined;
  }, [descriptionTooltipId, description]);

  const linksAction = links && links.length > 0 && <LinksDisplay links={links} variant="panel" />;
  const extraActions = editHandlers === undefined && extra;

  const queryStateIndicator = useMemo((): ReactNode | undefined => {
    const hasData = queryResults.some((q) => q.data);
    const isFetching = queryResults.some((q) => q.isFetching);
    const queryErrors = queryResults.filter((q) => q.error);

    if (isFetching && hasData) {
      return <Spinner className="h-[1.125rem] w-[1.125rem]" aria-label="loading" />;
    } else if (queryErrors.length > 0) {
      const errorTexts = queryErrors
        .map((q) => q.error)
        .map((e) => e.message)
        .join('\n');

      return (
        <InfoTooltip description={errorTexts}>
          <HeaderIconButton aria-label="panel errors" size="small">
            <AlertIcon fontSize="inherit" className="text-destructive" />
          </HeaderIconButton>
        </InfoTooltip>
      );
    }
  }, [queryResults]);

  const noticesIndicator = useMemo(() => {
    const notices = queryResults.flatMap((q) => {
      return q.data?.metadata?.notices ?? [];
    });

    if (notices.length > 0) {
      const lastNotice = notices[notices.length - 1]!;

      return (
        <InfoTooltip description={lastNotice.message}>
          <HeaderIconButton aria-label="panel notices" size="small">
            {noticeTypeToIcon[lastNotice.type]}
          </HeaderIconButton>
        </InfoTooltip>
      );
    }
  }, [queryResults]);

  const readActions = useMemo((): ReactNode | undefined => {
    if (readHandlers !== undefined) {
      return (
        <InfoTooltip description={TOOLTIP_TEXT.viewPanel}>
          <HeaderIconButton
            aria-label={ARIA_LABEL_TEXT.viewPanel(title)}
            size="small"
            onClick={readHandlers.onViewPanelClick}
          >
            {readHandlers.isPanelViewed ? (
              <ArrowCollapseIcon fontSize="inherit" />
            ) : (
              <ArrowExpandIcon fontSize="inherit" />
            )}
          </HeaderIconButton>
        </InfoTooltip>
      );
    }
    return undefined;
  }, [readHandlers, title]);

  const viewQueryAction = useMemo(() => {
    if (!viewQueriesHandler?.onClick) return null;
    return (
      <InfoTooltip description={TOOLTIP_TEXT.queryView}>
        <HeaderIconButton
          aria-label={ARIA_LABEL_TEXT.openQueryView(title)}
          size="small"
          onClick={viewQueriesHandler.onClick}
        >
          <DatabaseSearch fontSize="inherit" />
        </HeaderIconButton>
      </InfoTooltip>
    );
  }, [viewQueriesHandler, title]);

  const editActions = useMemo((): ReactNode | undefined => {
    if (editHandlers !== undefined) {
      return (
        <>
          <InfoTooltip description={TOOLTIP_TEXT.editPanel}>
            <HeaderIconButton
              aria-label={ARIA_LABEL_TEXT.editPanel(title)}
              size="small"
              onClick={editHandlers.onEditPanelClick}
            >
              <PencilIcon fontSize="inherit" />
            </HeaderIconButton>
          </InfoTooltip>
          <InfoTooltip description={TOOLTIP_TEXT.duplicatePanel}>
            <HeaderIconButton
              aria-label={ARIA_LABEL_TEXT.duplicatePanel(title)}
              size="small"
              onClick={editHandlers.onDuplicatePanelClick}
            >
              <ContentCopyIcon
                fontSize="inherit"
                className="scale-[0.925]"
              />
            </HeaderIconButton>
          </InfoTooltip>
          <InfoTooltip description={TOOLTIP_TEXT.deletePanel}>
            <HeaderIconButton
              aria-label={ARIA_LABEL_TEXT.deletePanel(title)}
              size="small"
              onClick={editHandlers.onDeletePanelClick}
            >
              <DeleteIcon fontSize="inherit" />
            </HeaderIconButton>
          </InfoTooltip>
        </>
      );
    }
    return undefined;
  }, [editHandlers, title]);

  const moveAction = useMemo((): ReactNode | undefined => {
    if (editActions && !readHandlers?.isPanelViewed) {
      return (
        <div className="bg-background">
          <InfoTooltip description={TOOLTIP_TEXT.movePanel}>
            <HeaderIconButton aria-label={ARIA_LABEL_TEXT.movePanel(title)} size="small">
              <DragIcon className="drag-handle cursor-grab" fontSize="inherit" />
            </HeaderIconButton>
          </InfoTooltip>
        </div>
      );
    }
    return undefined;
  }, [editActions, readHandlers, title]);

  const divider = <div className="grow"></div>;

  // By default, the panel header shows certain icons only on hover if the panel is in non-editing, non-fullscreen mode
  const OnHover = ({ children }: PropsWithChildren): ReactNode =>
    showIcons === 'hover' ? <div style={{ display: 'var(--panel-hover, none)' }}>{children}</div> : <>{children}</>;

  return (
    <>
      {/* small panel width: move all icons except move/grab to overflow menu */}
      <ConditionalBox
        className={`[@container_${HEADER_ACTIONS_CONTAINER_NAME}_(max-width:${HEADER_SMALL_WIDTH}px)]:flex`}
      >
        {divider}
        <OnHover>
          <OverflowMenu title={title}>
            {descriptionAction} {linksAction} {queryStateIndicator} {noticesIndicator} {extraActions} {viewQueryAction}
            {readActions} {pluginActions} {itemActions}
            {editActions}
          </OverflowMenu>
          {moveAction}
        </OnHover>
      </ConditionalBox>

      {/* medium panel width: move edit icons to overflow menu */}
      <ConditionalBox
        className={`[@container_${HEADER_ACTIONS_CONTAINER_NAME}_(min-width:${HEADER_SMALL_WIDTH}px)_and_(max-width:${HEADER_MEDIUM_WIDTH}px)]:flex`}
      >
        <OnHover>
          {descriptionAction} {linksAction}
        </OnHover>
        {divider} {queryStateIndicator}
        {noticesIndicator}
        <OnHover>
          {extraActions}
          {readActions}
          <OverflowMenu title={title}>
            {editActions} {viewQueryAction} {pluginActions} {itemActions}
          </OverflowMenu>
          {moveAction}
        </OnHover>
      </ConditionalBox>

      {/* large panel width: show all icons in panel header */}
      <ConditionalBox
        className={`flex [@container_${HEADER_ACTIONS_CONTAINER_NAME}_(max-width:${HEADER_MEDIUM_WIDTH}px)]:hidden`}
      >
        <OnHover>
          {descriptionAction} {linksAction}
        </OnHover>
        {divider} {queryStateIndicator}
        {noticesIndicator}
        <OnHover>
          {extraActions}
          {viewQueryAction}
          {readActions} {editActions}
          {/* Show plugin actions inside a menu if it gets crowded */}
          {pluginActions.length <= 1 ? pluginActions : <OverflowMenu title={title}>{pluginActions}</OverflowMenu>}
          {itemActions.length <= 1 ? (
            itemActions
          ) : (
            <InfoTooltip description={`${itemActions.length} actions`}>
              <OverflowMenu icon={<LightningBoltIcon fontSize="inherit" />} direction="column" title={title}>
                {itemActions}
              </OverflowMenu>
            </InfoTooltip>
          )}
          {moveAction}
        </OnHover>
      </ConditionalBox>
    </>
  );
};

const OverflowMenu: React.FC<
  PropsWithChildren<{
    title?: string;
    icon?: ReactElement;
    direction?: 'row' | 'column';
  }>
> = ({ children, title, icon, direction = 'row' }) => {
  const [open, setOpen] = useState(false);

  // do not show overflow menu if there is no content (for example, edit actions are hidden)
  const hasContent = isValidElement(children) || (Array.isArray(children) && children.some(isValidElement));
  if (!hasContent) {
    return null;
  }

  return (
    <div className="bg-background">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <HeaderIconButton
            className="show-actions"
            aria-label={ARIA_LABEL_TEXT.showPanelActions(title)}
            size="small"
          >
            {icon ?? <MenuIcon fontSize="inherit" />}
          </HeaderIconButton>
        </PopoverTrigger>
        <PopoverContent
          className="p-1 w-auto"
          align="start"
          onClick={() => setOpen(false)}
        >
          <div
            className={cn(
              'flex items-center p-1',
              direction === 'column' ? 'flex-col' : 'flex-row'
            )}
          >
            {children}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
