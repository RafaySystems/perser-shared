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

import { FC } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { OptionsColorPicker } from '../ColorPicker/OptionsColorPicker';
import { ValueMapping } from '../model';
import { cn } from '../lib/utils';

interface ValueMappingConditionEditorProps {
  mapping: ValueMapping;
  onChange: (condition: ValueMapping) => void;
  className?: string;
}

const ConditionEditor: FC<ValueMappingConditionEditorProps> = ({ mapping, onChange, className }) => {
  switch (mapping.kind) {
    case 'Value':
      return (
        <div className={cn('flex flex-row gap-2', className)}>
          <div className="flex flex-col gap-1 w-full">
            <Label>Value</Label>
            <Input
              placeholder="Exact value"
              value={mapping.spec?.value ?? ''}
              onChange={(e) =>
                onChange({ ...mapping, spec: { ...mapping.spec, value: e.target.value } })
              }
            />
          </div>
        </div>
      );
    case 'Range':
      return (
        <div className={cn('flex flex-row gap-2', className)}>
          <div className="flex flex-col gap-1 w-full">
            <Label>From</Label>
            <Input
              placeholder="Start of range"
              value={mapping.spec?.from ?? ''}
              onChange={(e) =>
                onChange({
                  ...mapping,
                  spec: {
                    ...mapping.spec,
                    from: e.target.value === '' ? undefined : +e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label>To</Label>
            <Input
              placeholder="End of range (inclusive)"
              value={mapping.spec?.to ?? ''}
              onChange={(e) =>
                onChange({
                  ...mapping,
                  spec: {
                    ...mapping.spec,
                    to: e.target.value === '' ? undefined : +e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      );
    case 'Regex':
      return (
        <div className={cn('flex flex-row gap-2', className)}>
          <div className="flex flex-col gap-1 w-full">
            <Label>Regular Expression</Label>
            <Input
              placeholder="JavaScript regular expression"
              value={mapping.spec?.pattern ?? ''}
              onChange={(e) =>
                onChange({ ...mapping, spec: { ...mapping.spec, pattern: e.target.value } })
              }
            />
          </div>
        </div>
      );
    case 'Misc':
      return (
        <div className={cn('flex flex-row gap-2', className)}>
          <div className="flex flex-col gap-1 w-full">
            <Label>Value</Label>
            <Select
              value={mapping.spec?.value ?? ''}
              onValueChange={(val) =>
                onChange({ ...mapping, spec: { value: val } } as ValueMapping)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empty">
                  <div className="flex flex-col">
                    <span>Empty</span>
                    <span className="text-xs text-muted-foreground">Matches empty string</span>
                  </div>
                </SelectItem>
                <SelectItem value="null">
                  <div className="flex flex-col">
                    <span>Null</span>
                    <span className="text-xs text-muted-foreground">Matches null or undefined</span>
                  </div>
                </SelectItem>
                <SelectItem value="NaN">
                  <div className="flex flex-col">
                    <span>NaN</span>
                    <span className="text-xs text-muted-foreground">Matches Not a Number value</span>
                  </div>
                </SelectItem>
                <SelectItem value="true">
                  <div className="flex flex-col">
                    <span>True</span>
                    <span className="text-xs text-muted-foreground">Matches true boolean</span>
                  </div>
                </SelectItem>
                <SelectItem value="false">
                  <div className="flex flex-col">
                    <span>False</span>
                    <span className="text-xs text-muted-foreground">Matches false boolean</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export interface ValueMappingEditorProps {
  mapping: ValueMapping;
  onChange: (mapping: ValueMapping) => void;
  onDelete: () => void;
  className?: string;
}

export const ValueMappingEditor: FC<ValueMappingEditorProps> = ({ mapping, onChange, onDelete, className }) => {
  const handleColorChange = (color?: string): void => {
    onChange({
      ...mapping,
      spec: {
        ...mapping.spec,
        result: {
          ...mapping.spec.result,
          color,
        },
      },
    } as ValueMapping);
  };

  return (
    <div className={cn('grid grid-cols-10 gap-4 items-start', className)}>
      {/* Condition — occupies 5/10 columns */}
      <div className="col-span-5">
        <div className="flex flex-row gap-2 w-full">
          <div className="flex flex-col gap-1 w-[120px] shrink-0">
            <Label>Type</Label>
            <Select
              value={mapping.kind}
              onValueChange={(val) => onChange({ ...mapping, kind: val } as ValueMapping)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Value">
                  <div className="flex flex-col">
                    <span>Value</span>
                    {mapping.kind !== 'Value' && (
                      <span className="text-xs text-muted-foreground">Matches an exact text value</span>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="Range">
                  <div className="flex flex-col">
                    <span>Range</span>
                    {mapping.kind !== 'Range' && (
                      <span className="text-xs text-muted-foreground">Matches against a numerical range</span>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="Regex">
                  <div className="flex flex-col">
                    <span>Regex</span>
                    {mapping.kind !== 'Regex' && (
                      <span className="text-xs text-muted-foreground">Matches against a regular expression</span>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="Misc">
                  <div className="flex flex-col">
                    <span>Misc</span>
                    {mapping.kind !== 'Misc' && (
                      <span className="text-xs text-muted-foreground">Matches against empty, null and NaN values</span>
                    )}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ConditionEditor
            className="w-full"
            mapping={mapping}
            onChange={(updatedMapping) => onChange({ ...mapping, ...updatedMapping })}
          />
        </div>
      </div>

      {/* Display text — 4/10 columns */}
      <div className="col-span-4">
        <div className="flex flex-col gap-1">
          <Label>Display text</Label>
          <Input
            value={mapping.spec?.result?.value ?? ''}
            onChange={(e) =>
              onChange({
                ...mapping,
                spec: {
                  ...mapping.spec,
                  result: {
                    ...mapping.spec?.result,
                    value: e.target.value,
                  },
                },
              } as ValueMapping)
            }
          />
        </div>
      </div>

      {/* Color — 1/10 columns */}
      <div className="col-span-1 flex justify-center items-end pb-0.5">
        {mapping.spec?.result?.color ? (
          <OptionsColorPicker
            label="Color"
            color={mapping.spec.result.color ?? '#000'}
            onColorChange={handleColorChange}
            onClear={() => handleColorChange(undefined)}
          />
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleColorChange('#000')}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Delete — hidden in the grid, rendered after via absolute positioning or sibling */}
      <div className="col-span-10 flex justify-end -mt-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              aria-label="Remove mapping settings"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Remove mapping settings</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
