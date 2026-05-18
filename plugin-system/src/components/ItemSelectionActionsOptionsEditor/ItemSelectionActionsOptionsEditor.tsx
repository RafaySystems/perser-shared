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
  Button,
  Dialog,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  RadioGroup,
  RadioGroupItem,
  TextField,
} from '@perses-dev/components';
import {
  DragAndDropElement,
  DragButton,
  handleMoveDown,
  handleMoveUp,
  InfoTooltip,
  JSONEditor,
  OptionsEditorControl,
  OptionsEditorGroup,
  useDragAndDropMonitor,
} from '@perses-dev/components';
import {
  AlertTriangle as AlertIcon,
  Check as CheckIcon,
  ChevronDown,
  ChevronRight,
  X as CloseIcon,
  Settings as SettingsIcon,
  Trash2 as DeleteIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Link as LinkIcon,
  ScanSearch as MagnifyScan,
  Pause as PauseIcon,
  Play as PlayIcon,
  Plus as PlusIcon,
  RefreshCw as RefreshIcon,
  Bot as RobotOutline,
  Send as SendIcon,
  Square as StopIcon,
  RefreshCcw as SyncIcon,
  Upload as UploadIcon,
} from 'lucide-react';
import { ReactElement, useCallback, useMemo, useState } from 'react';

export type ActionIcon =
  | 'play'
  | 'pause'
  | 'stop'
  | 'delete'
  | 'refresh'
  | 'send'
  | 'download'
  | 'upload'
  | 'check'
  | 'close'
  | 'alert'
  | 'info'
  | 'settings'
  | 'link'
  | 'sync'
  | 'troubleshoot'
  | 'ask-ai';

export interface BaseAction {
  type: 'event' | 'webhook';
  name: string;
  confirmMessage?: string;
  icon?: ActionIcon;
  enabled?: boolean;
  batchMode: BatchMode;
  bodyTemplate?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type BatchMode = 'batch' | 'individual';

export type ContentType = 'none' | 'json' | 'text';

export interface WebhookAction extends BaseAction {
  type: 'webhook';
  url: string;
  method: HttpMethod;
  contentType: ContentType;
  headers?: Record<string, string>;
}

export interface EventAction extends BaseAction {
  type: 'event';
  eventName: string;
}

export type ItemAction = EventAction | WebhookAction;

export interface ActionOptions {
  enabled?: boolean;
  actionsList?: ItemAction[];
  displayInHeader?: boolean;
  displayWithItem?: boolean;
}

export interface SelectionOptions {
  enabled?: boolean;
}

export interface ItemSelectionActionsEditorProps {
  actionOptions?: ActionOptions;
  selectionOptions?: SelectionOptions;
  onChangeActions: (actions?: ActionOptions) => void;
  onChangeSelection: (selection?: SelectionOptions) => void;
}

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const BATCH_MODES: Array<{ value: BatchMode; label: string }> = [
  { value: 'individual', label: 'Individual (one request per selection)' },
  { value: 'batch', label: 'Batch (single request with all selections)' },
];
const CONTENT_TYPES: Array<{ value: ContentType; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'json', label: 'JSON' },
  { value: 'text', label: 'Text' },
];
const BODY_METHODS: HttpMethod[] = ['POST', 'PUT', 'PATCH'];
const BODY_CLEAR_CONFIRM_MESSAGE = 'Changing this option will remove the current body template. Continue?';

