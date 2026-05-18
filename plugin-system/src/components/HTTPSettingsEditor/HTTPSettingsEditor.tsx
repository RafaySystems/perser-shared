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

import { RequestHeaders, HTTPDatasourceSpec } from '@perses-dev/core'; // TODO this is the proxy definition that should go to a different lib
import {
  Button,
  TextField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from '@perses-dev/components';
import React, { Fragment, ReactElement, useState } from 'react';
import { produce } from 'immer';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { Minus as MinusIcon, Plus as PlusIcon } from 'lucide-react';
import { OptionsEditorRadios } from '../OptionsEditorRadios';

type HeaderEntry = {
  name: string;
  value: string;
};

type HeaderFormValues = {
  headers: HeaderEntry[];
};

export interface HTTPSettingsEditor {
  value: HTTPDatasourceSpec;
  onChange: (next: HTTPDatasourceSpec) => void;
  isReadonly?: boolean;
  initialSpecDirect: HTTPDatasourceSpec;
  initialSpecProxy: HTTPDatasourceSpec;
}

export function HTTPSettingsEditor(props: HTTPSettingsEditor): ReactElement {
  const { value, onChange, isReadonly, initialSpecDirect, initialSpecProxy } = props;
  const strDirect = 'Direct access';
  const strProxy = 'Proxy';

  // Initialize Proxy mode by default, if neither direct nor proxy mode is selected.
  if (value.directUrl === undefined && value.proxy === undefined) {
    Object.assign(value, initialSpecProxy);
  }

  // Use local state to maintain an array of header entries during editing, instead of
  // manipulating a map directly which causes weird UX.
  const headersForm = useForm<HeaderFormValues>({
    defaultValues: {
      headers: Object.entries(value.proxy?.spec.headers ?? {}).map(([name, headerValue]) => ({
        name,
        value: headerValue as string,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: headersForm.control,
    name: 'headers',
  });

  // Watch the headers array for changes to detect duplicates
  const watchedHeaders = headersForm.watch('headers');

  // Check for duplicate header names
  // TODO: duplication detection logic to be replaced by proper zod schema validation in the future
  // ref https://github.com/perses/perses/issues/3014
  const nameMap = new Map<string, number>();
  const duplicateNames = new Set<string>();
  watchedHeaders.forEach(({ name }) => {
    if (name !== '') {
      const count = (nameMap.get(name) || 0) + 1;
      nameMap.set(name, count);
      if (count > 1) {
        duplicateNames.add(name);
      }
    }
  });
  const hasDuplicates = duplicateNames.size > 0;

  // Sync headers to parent
  const syncHeadersToParent = (headers: HeaderEntry[]): void => {
    const headersObject: RequestHeaders = {};
    headers.forEach(({ name, value: headerValue }) => {
      if (name !== '') {
        headersObject[name] = headerValue;
      }
    });

    onChange(
      produce(value, (draft) => {
        if (draft.proxy !== undefined) {
          draft.proxy.spec.headers = Object.keys(headersObject).length > 0 ? headersObject : undefined;
        }
      })
    );
  };

  const tabs = [
    {
      label: strProxy,
      content: (
        <>
          <Controller
            name="URL"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="URL"
                value={value.proxy?.spec.url || ''}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                readOnly={isReadonly}
                onChange={(val) => {
                  field.onChange(val);
                  onChange(
                    produce(value, (draft) => {
                      if (draft.proxy !== undefined) {
                        draft.proxy.spec.url = val;
                      }
                    })
                  );
                }}
                className="mb-4"
              />
            )}
          />
          <h5 className="text-sm font-semibold mb-4">Allowed endpoints</h5>
          <div className="grid grid-cols-12 gap-4 mb-4">
            {value.proxy?.spec.allowedEndpoints && value.proxy?.spec.allowedEndpoints.length !== 0 ? (
              value.proxy.spec.allowedEndpoints.map(({ endpointPattern, method }, i) => {
                return (
                  <Fragment key={i}>
                    <div className="col-span-8">
                      <Controller
                        name={`Endpoint pattern ${i}`}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Endpoint pattern"
                            value={endpointPattern}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            readOnly={isReadonly}
                            onChange={(val) => {
                              field.onChange(val);
                              onChange(
                                produce(value, (draft) => {
                                  if (draft.proxy !== undefined) {
                                    draft.proxy.spec.allowedEndpoints = draft.proxy.spec.allowedEndpoints?.map(
                                      (item, itemIndex) => {
                                        if (i === itemIndex) {
                                          return {
                                            endpointPattern: val,
                                            method: item.method,
                                          };
                                        } else {
                                          return item;
                                        }
                                      }
                                    );
                                  }
                                })
                              );
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <Controller
                        name={`Method ${i}`}
                        render={({ field, fieldState }) => (
                          <div className="flex flex-col gap-1.5">
                            <Label>Method</Label>
                            <Select
                              value={method}
                              onValueChange={(val) => {
                                field.onChange(val);
                                onChange(
                                  produce(value, (draft) => {
                                    if (draft.proxy !== undefined) {
                                      draft.proxy.spec.allowedEndpoints = draft.proxy.spec.allowedEndpoints?.map(
                                        (item, itemIndex) => {
                                          if (i === itemIndex) {
                                            return {
                                              endpointPattern: item.endpointPattern,
                                              method: val,
                                            };
                                          } else {
                                            return item;
                                          }
                                        }
                                      );
                                    }
                                  })
                                );
                              }}
                              disabled={isReadonly}
                            >
                              <SelectTrigger className={fieldState.error ? 'border-destructive' : ''}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="PATCH">PATCH</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error?.message && (
                              <p className="text-xs text-destructive">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <Controller
                        name={`Remove Endpoint ${i}`}
                        render={({ field }) => (
                          <Button
                            {...field}
                            variant="ghost"
                            size="icon"
                            disabled={isReadonly}
                            // Remove the given allowed endpoint from the list
                            onClick={(e) => {
                              field.onChange(e);
                              onChange(
                                produce(value, (draft) => {
                                  if (draft.proxy !== undefined) {
                                    draft.proxy.spec.allowedEndpoints = [
                                      ...(draft.proxy.spec.allowedEndpoints?.filter((item, itemIndex) => {
                                        return itemIndex !== i;
                                      }) || []),
                                    ];
                                  }
                                })
                              );
                            }}
                          >
                            <MinusIcon />
                          </Button>
                        )}
                      />
                    </div>
                  </Fragment>
                );
              })
            ) : (
              <div className="col-span-4">
                <p className="italic text-sm text-muted-foreground">None</p>
              </div>
            )}
            <div className="col-span-12 pt-0 pl-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={isReadonly}
                // Add a new (empty) allowed endpoint to the list
                onClick={() =>
                  onChange(
                    produce(value, (draft) => {
                      if (draft.proxy !== undefined) {
                        draft.proxy.spec.allowedEndpoints = [
                          ...(draft.proxy.spec.allowedEndpoints ?? []),
                          { endpointPattern: '', method: '' },
                        ];
                      }
                    })
                  )
                }
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
          <h5 className="text-sm font-semibold mb-4">Request Headers</h5>
          <div className="grid grid-cols-12 gap-4 mb-4">
            {fields.length > 0 ? (
              fields.map((field, index) => (
                <Fragment key={field.id}>
                  <div className="col-span-4">
                    <Controller
                      control={headersForm.control}
                      name={`headers.${index}.name`}
                      render={({ field: controllerField, fieldState }) => (
                        <TextField
                          {...controllerField}
                          fullWidth
                          label="Header name"
                          error={!!fieldState.error || duplicateNames.has(controllerField.value as string)}
                          helperText={fieldState.error?.message}
                          readOnly={isReadonly}
                          onChange={(val) => {
                            controllerField.onChange(val);
                            const updatedHeaders = [...watchedHeaders];
                            updatedHeaders[index] = { name: val, value: updatedHeaders[index]?.value ?? '' };
                            syncHeadersToParent(updatedHeaders);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-7">
                    <Controller
                      control={headersForm.control}
                      name={`headers.${index}.value`}
                      render={({ field: controllerField, fieldState }) => (
                        <TextField
                          {...controllerField}
                          fullWidth
                          label="Header value"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          readOnly={isReadonly}
                          onChange={(val) => {
                            controllerField.onChange(val);
                            const updatedHeaders = [...watchedHeaders];
                            updatedHeaders[index] = { name: updatedHeaders[index]?.name ?? '', value: val };
                            syncHeadersToParent(updatedHeaders);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isReadonly}
                      aria-label={`Remove header ${watchedHeaders[index]?.name || index}`}
                      onClick={() => {
                        remove(index);
                        const updatedHeaders = watchedHeaders.filter((_, i) => i !== index);
                        syncHeadersToParent(updatedHeaders);
                      }}
                    >
                      <MinusIcon />
                    </Button>
                  </div>
                </Fragment>
              ))
            ) : (
              <div className="col-span-4">
                <p className="italic text-sm text-muted-foreground">None</p>
              </div>
            )}
            {hasDuplicates && (
              <div className="col-span-12">
                <p className="text-sm text-destructive">
                  Duplicate header names detected. Each header name must be unique.
                </p>
              </div>
            )}
            <div className="col-span-12 pt-0 pl-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={isReadonly}
                onClick={() => append({ name: '', value: '' })}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>

          <Controller
            name="Secret"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Secret"
                value={value.proxy?.spec.secret || ''}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                readOnly={isReadonly}
                onChange={(val) => {
                  field.onChange(val);
                  onChange(
                    produce(value, (draft) => {
                      if (draft.proxy !== undefined) {
                        draft.proxy.spec.secret = val;
                      }
                    })
                  );
                }}
              />
            )}
          />
        </>
      ),
    },
    {
      label: strDirect,
      content: (
        <Controller
          name="URL"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label="URL"
              value={value.directUrl || ''}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              readOnly={isReadonly}
              onChange={(val) => {
                field.onChange(val);
                onChange(
                  produce(value, (draft) => {
                    draft.directUrl = val;
                  })
                );
              }}
            />
          )}
        />
      ),
    },
  ];

  // Use of findIndex instead of providing hardcoded values to avoid desynchronisatio or
  // bug in case the tabs get eventually swapped in the future.
  const directModeId = tabs.findIndex((tab) => tab.label === strDirect);
  const proxyModeId = tabs.findIndex((tab) => tab.label === strProxy);

  // Set defaultTab to the mode that this datasource is currently relying on.
  const defaultTab = value.proxy ? proxyModeId : directModeId;

  // For better user experience, save previous states in mind for both mode.
  // This avoids losing everything when the user changes their mind back.
  const [previousSpecDirect, setPreviousSpecDirect] = useState(initialSpecDirect);
  const [previousSpecProxy, setPreviousSpecProxy] = useState(initialSpecProxy);

  // When changing mode, remove previous mode's config + append default values for the new mode.
  const handleModeChange = (v: number): void => {
    if (tabs[v]?.label === strDirect) {
      setPreviousSpecProxy(value);

      // Copy all settings (for example, scrapeInterval), except 'proxy'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { proxy, ...newValue } = value;
      onChange({ ...newValue, directUrl: previousSpecDirect.directUrl });
    } else if (tabs[v]?.label === strProxy) {
      setPreviousSpecDirect(value);

      // Copy all settings (for example, scrapeInterval), except 'directUrl'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { directUrl, ...newValue } = value;
      onChange({ ...newValue, proxy: previousSpecProxy.proxy });
    }
  };

  return (
    <>
      <h4 className="text-sm font-semibold mt-4">HTTP Settings</h4>
      <OptionsEditorRadios
        isReadonly={isReadonly}
        tabs={tabs}
        defaultTab={defaultTab}
        onModeChange={handleModeChange}
      />
    </>
  );
}
