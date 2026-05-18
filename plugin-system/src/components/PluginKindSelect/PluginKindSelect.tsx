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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from '@perses-dev/components';
import { forwardRef, ReactElement, useCallback, useMemo, HTMLAttributes } from 'react';
import { PluginType } from '../../model';
import { useListPluginMetadata } from '../../runtime';
import { PluginEditorSelection } from '../PluginEditor';

export interface PluginKindSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange' | 'children'> {
  filteredQueryPlugins?: string[];
  pluginTypes: PluginType[];
  value?: PluginEditorSelection;
  onChange?: (s: PluginEditorSelection) => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  margin?: string;
  sx?: Record<string, unknown>;
  slotProps?: { input?: { readOnly?: boolean } };
}

/**
 * Displays a Select input for selecting a plugin's kind from a list of all the available plugins of some specific
 * plugin types. (e.g. "Show a list of all the Panel plugins", or "Show a list of all the Variable plugins", or "Show
 * a list of all the TimeSeriesQuery, TraceQuery, ProfileQuery, and LogQuery plugins").
 * The value of the select is the kind of the plugin, but you can also listen to the `onPluginTypeChange` event to know
 * when the user changes the plugin type (it fires at start for the default value.)
 */
export const PluginKindSelect = forwardRef((props: PluginKindSelectProps, _ref): ReactElement => {
  const {
    pluginTypes,
    value: propValue,
    onChange,
    filteredQueryPlugins,
    label,
    disabled,
    error,
    helperText,
    fullWidth,
    slotProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    margin: _margin,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sx: _sx,
    ...others
  } = props;
  const { data, isLoading } = useListPluginMetadata(pluginTypes);
  const isReadonly = slotProps?.input?.readOnly ?? false;

  const sortedData = useMemo(() => {
    if (filteredQueryPlugins?.length) {
      return data
        ?.filter((i) => filteredQueryPlugins.includes(i.spec.name))
        ?.sort((a, b) => a.spec.display.name.localeCompare(b.spec.display.name));
    }

    return data?.sort((a, b) => a.spec.display.name.localeCompare(b.spec.display.name));
  }, [data, filteredQueryPlugins]);

  // Pass an empty value while options are still loading so the select doesn't complain about an "out of range" value
  const value = !propValue || isLoading ? '' : selectionToOptionValue(propValue);

  const handleChange = useCallback(
    (val: string) => {
      if (val) {
        onChange?.(optionValueToSelection(val));
      }
    },
    [onChange]
  );

  const displayValue = sortedData?.find((v) => {
    const sel = propValue;
    return sel && v.kind === sel.type && v.spec.name === sel.kind;
  })?.spec.display.name;

  return (
    <div
      className={fullWidth ? 'w-full flex flex-col gap-1' : 'flex flex-col gap-1 min-w-[120px]'}
      {...others}
      data-testid="plugin-kind-select"
    >
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={handleChange} disabled={disabled || isReadonly}>
        <SelectTrigger className={error ? 'border-destructive' : ''} aria-label={displayValue ?? value}>
          <SelectValue placeholder={isLoading ? 'Loading...' : ''}>
            {displayValue ?? (value ? value : undefined)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {isLoading && (
            <SelectItem value="" disabled>
              Loading...
            </SelectItem>
          )}
          {sortedData?.map((metadata) => (
            <SelectItem
              data-testid="option"
              key={metadata.kind + metadata.spec.name}
              value={selectionToOptionValue({ type: metadata.kind, kind: metadata.spec.name })}
            >
              {metadata.spec.display.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className={`text-xs ${error ? 'text-destructive' : 'text-muted-foreground'}`}>{helperText}</p>
      )}
    </div>
  );
});
PluginKindSelect.displayName = 'PluginKindSelect';

// Delimiter used to stringify/parse option values
const OPTION_VALUE_DELIMITER = '_____';

/**
 * Given a PluginEditorSelection,
 * returns a string value like `{type}_____{kind}` that can be used as a Select input value.
 * @param selector
 */
function selectionToOptionValue(selector: PluginEditorSelection): string {
  return [selector.type, selector.kind].join(OPTION_VALUE_DELIMITER);
}

/**
 * Given an option value name like `{type}_____{kind}`,
 * returns a PluginEditorSelection to be used by the query data model.
 * @param optionValue
 */
function optionValueToSelection(optionValue: string): PluginEditorSelection {
  const words = optionValue.split(OPTION_VALUE_DELIMITER);
  const type = words[0] as PluginType | undefined;
  const kind = words[1];
  if (type === undefined || kind === undefined) {
    throw new Error('Invalid optionValue string');
  }
  return {
    type,
    kind,
  };
}
