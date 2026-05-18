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
import { TextField } from '../controls';
import {
  JoinByColumnValueTransform,
  MergeColumnsTransform,
  MergeIndexedColumnsTransform,
  MergeSeriesTransform,
  Transform,
} from '../model';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { cn } from '../lib/utils';

interface TransformSpecEditorProps<Spec> {
  value: Spec;
  onChange: (transform: Spec) => void;
}

// A simple multi-value input (tag input) using a plain input with comma-separated values
function TagInput({
  value,
  onChange,
  label,
  required,
}: {
  value: string[];
  onChange: (values: string[]) => void;
  label?: string;
  required?: boolean;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      <input
        type="text"
        value={value.join(', ')}
        onChange={(e) => {
          const raw = e.target.value;
          const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
          onChange(parts);
        }}
        placeholder="Enter values separated by commas"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}

function EnabledSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}): ReactElement {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Label htmlFor="enabled-switch" className="text-sm">
        Enabled
      </Label>
      <Switch id="enabled-switch" checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function JoinByColumnValueTransformEditor({
  value,
  onChange,
}: TransformSpecEditorProps<JoinByColumnValueTransform>): ReactElement {
  return (
    <div className="flex flex-row gap-2 items-center">
      <TagInput
        label="Columns"
        required
        value={value.spec.columns ?? []}
        onChange={(columns) =>
          onChange({ ...value, spec: { ...value.spec, columns } })
        }
      />
      <EnabledSwitch
        checked={!value.spec.disabled}
        onChange={(enabled) =>
          onChange({ ...value, spec: { ...value.spec, disabled: !enabled } })
        }
      />
    </div>
  );
}

function MergeColumnsTransformEditor({
  value,
  onChange,
}: TransformSpecEditorProps<MergeColumnsTransform>): ReactElement {
  return (
    <div className="flex flex-row gap-2 items-center">
      <TagInput
        label="Columns"
        required
        value={value.spec.columns ?? []}
        onChange={(columns) =>
          onChange({ ...value, spec: { ...value.spec, columns } })
        }
      />
      <TextField
        id="merge-columns-name"
        variant="outlined"
        label="Output Name"
        value={value.spec.name ?? ''}
        className="w-full"
        onChange={(name) =>
          onChange({ ...value, spec: { ...value.spec, name } })
        }
        required
      />
      <EnabledSwitch
        checked={!value.spec.disabled}
        onChange={(enabled) =>
          onChange({ ...value, spec: { ...value.spec, disabled: !enabled } })
        }
      />
    </div>
  );
}

function MergeIndexedColumnsTransformEditor({
  value,
  onChange,
}: TransformSpecEditorProps<MergeIndexedColumnsTransform>): ReactElement {
  return (
    <div className="flex flex-row gap-2 items-center">
      <TextField
        id="merge-indexed-columns"
        variant="outlined"
        label="Column"
        placeholder="Example: 'value' for merging 'value #1', 'value #2' and 'value #...'"
        value={value.spec.column ?? ''}
        className="w-full"
        onChange={(column) =>
          onChange({ ...value, spec: { ...value.spec, column } })
        }
        required
      />
      <EnabledSwitch
        checked={!value.spec.disabled}
        onChange={(enabled) =>
          onChange({ ...value, spec: { ...value.spec, disabled: !enabled } })
        }
      />
    </div>
  );
}

function MergeSeriesTransformEditor({ value, onChange }: TransformSpecEditorProps<MergeSeriesTransform>): ReactElement {
  return (
    <div className="flex flex-row">
      <EnabledSwitch
        checked={!value.spec.disabled}
        onChange={(enabled) =>
          onChange({ ...value, spec: { ...value.spec, disabled: !enabled } })
        }
      />
    </div>
  );
}

export interface TransformEditorProps {
  value: Transform;
  onChange: (transform: Transform) => void;
  className?: string;
}

export function TransformEditor({ value, onChange, className }: TransformEditorProps): ReactElement {
  return (
    <div className={cn('flex flex-col gap-4 w-full mt-1', className)}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="transform-kind">Kind</Label>
        <Select
          value={value.kind}
          onValueChange={(kind) => onChange({ ...value, kind: kind as unknown as Transform['kind'] } as Transform)}
        >
          <SelectTrigger id="transform-kind">
            <SelectValue placeholder="Select transform kind" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="JoinByColumnValue">
              <div className="flex flex-col">
                <span>Join by column value</span>
                <span className="text-xs text-muted-foreground">Regroup rows with equal cell value in a column</span>
              </div>
            </SelectItem>
            <SelectItem value="MergeColumns">
              <div className="flex flex-col">
                <span>Merge columns</span>
                <span className="text-xs text-muted-foreground">Multiple columns are merged to one column</span>
              </div>
            </SelectItem>
            <SelectItem value="MergeIndexedColumns">
              <div className="flex flex-col">
                <span>Merge indexed columns</span>
                <span className="text-xs text-muted-foreground">Indexed columns are merged to one column</span>
              </div>
            </SelectItem>
            <SelectItem value="MergeSeries">
              <div className="flex flex-col">
                <span>Merge series</span>
                <span className="text-xs text-muted-foreground">Series will be merged by their labels</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value.kind === 'JoinByColumnValue' && <JoinByColumnValueTransformEditor value={value} onChange={onChange} />}
      {value.kind === 'MergeColumns' && <MergeColumnsTransformEditor value={value} onChange={onChange} />}
      {value.kind === 'MergeIndexedColumns' && (
        <MergeIndexedColumnsTransformEditor value={value} onChange={onChange} />
      )}
      {value.kind === 'MergeSeries' && <MergeSeriesTransformEditor value={value} onChange={onChange} />}
    </div>
  );
}
