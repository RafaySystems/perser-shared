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

import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Spinner,
} from '@perses-dev/components';
import {
  DEFAULT_ALL_VALUE,
  ListVariableDefinition,
  ListVariableSpec,
  TextVariableDefinition,
  VariableName,
  VariableValue,
} from '@perses-dev/spec';
import {
  SORT_METHODS,
  SortMethodName,
  useListVariablePluginValues,
  VariableOption,
  VariableState,
} from '@perses-dev/plugin-system';
import { UseQueryResult } from '@tanstack/react-query';
import { useVariableDefinitionAndState, useVariableDefinitionActions } from '../../context';
import { MAX_VARIABLE_WIDTH, MIN_VARIABLE_WIDTH } from '../../constants';
import { ListVariableListBoxProvider, ListVariableListBox } from './ListVariableListBox';
import { Check as CheckIcon, ChevronDown as ChevronDownIcon } from 'lucide-react';

type VariableProps = {
  name: VariableName;
  source?: string;
};

function variableOptionToVariableValue(options: VariableOption | VariableOption[] | null): VariableValue {
  if (options === null) {
    return null;
  }
  if (Array.isArray(options)) {
    return options.map((v) => {
      return v.value;
    });
  }
  return options.value;
}

export function Variable({ name, source }: VariableProps): ReactElement {
  const ctx = useVariableDefinitionAndState(name, source);
  const kind = ctx.definition?.kind;
  switch (kind) {
    case 'TextVariable':
      return <TextVariable name={name} source={source} />;
    case 'ListVariable':
      return <ListVariable name={name} source={source} />;
  }

  return <div>Unsupported Variable Kind: ${kind}</div>;
}

export function useListVariableState(
  spec: ListVariableSpec | undefined,
  state: VariableState | undefined,
  variablesOptionsQuery: Partial<UseQueryResult<VariableOption[]>>
): {
  value: VariableValue | undefined;
  loading: boolean;
  options: VariableOption[] | undefined;
  selectedOptions: VariableOption | VariableOption[];
  viewOptions: VariableOption[];
} {
  const allowMultiple = spec?.allowMultiple === true;
  const allowAllValue = spec?.allowAllValue === true;
  const sort = spec?.sort;
  const loading = useMemo(() => variablesOptionsQuery.isFetching ?? false, [variablesOptionsQuery.isFetching]);
  const options = useMemo(() => variablesOptionsQuery.data ?? [], [variablesOptionsQuery.data]);

  let value = state?.value;

  if (allowMultiple && !Array.isArray(value)) {
    value = typeof value === 'string' ? [value] : [];
  }

  const sortedOptions = useMemo((): VariableOption[] => {
    const opts = options ? [...options] : [];
    if (!sort || sort === 'none') return opts;
    const sortMethod = SORT_METHODS[sort as SortMethodName];
    return !sortMethod ? opts : sortMethod.sort(opts);
  }, [options, sort]);

  const viewOptions = useMemo(() => {
    let computedOptions = sortedOptions;
    if (allowAllValue) {
      computedOptions = [{ value: DEFAULT_ALL_VALUE, label: 'All' }, ...computedOptions];
    }
    return computedOptions;
  }, [allowAllValue, sortedOptions]);

  const valueIsInOptions = useMemo(
    () =>
      Boolean(
        viewOptions.find((v) => {
          if (allowMultiple) {
            return (value as string[]).includes(v.value);
          }
          return value === v.value;
        })
      ),
    [viewOptions, value, allowMultiple]
  );

  value = useMemo(() => {
    const firstOptionValue = viewOptions?.[allowAllValue ? 1 : 0]?.value;
    if (firstOptionValue) {
      if (!valueIsInOptions || !value || value.length === 0) {
        return allowMultiple ? [firstOptionValue] : firstOptionValue;
      }
    }
    return value;
  }, [viewOptions, value, valueIsInOptions, allowMultiple, allowAllValue]);

  const selectedOptions = useMemo(() => {
    if (Array.isArray(value)) {
      return viewOptions.filter((o) => {
        return value?.includes(o.value);
      });
    } else {
      return (
        viewOptions.find((o) => {
          return value === o.value;
        }) ?? { value: '', label: '' }
      );
    }
  }, [value, viewOptions]);

  return { value, loading, options, selectedOptions, viewOptions };
}

const LETTER_HSIZE = 8;
const ARROW_OFFSET = 40;
const getWidthPx = (inputValue: string, kind: 'list' | 'text'): number => {
  const width = (inputValue.length + 1) * LETTER_HSIZE + (kind === 'list' ? ARROW_OFFSET : 0);
  if (width < MIN_VARIABLE_WIDTH) {
    return MIN_VARIABLE_WIDTH;
  } else if (width > MAX_VARIABLE_WIDTH) {
    return MAX_VARIABLE_WIDTH;
  } else {
    return width;
  }
};

