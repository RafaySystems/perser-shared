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

import { zodResolver } from '@hookform/resolvers/zod';
import {
  DiscardChangesConfirmationDialog,
  FormActions,
  Action,
  getSubmitText,
  getTitleAction,
  TextField,
  Switch,
  Separator,
} from '@perses-dev/components';
import { DispatchWithoutAction, ReactElement, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useValidationSchemas } from '../../context';
import { PluginEditor } from '../PluginEditor';
import { DatasourceDefinition } from '../../model';

interface DatasourceEditorFormProps {
  initialDatasourceDefinition: DatasourceDefinition;
  action: Action;
  isDraft: boolean;
  isReadonly?: boolean;
  onActionChange?: (action: Action) => void;
  onSave: (def: DatasourceDefinition) => void;
  onClose: DispatchWithoutAction;
  onDelete?: DispatchWithoutAction;
}

export function DatasourceEditorForm(props: DatasourceEditorFormProps): ReactElement {
  const { initialDatasourceDefinition, action, isDraft, isReadonly, onActionChange, onSave, onClose, onDelete } = props;

  const [isDiscardDialogOpened, setDiscardDialogOpened] = useState<boolean>(false);
  const titleAction = getTitleAction(action, isDraft);
  const submitText = getSubmitText(action, isDraft);

  const { datasourceEditorSchema } = useValidationSchemas();
  const form = useForm<DatasourceDefinition>({
    resolver: zodResolver(datasourceEditorSchema),
    mode: 'onBlur',
    defaultValues: initialDatasourceDefinition,
  });

  /*
   * Remove empty fields that are optional
   */
  function clearFormData(data: DatasourceDefinition): DatasourceDefinition {
    const result = { ...data };
    if (result.spec.display?.name === undefined && result.spec.display?.description === undefined) {
      delete result.spec.display;
    }
    return result;
  }

  const processForm: SubmitHandler<DatasourceDefinition> = (data: DatasourceDefinition) => {
    onSave(clearFormData(data));
  };

  // When user click on cancel, several possibilities:
  // - create action: ask for discard approval
  // - update action: ask for discard approval if changed
  // - read action: don´t ask for discard approval
  function handleCancel(): void {
    if (JSON.stringify(initialDatasourceDefinition) !== JSON.stringify(clearFormData(form.getValues()))) {
      setDiscardDialogOpened(true);
    } else {
      onClose();
    }
  }

  return (
    <FormProvider {...form}>
      <div className="flex items-center px-4 py-2 border-b border-border">
        <h2 className="text-xl font-semibold">{titleAction} Datasource</h2>
        <FormActions
          action={action}
          submitText={submitText}
          isReadonly={isReadonly}
          isValid={form.formState.isValid}
          onActionChange={onActionChange}
          onSubmit={form.handleSubmit(processForm)}
          onDelete={onDelete}
          onCancel={handleCancel}
        />
      </div>
      <div className="p-4 overflow-y-scroll">
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Name"
                  disabled={action === 'update' && !isDraft}
                  readOnly={action === 'read'}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={field.value ?? ''}
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
          </div>
          <div className="col-span-8">
            <Controller
              control={form.control}
              name="spec.display.name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Display Label"
                  readOnly={action === 'read'}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={field.value ?? ''}
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
          </div>
          <div className="col-span-12">
            <Controller
              control={form.control}
              name="spec.display.description"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  readOnly={action === 'read'}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={field.value ?? ''}
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
          </div>
          <div className="col-span-6">
            <div className="flex flex-col gap-1">
              <Controller
                control={form.control}
                name="spec.default"
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={!!field.value}
                      disabled={action === 'read'}
                      onCheckedChange={(checked) => {
                        if (action === 'read') return;
                        field.onChange(checked);
                      }}
                    />
                    <span className="text-sm">Set as default</span>
                  </label>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Whether this datasource should be the default {form.getValues().spec.plugin.kind} to be used
              </p>
            </div>
          </div>
        </div>
        <Separator />
        <h3 className="text-base font-semibold py-2">Plugin Options</h3>
        <Controller
          control={form.control}
          name="spec.plugin"
          render={({ field }) => (
            <PluginEditor
              width="100%"
              pluginTypes={['Datasource']}
              pluginKindLabel="Source"
              withRunQueryButton={false}
              value={{
                selection: {
                  type: 'Datasource',
                  kind: field.value.kind,
                },
                spec: field.value.spec,
              }}
              isReadonly={action === 'read'}
              onChange={(v) => {
                field.onChange({ kind: v.selection.kind, spec: v.spec });
              }}
            />
          )}
        />
      </div>
      <DiscardChangesConfirmationDialog
        description="Are you sure you want to discard your changes? Changes cannot be recovered."
        isOpen={isDiscardDialogOpened}
        onCancel={() => setDiscardDialogOpened(false)}
        onDiscardChanges={() => {
          setDiscardDialogOpened(false);
          onClose();
        }}
      />
    </FormProvider>
  );
}
