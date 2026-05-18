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

import { ExternalLink as OpenInNewIcon } from 'lucide-react';
import { ChevronsUpDown } from 'lucide-react';
import {
  Button,
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Label,
} from '@perses-dev/components';
import { DatasourceSelector, VariableName } from '@perses-dev/spec';
import { ReactElement, useMemo, useState } from 'react';
import {
  DatasourceSelectItem,
  DatasourceSelectItemGroup,
  DatasourceSelectItemSelector,
  useListDatasourceSelectItems,
  useVariableValues,
  VariableStateMap,
} from '../../runtime';
import { parseVariables } from '../../utils';

const DATASOURCE_VARIABLE_VALUE_PREFIX = '__DATASOURCE_VARIABLE_VALUE__';
const VARIABLE_IDENTIFIER = '$';

type DataSourceOption = {
  groupEditLink?: string;
  groupLabel?: string;
  value: string;
} & Omit<DatasourceSelectItem, 'selector'> &
  Omit<DatasourceSelectItem['selector'], 'kind'>;

const emptyDatasourceOption: DataSourceOption = { name: '', value: '' };

export type DatasourceSelectValue<T = DatasourceSelector> = T | VariableName;

export interface DatasourceSelectProps {
  value: DatasourceSelectValue;
  onChange: (next: DatasourceSelectValue) => void;
  datasourcePluginKind: string;
  project?: string;
  readOnly?: boolean;
  label?: string;
}

/**
 * Displays an input for selecting a Datasource of a particular kind. Note: The 'value' and `onChange` handler for
 * the input deal with a `DatasourceSelector`.
 */
