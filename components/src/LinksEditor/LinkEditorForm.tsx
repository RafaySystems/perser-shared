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
import { Checkbox } from '../ui/checkbox';
import { cn } from '../lib/utils';

export interface LinkEditorFormField<T> {
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  label: string;
  error: { hasError?: boolean; helperText?: string };
}

export interface LinkEditorFormProps {
  mode: 'inline' | 'modalEmbedded';
  url: LinkEditorFormField<string>;
  name?: Omit<LinkEditorFormField<string>, 'error'>;
  tooltip?: Omit<LinkEditorFormField<string>, 'error'>;
  newTabOpen: Omit<LinkEditorFormField<boolean>, 'error'>;
  renderVariables?: Omit<LinkEditorFormField<boolean>, 'error'>;
}

export const LinkEditorForm = (props: LinkEditorFormProps): ReactElement => {
  const { mode, url, name, newTabOpen, renderVariables, tooltip } = props;

  return (
    <div className="flex flex-col gap-4 grow">
      <TextField
        label={url.label}
        error={url.error?.hasError}
        helperText={url.error?.helperText}
        onChange={url.onChange}
        placeholder={url.placeholder}
        multiline
        maxRows={5}
        required
        fullWidth
        value={url.value}
      />
      {(name || tooltip) && (
        <div className={cn('flex gap-2', mode === 'inline' ? 'flex-row' : 'flex-col')}>
          {name && (
            <TextField
              className="grow"
              label={name.label}
              onChange={name?.onChange}
              placeholder={name?.placeholder}
              value={name?.value}
            />
          )}
          {tooltip && (
            <TextField
              className="grow"
              label={tooltip.label}
              onChange={tooltip?.onChange}
              placeholder={tooltip?.placeholder}
              value={tooltip?.value}
            />
          )}
        </div>
      )}
      <div className="flex flex-row gap-2">
        {renderVariables && (
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={renderVariables.value}
              onCheckedChange={(checked) => {
                renderVariables?.onChange(!!checked);
              }}
            />
            {renderVariables.label}
          </label>
        )}

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox
            checked={newTabOpen.value}
            onCheckedChange={(checked) => {
              newTabOpen?.onChange(!!checked);
            }}
          />
          {newTabOpen.label}
        </label>
      </div>
    </div>
  );
};
