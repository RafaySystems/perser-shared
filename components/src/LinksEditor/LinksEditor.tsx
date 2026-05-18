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

import { Fragment, HTMLAttributes, ReactElement } from 'react';
import { Controller, useFieldArray, Control } from 'react-hook-form';
import { Plus as PlusIcon, Minus as MinusIcon } from 'lucide-react';
import { PanelEditorValues } from '@perses-dev/spec';
import { LinkEditorForm } from './LinkEditorForm';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

export interface LinksEditorProps extends HTMLAttributes<HTMLDivElement> {
  control: Control<PanelEditorValues>;
}

export function LinksEditor({ control, ...props }: LinksEditorProps): ReactElement {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'panelDefinition.spec.links',
  });

  return (
    <div className="flex flex-col gap-6" {...props}>
      {fields && fields.length > 0 ? (
        fields.map((field, index) => (
          <Fragment key={field.id}>
            <div className="flex flex-row gap-2 items-center">
              <LinkControl control={control} index={index} />
              <Button
                variant="ghost"
                size="icon"
                style={{ width: 'fit-content', height: 'fit-content' }}
                onClick={() => remove(index)}
              >
                <MinusIcon />
              </Button>
            </div>
            <Separator />
          </Fragment>
        ))
      ) : (
        <p className="text-sm italic mb-4">No links defined</p>
      )}
      <Button
        variant="ghost"
        size="icon"
        style={{ width: 'fit-content', height: 'fit-content' }}
        onClick={() => append({ url: '', name: '', tooltip: '', renderVariables: false, targetBlank: false })}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}

function LinkControl({ control, index }: { control: Control<PanelEditorValues>; index: number }): ReactElement {
  const defaultLink = { url: '', name: '', tooltip: '', renderVariables: false, targetBlank: false };
  return (
    <Controller
      control={control}
      name={`panelDefinition.spec.links.${index}`}
      render={({ field, field: { value: link }, fieldState }) => {
        const safeLink = link ?? defaultLink;
        return (
          <LinkEditorForm
            mode="inline"
            url={{
              value: safeLink.url,
              label: 'URL',
              error: { hasError: !!fieldState.error, helperText: fieldState.error?.message },
              onChange: (url) => {
                field.onChange({ ...link, url });
              },
            }}
            newTabOpen={{
              value: !!safeLink.targetBlank,
              onChange: (targetBlank) => {
                field.onChange({ ...link, targetBlank });
              },
              label: 'Open in new tab',
            }}
            name={{
              value: safeLink.name ?? '',
              label: 'Name',
              onChange: (name) => {
                field.onChange({ ...link, name });
              },
            }}
            renderVariables={{
              value: !!safeLink.renderVariables,
              label: 'Render variables',
              onChange: (renderVariables) => {
                field.onChange({ ...link, renderVariables });
              },
            }}
            tooltip={{
              value: safeLink.tooltip ?? '',
              label: 'Tooltip',
              onChange: (tooltip) => {
                field.onChange({ ...link, tooltip });
              },
            }}
          />
        );
      }}
    />
  );
}
