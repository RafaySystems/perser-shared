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

import { useState, ReactElement } from 'react';
import { Plus as AddIcon, Trash2 as TrashIcon, ArrowUp, ArrowDown, Pencil as PencilIcon, ChevronUp } from 'lucide-react';
import { Link } from '@perses-dev/spec';
import { useImmer } from 'use-immer';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  InfoTooltip,
  LinkEditorForm,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@perses-dev/components';
import { useDiscardChangesConfirmationDialog } from '../../context';

export interface DashboardLinksEditorProps {
  links: Link[];
  onChange: (links: Link[]) => void;
  onCancel: () => void;
}

const DEFAULT_LINK: Link = {
  url: '',
  name: '',
  tooltip: '',
  renderVariables: true,
  targetBlank: true,
};

export function DashboardLinksEditor({
  links: initialLinks,
  onChange,
  onCancel,
}: DashboardLinksEditorProps): ReactElement {
  const [links, setLinks] = useImmer(initialLinks);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { openDiscardChangesConfirmationDialog, closeDiscardChangesConfirmationDialog } =
    useDiscardChangesConfirmationDialog();

  const handleCancel = (): void => {
    if (JSON.stringify(initialLinks) !== JSON.stringify(links)) {
      openDiscardChangesConfirmationDialog({
        onDiscardChanges: () => {
          closeDiscardChangesConfirmationDialog();
          onCancel();
        },
        onCancel: closeDiscardChangesConfirmationDialog,
      });
    } else {
      onCancel();
    }
  };

  const handleAdd = (): void => {
    setLinks((draft) => {
      draft.push({ ...DEFAULT_LINK });
    });
    setExpandedIndex(links.length);
  };

  const handleRemove = (index: number): void => {
    setLinks((draft) => {
      draft.splice(index, 1);
    });
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleMoveUp = (index: number): void => {
    if (index === 0) return;
    setLinks((draft) => {
      const temp = draft[index - 1];
      if (temp && draft[index]) {
        draft[index - 1] = draft[index]!;
        draft[index] = temp;
      }
    });
    if (expandedIndex === index) {
      setExpandedIndex(index - 1);
    } else if (expandedIndex === index - 1) {
      setExpandedIndex(index);
    }
  };

  const handleMoveDown = (index: number): void => {
    if (index >= links.length - 1) return;
    setLinks((draft) => {
      const temp = draft[index + 1];
      if (temp && draft[index]) {
        draft[index + 1] = draft[index]!;
        draft[index] = temp;
      }
    });
    if (expandedIndex === index) {
      setExpandedIndex(index + 1);
    } else if (expandedIndex === index + 1) {
      setExpandedIndex(index);
    }
  };

  const handleUpdateLink = (index: number, link: Link): void => {
    setLinks((draft) => {
      draft[index] = link;
    });
  };

  const isValid = links.every((link) => link.url.trim().length > 0);

  return (
    <>
      <div className="flex items-center px-4 py-2 border-b">
        <h2 className="text-base font-semibold">Edit Dashboard Links</h2>
        <div className="flex flex-row gap-2 ml-auto">
          <Button disabled={!isValid} variant="default" onClick={() => onChange(links)}>
            Apply
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
      <div className="p-4 overflow-y-auto flex flex-col gap-4">
        <Table style={{ tableLayout: 'fixed', width: '100%' }} aria-label="table of dashboard links">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead style={{ width: 80 }}>New Tab</TableHead>
              <TableHead className="text-right" style={{ width: 180 }}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link, index) => (
              <LinkTableRow
                key={index}
                link={link}
                index={index}
                isFirst={index === 0}
                isLast={index === links.length - 1}
                isExpanded={expandedIndex === index}
                onToggleExpand={() => setExpandedIndex(expandedIndex === index ? null : index)}
                onUpdate={(updatedLink) => handleUpdateLink(index, updatedLink)}
                onRemove={() => handleRemove(index)}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
              />
            ))}
          </TableBody>
        </Table>
        {links.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-8">
            No links defined. Click &apos;Add Link&apos; to create one.
          </p>
        )}
        <Button variant="default" onClick={handleAdd} className="self-start">
          <AddIcon className="mr-1 h-4 w-4" />
          Add Link
        </Button>
      </div>
    </>
  );
}

interface LinkTableRowProps {
  link: Link;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (link: Link) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function LinkTableRow({
  link,
  index,
  isFirst,
  isLast,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: LinkTableRowProps): ReactElement {
  const displayName = link.name?.trim() || `Link ${index + 1}`;
  const hasError = link.url.trim().length === 0;

  return (
    <>
      <TableRow>
        <TableCell className="font-bold overflow-hidden text-ellipsis">{displayName}</TableCell>
        <TableCell
          className={`overflow-hidden text-ellipsis whitespace-nowrap${hasError ? ' text-destructive' : ''}`}
        >
          <InfoTooltip description={link.url} enterDelay={100}>
            {link.url || '(no URL)'}
          </InfoTooltip>
        </TableCell>
        <TableCell>{link.targetBlank ? 'Yes' : 'No'}</TableCell>
        <TableCell className="text-right whitespace-nowrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move link up"
            className="h-8 w-8"
          >
            <ArrowUp />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move link down"
            className="h-8 w-8"
          >
            <ArrowDown />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
            aria-label={isExpanded ? 'Collapse link editor' : 'Edit link'}
            className="h-8 w-8"
          >
            {isExpanded ? <ChevronUp /> : <PencilIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label="Remove link"
            className="h-8 w-8"
          >
            <TrashIcon />
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={4}
          className={`pb-0 pt-0${isExpanded ? '' : ' border-0'}`}
          style={{ paddingBottom: 0, paddingTop: 0 }}
        >
          <Collapsible open={isExpanded}>
            <CollapsibleContent>
              <div className="m-4">
                <LinkEditorForm
                  mode="modalEmbedded"
                  url={{
                    value: link.url,
                    label: 'URL',
                    error: { hasError: hasError, helperText: hasError ? 'URL is required' : undefined },
                    placeholder: 'https://example.com/dashboard?var=$variable',
                    onChange: (url) => onUpdate({ ...link, url }),
                  }}
                  name={{
                    value: link.name ?? '',
                    label: 'Display Name',
                    onChange: (name) => onUpdate({ ...link, name }),
                  }}
                  tooltip={{
                    value: link.tooltip ?? '',
                    label: 'Tooltip',
                    onChange: (tooltip) => onUpdate({ ...link, tooltip }),
                  }}
                  renderVariables={{
                    value: link.renderVariables ?? true,
                    label: 'Replace variables in URL',
                    onChange: (renderVariables) => onUpdate({ ...link, renderVariables }),
                  }}
                  newTabOpen={{
                    value: link.targetBlank ?? true,
                    label: 'Open in new tab',
                    onChange: (targetBlank) => onUpdate({ ...link, targetBlank }),
                  }}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </>
  );
}