function ListVariable({ name, source }: VariableProps): ReactElement {
  const ctx = useVariableDefinitionAndState(name, source);
  const definition = ctx.definition as ListVariableDefinition;
  const variablesOptionsQuery = useListVariablePluginValues(definition);
  const { setVariableValue, setVariableLoading, setVariableOptions } = useVariableDefinitionActions();
  const { selectedOptions, value, loading, options, viewOptions } = useListVariableState(
    definition?.spec,
    ctx.state,
    variablesOptionsQuery
  );
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const title = definition?.spec.display?.name ?? name;
  const allowMultiple = definition?.spec.allowMultiple === true;
  const allowAllValue = definition?.spec.allowAllValue === true;

  const filteredOptions = useMemo(
    () => viewOptions.filter((o) => o.label.toLowerCase().includes(searchValue.toLowerCase())),
    [viewOptions, searchValue]
  );

  // Update value when changed
  useEffect(() => {
    if (value) {
      setVariableValue(name, value, source);
    }
  }, [setVariableValue, name, value, source]);

  // Update loading when changed
  useEffect(() => {
    setVariableLoading(name, loading, source);
  }, [setVariableLoading, name, loading, source]);

  // Update options when changed
  useEffect(() => {
    if (options) {
      setVariableOptions(name, options, source);
    }
  }, [setVariableOptions, name, options, source]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (allowMultiple) {
        const currentValues = Array.isArray(value) ? (value as string[]) : [];
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter((v) => v !== optionValue)
          : [...currentValues, optionValue];
        if (newValues.length === 0 && allowAllValue) {
          setVariableValue(name, DEFAULT_ALL_VALUE, source);
        } else {
          setVariableValue(name, newValues, source);
        }
      } else {
        setVariableValue(name, optionValue, source);
        setOpen(false);
      }
    },
    [allowMultiple, allowAllValue, value, name, setVariableValue, source]
  );

  const displayLabel = useMemo(() => {
    if (Array.isArray(selectedOptions)) {
      if (selectedOptions.length === 0) return title;
      if (selectedOptions.length === 1) return selectedOptions[0]?.label ?? title;
      return `${selectedOptions.length} selected`;
    }
    return (selectedOptions as VariableOption).label || title;
  }, [selectedOptions, title]);

  const inputWidth = getWidthPx(displayLabel, 'list');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-xs h-[38px]"
          style={{ minWidth: `${inputWidth}px`, maxWidth: `${MAX_VARIABLE_WIDTH}px` }}
        >
          <span className="truncate">{title}: {displayLabel}</span>
          {loading ? <Spinner className="h-3 w-3 ml-1" /> : <ChevronDownIcon className="ml-1 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 min-w-[fit-content]" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${title}...`}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => {
              const isSelected = Array.isArray(selectedOptions)
                ? selectedOptions.some((s) => s.value === option.value)
                : (selectedOptions as VariableOption).value === option.value;
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center gap-2"
                >
                  {allowMultiple && (
                    <Checkbox checked={isSelected} className="pointer-events-none" />
                  )}
                  {!allowMultiple && isSelected && <CheckIcon className="h-4 w-4" />}
                  {!allowMultiple && !isSelected && <span className="h-4 w-4" />}
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TextVariable({ name, source }: VariableProps): ReactElement {
  const ctx = useVariableDefinitionAndState(name, source);
  const state = ctx.state;
  const definition = ctx.definition as TextVariableDefinition;
  const [tempValue, setTempValue] = useState(state?.value ?? '');
  const [inputWidth, setInputWidth] = useState(getWidthPx(tempValue as string, 'text'));
  const { setVariableValue } = useVariableDefinitionActions();

  useEffect(() => {
    setTempValue(state?.value ?? '');
  }, [state?.value]);

  const label = definition?.spec.display?.name ?? name;

  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-xs text-muted-foreground px-1">{label}</label>
      <input
        className="border rounded-md px-2 py-1 text-xs h-[38px] bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        title={tempValue as string}
        value={tempValue as string}
        readOnly={definition?.spec.constant ?? false}
        onChange={(e) => {
          setTempValue(e.target.value);
          setInputWidth(getWidthPx(e.target.value, 'text'));
        }}
        onBlur={() => setVariableValue(name, tempValue, source)}
        placeholder={name}
        style={{
          width: `${inputWidth}px`,
          textOverflow: 'ellipsis',
        }}
      />
    </div>
  );
}
