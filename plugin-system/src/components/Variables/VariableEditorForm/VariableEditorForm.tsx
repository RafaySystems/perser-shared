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

import { DispatchWithoutAction, ReactElement, useCallback, useState } from 'react';
import { VariableDefinition, ListVariableDefinition } from '@perses-dev/spec';

import {
  DiscardChangesConfirmationDialog,
  ErrorAlert,
  ErrorBoundary,
  FormActions,
  Action,
  getSubmitText,
  getTitleAction,
  TextField,
  Switch,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from '@perses-dev/components';
import { Control, Controller, FormProvider, SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { PluginEditor } from '../../PluginEditor';
import { useValidationSchemas } from '../../../context';
import { VARIABLE_TYPES } from '../variable-model';
import { VariableListPreview, VariablePreview } from './VariablePreview';
import { SORT_METHODS, SortMethodName } from './variable-editor-form-model';

function FallbackPreview(): ReactElement {
  return <div>Error previewing values</div>;
}

interface KindVariableEditorFormProps {
  action: Action;
  control: Control<VariableDefinition>;
}

function TextVariableEditorForm({ action, control }: KindVariableEditorFormProps): ReactElement {
  return (
    <>
      <p className="py-2 text-sm font-medium">Text Options</p>
      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="spec.value"
          render={({ field, fieldState }) => (
            <>
              <div>
                <VariablePreview values={[field.value]} />
              </div>
              <TextField
                {...field}
                label="Value"
                readOnly={action === 'read'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value ?? ''}
                onChange={(val) => {
                  field.onChange(val);
                }}
              />
            </>
          )}
        />
        <Controller
          control={control}
          name="spec.constant"
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
              <span className="text-sm">Constant</span>
            </label>
          )}
        />
      </div>
    </>
  );
}

