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

import { FormEventHandler, ReactElement, useState } from 'react';
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@perses-dev/components';
import { TextField } from '@perses-dev/components';
import { PanelGroupEditorValues } from '../../context';

export interface PanelGroupEditorFormProps {
  initialValues: PanelGroupEditorValues;
  variables?: string[];
  onSubmit: (next: PanelGroupEditorValues) => void;
}

export function PanelGroupEditorForm(props: PanelGroupEditorFormProps): ReactElement {
  const { initialValues, variables, onSubmit } = props;

  const [title, setTitle] = useState(initialValues.title);
  const [isCollapsed, setIsCollapsed] = useState(initialValues.isCollapsed);
  const [repeatVariable, setRepeatVariable] = useState<string | undefined>(initialValues.repeatVariable);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit({ title, isCollapsed, repeatVariable });
  };

  return (
    <form id={panelGroupEditorFormId} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 my-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="panel-group-name">Name *</Label>
          <TextField
            id="panel-group-name"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="panel-group-editor-name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="panel-group-collapse">Collapse State *</Label>
          <Select
            value={isCollapsed ? 'Closed' : 'Open'}
            onValueChange={(v) => setIsCollapsed(v === 'Closed')}
          >
            <SelectTrigger id="panel-group-collapse">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="panel-group-repeat">Repeat Variable</Label>
          <Select
            value={repeatVariable ?? ''}
            onValueChange={(v) => setRepeatVariable(v === '' ? undefined : v)}
          >
            <SelectTrigger id="panel-group-repeat">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                <em>None</em>
              </SelectItem>
              {variables
                ?.sort((a, b) => a.localeCompare(b))
                .map((variable) => (
                  <SelectItem key={variable} value={variable}>
                    {variable}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
}

/**
 * The `id` attribute added to the `PanelGroupEditorForm` component, allowing submit buttons to live outside the form.
 */
export const panelGroupEditorFormId = 'panel-group-editor-form';
