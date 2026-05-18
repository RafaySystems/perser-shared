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

import React, { ReactElement, useMemo, useState } from 'react';
import { Alert, AlertDescription, Card, Badge, Spinner, Button, InfoTooltip, useSnackbar } from '@perses-dev/components';
import { Clipboard } from 'lucide-react';
import { ListVariableDefinition } from '@perses-dev/spec';
import { TOOLTIP_TEXT } from '../../../constants';
import { useListVariablePluginValues } from '../variable-model';
import { SORT_METHODS } from './variable-editor-form-model';

const DEFAULT_MAX_PREVIEW_VALUES = 50;

interface VariablePreviewProps {
  values?: string[];
  isLoading?: boolean;
  error?: string;
}

export function VariablePreview(props: VariablePreviewProps): ReactElement {
  const { values, isLoading, error } = props;
  const [maxValues, setMaxValues] = useState<number | undefined>(DEFAULT_MAX_PREVIEW_VALUES);
  const { infoSnackbar } = useSnackbar();
  const showAll = (): void => {
    setMaxValues(undefined);
  };
  let notShown = 0;

  if (values && values?.length > 0 && maxValues) {
    notShown = values.length - maxValues;
  }

  const variablePreviewState = useMemo((): ReactElement | null => {
    if (isLoading) {
      return (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
      );
    } else if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    } else if (!values?.length) {
      return (
        <Alert>
          <AlertDescription>No results</AlertDescription>
        </Alert>
      );
    }
    return null;
  }, [error, isLoading, values]);

  return (
    <div>
      <div className="flex flex-row gap-1 items-center mb-1">
        <h4 className="text-sm font-semibold">Preview Values</h4>
        <InfoTooltip description={TOOLTIP_TEXT.copyVariableValues}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={async () => {
              if (values?.length) {
                await navigator.clipboard.writeText(values.map((value) => value).join(', '));
                infoSnackbar('Preview values copied to clipboard!');
              }
            }}
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        </InfoTooltip>
      </div>
      <Card className="border">
        <div className="flex flex-wrap gap-1 m-2">
          {variablePreviewState}
          {values
            ?.slice(0, maxValues)
            .filter((val) => val)
            .map((val, index) => (
              <Badge variant="secondary" key={index}>
                {val}
              </Badge>
            ))}
          {notShown > 0 && (
            <Badge
              variant="outline"
              className="cursor-pointer"
              onClick={showAll}
            >
              +{notShown} more
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
}

interface VariableListPreviewProps {
  definition: ListVariableDefinition;
  sortMethod?: keyof typeof SORT_METHODS;
}

export function VariableListPreview(props: VariableListPreviewProps): ReactElement {
  const { definition, sortMethod } = props;
  const { data, isFetching, error } = useListVariablePluginValues(definition);
  const errorMessage = (error as Error)?.message;

  const result = !sortMethod || sortMethod === 'none' || !data ? data : SORT_METHODS[sortMethod].sort(data);

  const variablePreview = useMemo(
    () => (
      <VariablePreview
        values={result?.map((val) => val.label || val.value)}
        isLoading={isFetching}
        error={errorMessage}
      />
    ),
    [errorMessage, isFetching, result]
  );

  return variablePreview;
}