export function DatasourceSelect(props: DatasourceSelectProps): ReactElement {
  const { datasourcePluginKind, value, project, readOnly, onChange, label } = props;
  const { data, isLoading } = useListDatasourceSelectItems(datasourcePluginKind, project);
  const variables = useVariableValues();
  const [open, setOpen] = useState(false);

  const defaultValue = useMemo<VariableName | DatasourceSelectItemSelector>(() => {
    if (isVariableDatasource(value)) {
      return value;
    }

    const group = (data ?? [])
      .flatMap((itemGroup) => itemGroup.items)
      .find((item) => {
        return value.kind === item.selector.kind && value.name === item.selector.name && !item.overridden;
      })?.selector.group;
    return { ...value, group };
  }, [value, data]);

  const options = useMemo<DataSourceOption[]>(() => {
    const datasourceOptions = (data || []).flatMap<DataSourceOption>((itemGroup) =>
      itemGroup.items.map<DataSourceOption>((item) => ({
        groupLabel: itemGroup.group,
        groupEditLink: itemGroup.editLink,
        name: item.name,
        overriding: item.overriding,
        overridden: item.overridden,
        saved: item.saved ?? true,
        group: item.selector.group,
        value: selectorToOptionValue(item.selector),
      }))
    );

    const datasourceOptionsMap = new Map(datasourceOptions.map((option) => [option.name, option]));

    const variableOptions = Object.entries(variables).flatMap<DataSourceOption>(([name, variable]) => {
      if (Array.isArray(variable.value)) return [];

      const associatedDatasource = datasourceOptionsMap.get(variable.value ?? '');
      if (!associatedDatasource) return [];

      return {
        groupLabel: 'Variables',
        name: `${VARIABLE_IDENTIFIER}${name}`,
        saved: true,
        value: `${DATASOURCE_VARIABLE_VALUE_PREFIX}${VARIABLE_IDENTIFIER}${name}`,
      };
    });

    return [...datasourceOptions, ...variableOptions];
  }, [data, variables]);

  // While loading available values, just use an empty datasource option so we don't show stale selections
  const optionValue = isLoading
    ? emptyDatasourceOption
    : options.find((option) => option.value === selectorToOptionValue(defaultValue));

  // When the user makes a selection, convert the string option value back to a DatasourceSelector
  const handleSelect = (selectedValue: string): void => {
    const selectedOption = options.find((o) => o.value === selectedValue);
    if (selectedOption) {
      const next = optionValueToSelector(selectedOption.value);
      onChange(next);
    } else {
      onChange({ kind: datasourcePluginKind });
    }
    setOpen(false);
  };

  // Group options by groupLabel
  const groupedOptions = useMemo(() => {
    const groups: Record<string, DataSourceOption[]> = {};
    options.forEach((opt) => {
      const key = opt.groupLabel || 'No group';
      if (!groups[key]) groups[key] = [];
      groups[key]!.push(opt);
    });
    return groups;
  }, [options]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <Label>{label}</Label>}
      <Popover open={open && !readOnly} onOpenChange={(o) => !readOnly && setOpen(o)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
            disabled={isLoading || readOnly}
          >
            <span className="truncate">{optionValue?.name || (isLoading ? 'Loading...' : 'Select datasource...')}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search datasource..." />
            <CommandList>
              <CommandEmpty>No datasource found.</CommandEmpty>
              {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <CommandGroup key={groupName} heading={groupName}>
                  {groupOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                      className="flex items-center justify-between"
                    >
                      <DatasourceName
                        name={option.name}
                        overridden={option.overridden}
                        overriding={option.overriding}
                      />
                      <div className="flex items-center gap-1 ml-auto">
                        {!option.saved && (
                          <span className="text-xs text-muted-foreground">Save the dashboard to enable</span>
                        )}
                        {option.groupLabel && option.groupLabel.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {option.groupLabel}
                            {option.groupEditLink && (
                              <a
                                href={option.groupEditLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="ml-1 inline-flex items-center"
                              >
                                <OpenInNewIcon style={{ fontSize: 12 }} />
                              </a>
                            )}
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DatasourceName(props: { name: string; overridden?: boolean; overriding?: boolean }): ReactElement {
  const { name, overridden, overriding } = props;
  return (
    <>
      {`${name} `}
      {!overridden && overriding && (
        <span className="inline font-normal text-primary">(overriding)</span>
      )}
      {overridden && '(overridden)'}
    </>
  );
}

// Delimiter used to stringify/parse option values
const OPTION_VALUE_DELIMITER = '_____';

/**
 * Given a DatasourceSelectItemSelector,
 * returns a string value like `{kind}_____{group}_____{name}` that can be used as a Select input value.
 * @param selector
 */
export function selectorToOptionValue(selector: DatasourceSelectItemSelector | VariableName): string {
  if (isVariableDatasource(selector)) {
    return `${DATASOURCE_VARIABLE_VALUE_PREFIX}${selector}`;
  }
  return [selector.kind, selector.group ?? '', selector.name ?? ''].join(OPTION_VALUE_DELIMITER);
}

/**
 * Given an option value name like `{kind}_____{group}_____{name}`,
 * returns a DatasourceSelector to be used by the query data model.
 * @param optionValue
 */
export function optionValueToSelector(optionValue: string): DatasourceSelectValue {
  if (optionValue.startsWith(DATASOURCE_VARIABLE_VALUE_PREFIX)) {
    return optionValue.split(DATASOURCE_VARIABLE_VALUE_PREFIX)[1]!;
  }

  const words = optionValue.split(OPTION_VALUE_DELIMITER);
  const kind = words[0];
  const name = words[2];
  if (kind === undefined || name === undefined) {
    throw new Error('Invalid optionValue string');
  }
  return {
    kind,
    name: name === '' ? undefined : name,
  };
}

export function isVariableDatasource(value: DatasourceSelectValue | undefined): value is VariableName {
  return typeof value === 'string' && value.startsWith(VARIABLE_IDENTIFIER);
}

export const datasourceSelectValueToSelector = (
  value: DatasourceSelectValue | undefined,
  variables: VariableStateMap,
  datasourceSelectItemGroups: DatasourceSelectItemGroup[] | undefined
): DatasourceSelector | undefined => {
  if (!isVariableDatasource(value)) {
    return value;
  }

  const [variableName] = parseVariables(value);
  const variable = variables[variableName ?? ''];

  // If the variable is not defined or if its value is an array, we cannot determine a selector and return undefined
  if (!variable || Array.isArray(variable.value)) {
    return undefined;
  }

  const associatedDatasource = (datasourceSelectItemGroups || [])
    .flatMap((itemGroup) => itemGroup.items)
    .find((datasource) => datasource.name === variable.value);

  // If the variable value is not a datasource, we cannot determine a selector and return undefined
  if (associatedDatasource === undefined) {
    return undefined;
  }

  const datasourceSelector: DatasourceSelector = {
    kind: associatedDatasource.selector.kind,
    name: associatedDatasource.selector.name,
  };

  return datasourceSelector;
};

export const useDatasourceSelectValueToSelector = (
  value: DatasourceSelectValue,
  datasourcePluginKind: string
): DatasourceSelector => {
  const { data } = useListDatasourceSelectItems(datasourcePluginKind);
  const variables = useVariableValues();
  if (!isVariableDatasource(value)) {
    return value;
  }

  return datasourceSelectValueToSelector(value, variables, data) ?? { kind: datasourcePluginKind };
};
