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

import { ReactElement, ReactNode, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { cn } from '../lib/utils';

/**
 * Interface to extend from for `options` when using `SettingsAutocomplete`.
 */
export interface SettingsAutocompleteOption {
  /**
   * Unique identifier for the option.
   */
  id: string;

  /**
   * Optional value that is presented to the user for each option. If not set,
   * the `id` will be used instead.
   */
  label?: string;

  /**
   * Optional description that will be rendered below the `label` to provide the
   * user with additional information about the option.
   */
  description?: ReactNode;

  /**
   * When `true`, the option will be disabled.
   */
  disabled?: boolean;
}

export interface SettingsAutocompleteProps<
  OptionType extends SettingsAutocompleteOption,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
> {
  options: OptionType[];
  value?: Multiple extends true ? OptionType[] : OptionType | null;
  onChange?: (
    event: React.SyntheticEvent | null,
    value: Multiple extends true ? OptionType[] : OptionType | null
  ) => void;
  multiple?: Multiple;
  disableClearable?: DisableClearable;
  id?: string;
  'aria-labelledby'?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Optional custom trigger renderer (replaces renderInput in the MUI API) */
  renderInput?: (params: { inputProps?: Record<string, unknown> }) => ReactElement;
}

function getLabel(option: SettingsAutocompleteOption): string {
  return option.label ?? option.id;
}

/**
 * Opinionated autocomplete component useful for providing users with a dropdown
 * for settings that require selecting one or more options from a list.
 *
 * **Note: This component is currently experimental and is likely to have significant breaking changes in the near future. Use with caution outside of the core Perses codebase.**
 */
export function SettingsAutocomplete<
  OptionType extends SettingsAutocompleteOption,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
>({
  options,
  value,
  onChange,
  multiple,
  disableClearable,
  id,
  'aria-labelledby': ariaLabelledby,
  placeholder = 'Select...',
  disabled,
  className,
}: SettingsAutocompleteProps<OptionType, Multiple, DisableClearable>): ReactElement {
  const [open, setOpen] = useState(false);

  const selectedIds: string[] = multiple
    ? ((value as OptionType[] | undefined) ?? []).map((o) => o.id)
    : value
      ? [(value as OptionType).id]
      : [];

  const displayLabel = multiple
    ? selectedIds.length > 0
      ? selectedIds
          .map((id) => {
            const opt = options.find((o) => o.id === id);
            return opt ? getLabel(opt) : id;
          })
          .join(', ')
      : placeholder
    : selectedIds.length > 0
      ? getLabel(options.find((o) => o.id === selectedIds[0]) ?? { id: selectedIds[0] })
      : placeholder;

  const handleSelect = (optionId: string): void => {
    const option = options.find((o) => o.id === optionId);
    if (!option || option.disabled) return;

    if (multiple) {
      const currentIds = selectedIds;
      const nextIds = currentIds.includes(optionId)
        ? currentIds.filter((id) => id !== optionId)
        : [...currentIds, optionId];
      const nextOptions = options.filter((o) => nextIds.includes(o.id));
      onChange?.(null, nextOptions as Multiple extends true ? OptionType[] : OptionType | null);
    } else {
      const isSame = selectedIds[0] === optionId;
      if (isSame && !disableClearable) {
        onChange?.(null, null as Multiple extends true ? OptionType[] : OptionType | null);
      } else {
        onChange?.(null, option as Multiple extends true ? OptionType[] : OptionType | null);
      }
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-labelledby={ariaLabelledby}
          disabled={disabled}
          className={cn('w-full justify-between font-normal', className)}
        >
          <span className="truncate text-left flex-1">{displayLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command
          filter={(value, search) => {
            const option = options.find((o) => o.id === value);
            if (!option) return 0;
            const searchTarget = `${getLabel(option)} ${option.description ?? ''}`.toLowerCase();
            return searchTarget.includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    disabled={option.disabled}
                    onSelect={handleSelect}
                    className="flex items-start gap-2"
                  >
                    <Check
                      className={cn('mt-0.5 h-4 w-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
                    />
                    <div>
                      <div className="text-sm">{getLabel(option)}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