/** Available action icons with their display components */
export const ACTION_ICONS: Array<{ value: ActionIcon; label: string; icon: ReactElement }> = [
  { value: 'play', label: 'Play', icon: <PlayIcon fontSize="inherit" /> },
  { value: 'pause', label: 'Pause', icon: <PauseIcon fontSize="inherit" /> },
  { value: 'stop', label: 'Stop', icon: <StopIcon fontSize="inherit" /> },
  { value: 'delete', label: 'Delete', icon: <DeleteIcon fontSize="inherit" /> },
  { value: 'refresh', label: 'Refresh', icon: <RefreshIcon fontSize="inherit" /> },
  { value: 'send', label: 'Send', icon: <SendIcon fontSize="inherit" /> },
  { value: 'download', label: 'Download', icon: <DownloadIcon fontSize="inherit" /> },
  { value: 'upload', label: 'Upload', icon: <UploadIcon fontSize="inherit" /> },
  { value: 'check', label: 'Check', icon: <CheckIcon fontSize="inherit" /> },
  { value: 'close', label: 'Close', icon: <CloseIcon fontSize="inherit" /> },
  { value: 'alert', label: 'Alert', icon: <AlertIcon fontSize="inherit" /> },
  { value: 'info', label: 'Info', icon: <InfoIcon fontSize="inherit" /> },
  { value: 'settings', label: 'Settings', icon: <SettingsIcon fontSize="inherit" /> },
  { value: 'link', label: 'Link', icon: <LinkIcon fontSize="inherit" /> },
  { value: 'sync', label: 'Sync', icon: <SyncIcon fontSize="inherit" /> },
  { value: 'troubleshoot', label: 'Troubleshoot', icon: <MagnifyScan fontSize="inherit" /> },
  { value: 'ask-ai', label: 'Ask AI', icon: <RobotOutline fontSize="inherit" /> },
];

const URL_HELPER_TEXT = 'Supports interpolation: ${__data.fields["fieldName"]}, ${__data.index}, ${__data.count}';

function createDefaultEventAction(): EventAction {
  return {
    type: 'event',
    name: 'New Event Action',
    eventName: 'selection-action',
    batchMode: 'individual',
    enabled: true,
  };
}

function createDefaultWebhookAction(): WebhookAction {
  return {
    type: 'webhook',
    name: 'New Webhook Action',
    url: '',
    method: 'POST',
    contentType: 'none',
    batchMode: 'individual',
    enabled: true,
  };
}