function ListVariableEditorForm({ action, control }: KindVariableEditorFormProps): ReactElement {
  const form = useFormContext<VariableDefinition>();
  const queryClient = useQueryClient();

  const values = form.getValues() as ListVariableDefinition;
  /* We use `previewDefinition` to explicitly update the spec
   * that will be used for preview when running query. The reason why we do this is to avoid
   * having to re-fetch the values when the user is still editing the spec.
   * Using structuredClone to not have reference issues with nested objects.
   */
  const [previewDefinition, setPreviewDefinition] = useState(structuredClone(values));

  const handleRunQuery = useCallback(async () => {
    if (JSON.stringify(previewDefinition) === JSON.stringify(values)) {
      await queryClient.invalidateQueries({ queryKey: ['variable', previewDefinition] });
    } else {
      setPreviewDefinition(structuredClone(values));
    }
  }, [previewDefinition, queryClient, values]);

  const plugin = useWatch<VariableDefinition, 'spec.plugin'>({ control, name: 'spec.plugin' });
  const kind = plugin?.kind;
  const pluginSpec = plugin?.spec;

  const _allowAllValue = useWatch<VariableDefinition, 'spec.allowAllValue'>({
    control: control,
    name: 'spec.allowAllValue',
  });

  const _customAllValue = useWatch<VariableDefinition, 'spec.customAllValue'>({
    control: control,
    name: 'spec.customAllValue',
  });

  const sortMethod = useWatch<VariableDefinition, 'spec.sort'>({
    control: control,
    name: 'spec.sort',
  }) as SortMethodName;

  // When variable kind is selected we need to provide default values
  // TODO: check if react-hook-form has a better way to do this
  if (values.spec.allowAllValue === undefined) {
    form.setValue('spec.allowAllValue', false);
  }

  if (values.spec.allowMultiple === undefined) {
    form.setValue('spec.allowMultiple', false);
  }

  if (!values.spec.plugin) {
    form.setValue('spec.plugin', { kind: 'StaticListVariable', spec: {} });
  }

  if (!values.spec.sort) {
    form.setValue('spec.sort', 'none');
  }

  return (
    <>
      <p className="py-2 text-sm font-medium">List Options</p>
      <div className="flex flex-col gap-4 mb-4">
        <div>
          <ErrorBoundary FallbackComponent={FallbackPreview} resetKeys={[previewDefinition]}>
            <VariableListPreview sortMethod={sortMethod} definition={previewDefinition} />
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary FallbackComponent={ErrorAlert}>
            <Controller
              control={control}
              name="spec.plugin"
              render={({ field }) => {
                return (
                  <PluginEditor
                    withRunQueryButton
                    width="100%"
                    pluginTypes={['Variable']}
                    pluginKindLabel="Source"
                    value={{
                      selection: {
                        type: 'Variable',
                        kind: kind ?? 'StaticListVariable',
                      },
                      spec: pluginSpec ?? {},
                    }}
                    isReadonly={action === 'read'}
                    onChange={(v) => {
                      field.onChange({ kind: v.selection.kind, spec: v.spec });
                    }}
                    onRunQuery={handleRunQuery}
                  />
                );
              }}
            />
          </ErrorBoundary>
        </div>

        <div>
          <Controller
            control={control}
            name="spec.capturingRegexp"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Capturing Regexp Filter"
                readOnly={action === 'read'}
                error={!!fieldState.error}
                value={field.value ?? ''}
                onChange={(val) => {
                  if (val === '') {
                    field.onChange(undefined);
                  } else {
                    field.onChange(val);
                  }
                }}
                helperText={
                  fieldState.error?.message
                    ? fieldState.error.message
                    : 'Optional, if you want to filter on captured result.'
                }
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="spec.sort"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <Label>Sort</Label>
                <Select
                  value={field.value ?? 'none'}
                  onValueChange={(val) => field.onChange(val)}
                  disabled={action === 'read'}
                >
                  <SelectTrigger className={fieldState.error ? 'border-destructive' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SORT_METHODS).map((key) => {
                      if (!SORT_METHODS[key as SortMethodName]) return null;
                      const { label } = SORT_METHODS[key as SortMethodName];
                      return (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {fieldState.error?.message && (
                  <p className="text-xs text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <Separator />

      <p className="py-2 text-sm font-medium">Dropdown Options</p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Controller
            control={control}
            name="spec.allowMultiple"
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
                <span className="text-sm">Allow Multiple Values</span>
              </label>
            )}
          />
          <p className="text-xs text-muted-foreground">Enables multiple values to be selected at the same time</p>
        </div>
        <div className="flex flex-col gap-1">
          <Controller
            control={control}
            name="spec.allowAllValue"
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
                <span className="text-sm">Allow All option</span>
              </label>
            )}
          />
          <p className="text-xs text-muted-foreground mb-2">
            Enables an option to include all variable values
          </p>
          {_allowAllValue && (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={_customAllValue !== undefined}
                  disabled={action === 'read'}
                  onCheckedChange={(checked) => {
                    if (action === 'read') return;
                    if (checked) {
                      form.setValue('spec.customAllValue', '');
                    } else {
                      form.setValue('spec.customAllValue', undefined);
                    }
                  }}
                />
                <span className="text-sm">Use Custom All Value</span>
              </label>
              <p className="text-xs text-muted-foreground -mt-1">
                Enable to set a custom value when &quot;All&quot; is selected
              </p>
              {_customAllValue !== undefined && (
                <Controller
                  control={control}
                  name="spec.customAllValue"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Custom All Value"
                      readOnly={action === 'read'}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      value={field.value ?? ''}
                      onChange={(val) => {
                        field.onChange(val || '');
                      }}
                    />
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface VariableEditorFormProps {
  initialVariableDefinition: VariableDefinition;
  action: Action;
  isDraft: boolean;
  isReadonly?: boolean;
  onActionChange?: (action: Action) => void;
  onSave: (def: VariableDefinition) => void;
  onClose: () => void;
  onDelete?: DispatchWithoutAction;
}

export function VariableEditorForm({
  initialVariableDefinition,
  action,
  isDraft,
  isReadonly,
  onActionChange,
  onSave,
  onClose,
  onDelete,
}: VariableEditorFormProps): ReactElement {
  const [isDiscardDialogOpened, setDiscardDialogOpened] = useState<boolean>(false);
  const titleAction = getTitleAction(action, isDraft);
  const submitText = getSubmitText(action, isDraft);

  const { variableEditorSchema } = useValidationSchemas();
  const form = useForm<VariableDefinition>({
    resolver: zodResolver(variableEditorSchema),
    mode: 'onBlur',
    defaultValues: initialVariableDefinition,
  });

  const kind = useWatch({ control: form.control, name: 'kind' });

  function clearFormData(data: VariableDefinition): VariableDefinition {
    const result = { ...data };
    if (
      result.spec.display?.name === undefined &&
      result.spec.display?.description === undefined &&
      result.spec.display?.hidden === undefined
    ) {
      delete result.spec.display;
    }
    return result;
  }

  const processForm: SubmitHandler<VariableDefinition> = (data: VariableDefinition) => {
    // reset display attributes to undefined when empty, because we don't want to save empty strings
    onSave(clearFormData(data));
  };

  // When user click on cancel, several possibilities:
  // - create action: ask for discard approval
  // - update action: ask for discard approval if changed
  // - read action: don´t ask for discard approval
  function handleCancel(): void {
    if (JSON.stringify(initialVariableDefinition) !== JSON.stringify(clearFormData(form.getValues()))) {
      setDiscardDialogOpened(true);
    } else {
      onClose();
    }
  }

  return (
    <FormProvider {...form}>
      <div className="flex items-center px-4 py-2 border-b border-border">
        <h2 className="text-xl font-semibold">{titleAction} Variable</h2>
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
          <div className="col-span-8">
            <Controller
              control={form.control}
              name="spec.name"
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
          <div className="col-span-4">
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
          <div className="col-span-8">
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
          <div className="col-span-4">
            <Controller
              control={form.control}
              name="kind"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Type</Label>
                  <Select
                    value={field.value ?? 'TextVariable'}
                    onValueChange={(val) => field.onChange(val)}
                    disabled={action === 'read'}
                  >
                    <SelectTrigger className={fieldState.error ? 'border-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VARIABLE_TYPES.map((v) => (
                        <SelectItem key={v.kind} value={v.kind}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error?.message && (
                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <Separator />

        {kind === 'TextVariable' && (
          <ErrorBoundary FallbackComponent={ErrorAlert}>
            <TextVariableEditorForm action={action} control={form.control} />
          </ErrorBoundary>
        )}
        {kind === 'ListVariable' && (
          <ErrorBoundary FallbackComponent={ErrorAlert}>
            <ListVariableEditorForm action={action} control={form.control} />
          </ErrorBoundary>
        )}
      </div>
      <DiscardChangesConfirmationDialog
        description="Are you sure you want to discard these changes? Changes cannot be recovered."
        isOpen={isDiscardDialogOpened}
        onCancel={() => {
          setDiscardDialogOpened(false);
        }}
        onDiscardChanges={() => {
          setDiscardDialogOpened(false);
          onClose();
        }}
      />
    </FormProvider>
  );
}