interface ItemActionEditorProps {
  action: ItemAction;
  index: number;
  onChange: (index: number, action: ItemAction) => void;
  onRemove: (index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

interface InterpolationHelperProps {
  batchMode: BatchMode;
}

function InterpolationHelper({ batchMode }: InterpolationHelperProps): ReactElement {
  let content: ReactElement = (
    <div>
      Individual mode patterns: <code>{'${__data.fields["field"]}'}</code>, <code>{'${__data.index}'}</code>,{' '}
      <code>{'${__data.count}'}</code>
    </div>
  );

  if (batchMode === 'batch') {
    content = (
      <div>
        Batch mode patterns: <code>{'${__data}'}</code>, <code>{"${__data[0].fields['field']}"}</code>,{' '}
        <code>{"${__data.fields['field']:csv}"}</code>, <code>{'${__data.count}'}</code>
      </div>
    );
  }

  return (
    <p className="text-xs text-muted-foreground mb-1 block">
      {content}
    </p>
  );
}

function EventActionEditor({
  action,
  index,
  onChange,
  onRemove,
  onMoveDown,
  onMoveUp,
}: ItemActionEditorProps): ReactElement {
  const eventAction = action as EventAction;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const hasBodyTemplate = (eventAction.bodyTemplate ?? '').trim().length > 0;

  const handleIncludesTemplateChange = useCallback(
    (value: string) => {
      const nextContentType = value as 'custom' | 'none';
      const bodyTemplate = nextContentType === 'custom' ? JSON.stringify({}) : undefined;
      onChange(index, { ...eventAction, bodyTemplate: bodyTemplate });
    },
    [index, onChange, eventAction]
  );

  const handleBodyTemplateChange = useCallback(
    (template: string) => {
      onChange(index, { ...eventAction, bodyTemplate: template || undefined });
    },
    [index, onChange, eventAction]
  );

  const jsonDataTemplate = useMemo(() => {
    if (eventAction.bodyTemplate) {
      try {
        return JSON.parse(eventAction.bodyTemplate);
      } catch {
        return {};
      }
    }
  }, [eventAction.bodyTemplate]);

  return (
    <DragAndDropElement data={eventAction as unknown as Record<string, unknown>}>
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            data-testid={`event-action-toggle#${eventAction.name}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <span className="text-xs uppercase tracking-wide font-medium self-center">
            EVENT ACTION:{' '}
            {eventAction.name ? (
              <span>
                <strong>{eventAction.name}</strong>
              </span>
            ) : (
              <strong>{eventAction.name}</strong>
            )}
          </span>
        </div>

        <div className="flex flex-row gap-1">
          <InfoTooltip description="Remove action settings" placement="top">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto"
              onClick={() => onRemove(index)}
              key="delete-action-button"
            >
              <DeleteIcon className="h-4 w-4" />
            </Button>
          </InfoTooltip>
          <InfoTooltip description="Reorder action settings" placement="top">
            <DragButton
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              menuSx={{
                '.MuiPaper-root': { backgroundColor: (theme: { palette: { background: { lighter: string } } }) => theme.palette.background.lighter },
              }}
              key="reorder-action-button"
            />
          </InfoTooltip>
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col gap-4">
          <OptionsEditorControl
            label="Enabled"
            control={
              <Switch
                checked={eventAction?.enabled ?? false}
                onCheckedChange={(checked) => onChange(index, { ...eventAction, enabled: checked })}
              />
            }
          />

          <div className="flex flex-row gap-4">
            <TextField
              label="Action Name"
              value={eventAction.name}
              onChange={(val) => onChange(index, { ...eventAction, name: val })}
              className="flex-1"
            />

            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <Label>Icon</Label>
              <Select
                value={eventAction.icon || ''}
                onValueChange={(val) => onChange(index, { ...eventAction, icon: (val as ActionIcon) || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <em>None</em>
                  </SelectItem>
                  {ACTION_ICONS.map((iconOption) => (
                    <SelectItem key={iconOption.value} value={iconOption.value}>
                      <div className="flex flex-row items-center gap-1">
                        {iconOption.icon}
                        <span>{iconOption.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <TextField
              label="Event Name"
              value={eventAction.eventName}
              onChange={(val) => onChange(index, { ...eventAction, eventName: val })}
              helperText="Name of the CustomEvent to dispatch (e.g., 'selection-action')"
              fullWidth
            />

            <div className="flex flex-col gap-1.5 flex-1 min-w-[280px]">
              <Label>Batch Mode</Label>
              <Select
                value={eventAction.batchMode ?? 'individual'}
                onValueChange={(val) => onChange(index, { ...eventAction, batchMode: val as BatchMode })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BATCH_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Template</Label>
            <RadioGroup
              className="flex flex-row gap-4"
              value={hasBodyTemplate ? 'custom' : 'none'}
              onValueChange={handleIncludesTemplateChange}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="none" id="event-template-none" />
                <Label htmlFor="event-template-none">None</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="custom" id="event-template-custom" />
                <Label htmlFor="event-template-custom">JSON template</Label>
              </div>
            </RadioGroup>
          </div>

          {hasBodyTemplate && (
            <>
              <InterpolationHelper batchMode={eventAction.batchMode} />
              <JSONEditor
                value={jsonDataTemplate || ''}
                onChange={handleBodyTemplateChange}
                minHeight="100px"
                maxHeight="200px"
              />
            </>
          )}

          <TextField
            label="Confirmation Message (optional)"
            value={eventAction.confirmMessage || ''}
            onChange={(val) => onChange(index, { ...eventAction, confirmMessage: val || undefined })}
            helperText="If set, shows a confirmation dialog before executing the action"
            fullWidth
          />
        </div>
      )}
    </DragAndDropElement>
  );
}

function WebhookActionEditor({
  action,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ItemActionEditorProps): ReactElement {
  const webhookAction = action as WebhookAction;
  const [pendingChange, setPendingChange] = useState<
    { kind: 'contentType'; value: ContentType } | { kind: 'method'; value: HttpMethod } | null
  >(null);
  const contentTypeValue = webhookAction.contentType ?? 'none';
  const hasBodyTemplate = (webhookAction.bodyTemplate ?? '').trim().length > 0;
  const supportsBody = BODY_METHODS.includes(webhookAction.method);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleBodyTemplateChange = useCallback(
    (template: string) => {
      onChange(index, { ...webhookAction, bodyTemplate: template || undefined });
    },
    [index, onChange, webhookAction]
  );

  const handleTextTemplateChange = useCallback(
    (val: string) => {
      onChange(index, { ...webhookAction, bodyTemplate: val || undefined });
    },
    [index, onChange, webhookAction]
  );

  const handleContentTypeChange = useCallback(
    (nextContentType: string) => {
      const ct = nextContentType as ContentType;
      if (ct === contentTypeValue) {
        return;
      }

      if (hasBodyTemplate) {
        setPendingChange({ kind: 'contentType', value: ct });
        return;
      }

      onChange(index, { ...webhookAction, contentType: ct });
    },
    [contentTypeValue, hasBodyTemplate, index, onChange, webhookAction]
  );

  const handleMethodChange = useCallback(
    (nextMethod: string) => {
      const method = nextMethod as HttpMethod;
      if (method === webhookAction.method) {
        return;
      }

      const nextSupportsBody = BODY_METHODS.includes(method);
      if (!nextSupportsBody && hasBodyTemplate) {
        setPendingChange({ kind: 'method', value: method });
        return;
      }

      onChange(index, { ...webhookAction, method });
    },
    [hasBodyTemplate, index, onChange, webhookAction]
  );

  const handleConfirmClose = useCallback(() => {
    setPendingChange(null);
  }, []);

  const handleConfirmApply = useCallback(() => {
    if (!pendingChange) {
      return;
    }

    if (pendingChange.kind === 'contentType') {
      onChange(index, { ...webhookAction, contentType: pendingChange.value, bodyTemplate: undefined });
    } else {
      onChange(index, { ...webhookAction, method: pendingChange.value, bodyTemplate: undefined });
    }

    setPendingChange(null);
  }, [index, onChange, pendingChange, webhookAction]);

  const jsonBodyTemplate = useMemo(() => {
    if (webhookAction.contentType === 'json' && webhookAction.bodyTemplate) {
      try {
        return JSON.parse(webhookAction.bodyTemplate);
      } catch {
        return {};
      }
    }
  }, [webhookAction.bodyTemplate, webhookAction.contentType]);

  return (
    <DragAndDropElement data={webhookAction as unknown as Record<string, unknown>}>
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            data-testid={`column-toggle#${webhookAction.name}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <span className="text-xs uppercase tracking-wide font-medium self-center">
            WEBHOOK ACTION: <strong>{webhookAction.name}</strong>
          </span>
        </div>

        <div className="flex flex-row gap-1">
          <InfoTooltip description="Remove action settings" placement="top">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto"
              onClick={() => onRemove(index)}
              key="delete-action-button"
            >
              <DeleteIcon className="h-4 w-4" />
            </Button>
          </InfoTooltip>
          <InfoTooltip description="Reorder action settings" placement="top">
            <DragButton
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              menuSx={{
                '.MuiPaper-root': { backgroundColor: (theme: { palette: { background: { lighter: string } } }) => theme.palette.background.lighter },
              }}
              key="reorder-action-button"
            />
          </InfoTooltip>
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col gap-4">
          <OptionsEditorControl
            label="Enabled"
            control={
              <Switch
                checked={action?.enabled ?? false}
                onCheckedChange={(checked) => onChange(index, { ...webhookAction, enabled: checked })}
              />
            }
          />

          <div className="flex flex-row gap-4">
            <TextField
              label="Action Name"
              value={webhookAction.name}
              onChange={(val) => onChange(index, { ...webhookAction, name: val })}
              className="flex-1"
            />

            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <Label>Icon</Label>
              <Select
                value={webhookAction.icon || ''}
                onValueChange={(val) =>
                  onChange(index, { ...webhookAction, icon: (val as ActionIcon) || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <em>None</em>
                  </SelectItem>
                  {ACTION_ICONS.map((iconOption) => (
                    <SelectItem key={iconOption.value} value={iconOption.value}>
                      <div className="flex flex-row items-center gap-1">
                        {iconOption.icon}
                        <span>{iconOption.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TextField
            label="URL"
            value={webhookAction.url}
            onChange={(val) => onChange(index, { ...webhookAction, url: val })}
            helperText={URL_HELPER_TEXT}
            fullWidth
          />

          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <Label>Method</Label>
              <Select value={webhookAction.method} onValueChange={handleMethodChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <Label>Batch Mode</Label>
              <Select
                value={webhookAction.batchMode}
                onValueChange={(val) => onChange(index, { ...webhookAction, batchMode: val as BatchMode })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BATCH_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Content Type</Label>
            <RadioGroup
              className="flex flex-row gap-4"
              value={contentTypeValue}
              onValueChange={handleContentTypeChange}
            >
              {CONTENT_TYPES.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem value={option.value} id={`content-type-${option.value}-${index}`} />
                  <Label htmlFor={`content-type-${option.value}-${index}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {supportsBody && contentTypeValue !== 'none' && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {contentTypeValue === 'json' ? 'Body Template (JSON)' : 'Body Template (Text)'}
              </p>
              <InterpolationHelper batchMode={webhookAction.batchMode} />
              {contentTypeValue === 'json' ? (
                <JSONEditor
                  value={jsonBodyTemplate || ''}
                  onChange={handleBodyTemplateChange}
                  minHeight="100px"
                  maxHeight="200px"
                />
              ) : (
                <TextField
                  value={webhookAction.bodyTemplate || ''}
                  onChange={handleTextTemplateChange}
                  fullWidth
                />
              )}
            </div>
          )}

          <TextField
            label="Confirmation Message (optional)"
            value={webhookAction.confirmMessage || ''}
            onChange={(val) => onChange(index, { ...webhookAction, confirmMessage: val || undefined })}
            helperText="If set, shows a confirmation dialog before executing the action"
            fullWidth
          />
        </div>
      )}

      <Dialog open={Boolean(pendingChange)} onClose={handleConfirmClose}>
        <Dialog.Header>Remove Body Template?</Dialog.Header>
        <Dialog.Content>{BODY_CLEAR_CONFIRM_MESSAGE}</Dialog.Content>
        <Dialog.Actions>
          <Dialog.PrimaryButton onClick={handleConfirmApply}>Continue</Dialog.PrimaryButton>
          <Dialog.SecondaryButton onClick={handleConfirmClose}>Cancel</Dialog.SecondaryButton>
        </Dialog.Actions>
      </Dialog>
    </DragAndDropElement>
  );
}

export function ItemSelectionActionsEditor({
  actionOptions,
  selectionOptions,
  onChangeActions,
  onChangeSelection,
}: ItemSelectionActionsEditorProps): ReactElement {
  const actions = useMemo(
    () => actionOptions || { enabled: true, displayInHeader: true, displayWithItem: false },
    [actionOptions]
  );

  const handleEnableActionsChange = (checked: boolean) => {
    onChangeActions({ ...actions, enabled: checked ? true : undefined });
  };

  const handleEnableSelectionChange = (checked: boolean) => {
    onChangeSelection({ ...selectionOptions, enabled: checked ? true : undefined });
  };

  const handleDisplayInHeaderChange = (checked: boolean) => {
    onChangeActions({ ...actions, displayInHeader: checked ? true : undefined });
  };

  const handleDisplayWithItemChange = (checked: boolean) => {
    onChangeActions({ ...actions, displayWithItem: checked ? true : undefined });
  };

  const handleAddEventAction = useCallback(() => {
    onChangeActions({ ...actions, actionsList: [...(actions.actionsList ?? []), createDefaultEventAction()] });
  }, [actions, onChangeActions]);

  const handleAddWebhookAction = useCallback(() => {
    onChangeActions({ ...actions, actionsList: [...(actions.actionsList ?? []), createDefaultWebhookAction()] });
  }, [actions, onChangeActions]);

  const handleActionChange = useCallback(
    (index: number, updatedAction: ItemAction) => {
      const newActions = actions.actionsList ? [...actions.actionsList] : [];
      newActions[index] = updatedAction;
      onChangeActions({ ...actions, actionsList: newActions });
    },
    [actions, onChangeActions]
  );

  const handleRemoveAction = useCallback(
    (index: number) => {
      const newActions = actions.actionsList ? actions.actionsList.filter((_, i) => i !== index) : [];
      onChangeActions(newActions.length > 0 ? { ...actions, actionsList: newActions } : undefined);
    },
    [actions, onChangeActions]
  );

  useDragAndDropMonitor({
    elements: actions.actionsList as unknown as Array<Record<string, unknown>>,
    accessKey: 'name',
    onChange: (newElements) => {
      onChangeActions({ ...actions, actionsList: newElements as unknown as ItemAction[] });
    },
  });

  return (
    <div className="flex flex-col gap-1">
      <OptionsEditorControl
        label="Enable Item Selection"
        description="Allow selecting items"
        control={<Switch checked={selectionOptions?.enabled ?? false} onCheckedChange={handleEnableSelectionChange} />}
      />
      <OptionsEditorControl
        label="Enable Item Actions"
        description="Allow executing actions on selected items"
        control={<Switch checked={actionOptions?.enabled ?? false} onCheckedChange={handleEnableActionsChange} />}
      />
      <OptionsEditorControl
        label="Display Actions in Panel Header"
        description="Show action buttons in the panel header when items are selected"
        control={<Switch checked={actionOptions?.displayInHeader ?? false} onCheckedChange={handleDisplayInHeaderChange} />}
      />
      <OptionsEditorControl
        label="Display Actions with Each Item"
        description="Show action buttons alongside each item when selected"
        control={<Switch checked={actionOptions?.displayWithItem ?? false} onCheckedChange={handleDisplayWithItemChange} />}
      />
      <OptionsEditorGroup title="Actions">
        <div className="flex flex-col gap-6">
          {!actions.actionsList || actions.actionsList.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No actions defined. Add an action to enable triggering events or webhooks on selected data.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {actions.actionsList &&
                actions.actionsList.map((action, index) => (
                  <div key={index} className="border-b border-border pb-1">
                    {action.type === 'event' ? (
                      <EventActionEditor
                        action={action}
                        index={index}
                        onChange={handleActionChange}
                        onRemove={handleRemoveAction}
                        onMoveDown={() =>
                          onChangeActions({ ...actions, actionsList: handleMoveDown(action, actions.actionsList!) })
                        }
                        onMoveUp={() =>
                          onChangeActions({ ...actions, actionsList: handleMoveUp(action, actions.actionsList!) })
                        }
                      />
                    ) : (
                      <WebhookActionEditor
                        action={action}
                        index={index}
                        onChange={handleActionChange}
                        onRemove={handleRemoveAction}
                        onMoveDown={() =>
                          onChangeActions({ ...actions, actionsList: handleMoveDown(action, actions.actionsList!) })
                        }
                        onMoveUp={() =>
                          onChangeActions({ ...actions, actionsList: handleMoveUp(action, actions.actionsList!) })
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          )}

          <div className="flex flex-row gap-1">
            <Button variant="default" className="flex items-center gap-1" onClick={handleAddEventAction}>
              <PlusIcon className="h-4 w-4" />
              Add Event Action
            </Button>
            <Button variant="default" className="flex items-center gap-1" onClick={handleAddWebhookAction}>
              <PlusIcon className="h-4 w-4" />
              Add Webhook Action
            </Button>
          </div>
        </div>
      </OptionsEditorGroup>
    </div>
  );
}
