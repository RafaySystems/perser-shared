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

import { ReactElement, useCallback, useEffect, useState } from 'react';
import { PanelDefinition, PanelEditorValues } from '@perses-dev/spec';
import {
  Button,
  DiscardChangesConfirmationDialog,
  ErrorAlert,
  ErrorBoundary,
  Action,
  getTitleAction,
  getSubmitText,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@perses-dev/components';
import { PluginKindSelect, usePluginEditor, useValidationSchemas } from '@perses-dev/plugin-system';
import { Controller, FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useListPanelGroups } from '../../context';
import { PanelEditorProvider } from '../../context/PanelEditorProvider/PanelEditorProvider';
import { usePanelEditor } from './usePanelEditor';
import { PanelQueriesSharedControls } from './PanelQueriesSharedControls';

export interface PanelEditorFormProps {
  initialValues: PanelEditorValues;
  initialAction: Action;
  panelKey?: string;
  onSave: (values: PanelEditorValues) => void;
  onClose: () => void;
}

export function PanelEditorForm(props: PanelEditorFormProps): ReactElement {
  const { initialValues, initialAction, panelKey, onSave, onClose } = props;
  const panelGroups = useListPanelGroups();
  const { panelDefinition, setName, setDescription, setLinks, setQueries, setPlugin, setPanelDefinition } =
    usePanelEditor(initialValues.panelDefinition);
  const { plugin } = panelDefinition.spec;
  const [isDiscardDialogOpened, setDiscardDialogOpened] = useState<boolean>(false);

  const { panelEditorSchema } = useValidationSchemas();
  const form = useForm<PanelEditorValues>({
    resolver: zodResolver(panelEditorSchema),
    mode: 'onBlur',
    defaultValues: initialValues,
  });

  // Use common plugin editor logic even though we've split the inputs up in this form
  const pluginEditor = usePluginEditor({
    pluginTypes: ['Panel'],
    value: { selection: { kind: plugin.kind, type: 'Panel' }, spec: plugin.spec },
    onChange: (plugin) => {
      form.setValue('panelDefinition.spec.plugin', { kind: plugin.selection.kind, spec: plugin.spec });
      setPlugin({
        kind: plugin.selection.kind,
        spec: plugin.spec,
      });
    },
    onHideQueryEditorChange: (isHidden) => {
      setQueries(undefined, isHidden);
    },
  });

  const titleAction = getTitleAction(initialAction, true);
  const submitText = getSubmitText(initialAction, true);

  const links = useWatch({ control: form.control, name: 'panelDefinition.spec.links' });
  useEffect(() => {
    setLinks(links);
  }, [setLinks, links]);

  const processForm: SubmitHandler<PanelEditorValues> = useCallback(
    (data) => {
      onSave(data);
    },
    [onSave]
  );

  // When user click on cancel, several possibilities:
  // - create action: ask for discard approval
  // - update action: ask for discard approval if changed
  // - read action: don´t ask for discard approval
  function handleCancel(): void {
    const currentValues = form.getValues();

    // Normalize display: if both name and description are undefined, set display to undefined
    const normalizeDisplay = (values: PanelEditorValues): PanelEditorValues => {
      if (
        values.panelDefinition.spec.display?.name === undefined &&
        values.panelDefinition.spec.display?.description === undefined
      ) {
        values.panelDefinition.spec.display = undefined;
      }
      return values;
    };

    const normalizedInitial = normalizeDisplay(JSON.parse(JSON.stringify(initialValues)));
    const normalizedCurrent = normalizeDisplay(JSON.parse(JSON.stringify(currentValues)));

    if (JSON.stringify(normalizedInitial) !== JSON.stringify(normalizedCurrent)) {
      setDiscardDialogOpened(true);
    } else {
      onClose();
    }
  }

  const handlePanelDefinitionChange = (nextPanelDefStr: string): void => {
    const nextPanelDef: PanelDefinition = JSON.parse(nextPanelDefStr);
    const { kind: pluginKind, spec: pluginSpec } = nextPanelDef.spec.plugin;
    // if panel plugin kind and spec are modified, then need to save current spec
    if (
      panelDefinition.spec.plugin.kind !== pluginKind &&
      JSON.stringify(panelDefinition.spec.plugin.spec) !== JSON.stringify(pluginSpec)
    ) {
      pluginEditor.rememberCurrentSpecState();
    }
    setPanelDefinition(nextPanelDef);
  };

  const watchedName = useWatch({ control: form.control, name: 'panelDefinition.spec.display.name' });
  const watchedDescription = useWatch({ control: form.control, name: 'panelDefinition.spec.display.description' });
  const watchedPluginKind = useWatch({ control: form.control, name: 'panelDefinition.spec.plugin.kind' });

  const handleSubmit = useCallback(() => {
    form.handleSubmit(processForm)();
  }, [form, processForm]);

  return (
    <FormProvider {...form}>
      <PanelEditorProvider>
        <div className="flex items-center px-4 py-2 border-b">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-base font-semibold">{titleAction} Panel</h2>
            {panelKey && <span className="text-sm text-muted-foreground">(ID: {panelKey})</span>}
          </div>
          <div className="flex flex-row gap-2 ml-auto">
            <Button variant="default" disabled={!form.formState.isValid} onClick={handleSubmit}>
              {submitText}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
        <div id={panelEditorFormId} className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <Controller
                control={form.control}
                name="panelDefinition.spec.display.name"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label htmlFor="panel-name">Name</Label>
                    <Input
                      {...field}
                      id="panel-name"
                      className={fieldState.error ? 'border-destructive' : ''}
                      value={watchedName ?? ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setName(event.target.value);
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="col-span-4">
              <Controller
                control={form.control}
                name="groupId"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label htmlFor="panel-group">
                      Group <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      required
                      value={field.value?.toString() ?? ''}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger id="panel-group" className={fieldState.error ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {panelGroups.map((panelGroup, index) => (
                          <SelectItem key={panelGroup.id} value={panelGroup.id?.toString() ?? ''}>
                            {panelGroup.title ?? `Group ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <p className="text-xs text-destructive">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="col-span-8">
              <Controller
                control={form.control}
                name="panelDefinition.spec.display.description"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label htmlFor="panel-description">Description</Label>
                    <Input
                      {...field}
                      id="panel-description"
                      className={fieldState.error ? 'border-destructive' : ''}
                      value={watchedDescription ?? ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setDescription(event.target.value);
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="col-span-4">
              <Controller
                control={form.control}
                name="panelDefinition.spec.plugin.kind"
                render={({ field, fieldState }) => (
                  <PluginKindSelect
                    {...field}
                    pluginTypes={['Panel']}
                    required
                    fullWidth
                    label="Type"
                    disabled={pluginEditor.isLoading}
                    error={!!pluginEditor.error || !!fieldState.error}
                    helperText={pluginEditor.error?.message ?? fieldState.error?.message}
                    value={{ type: 'Panel', kind: watchedPluginKind }}
                    onChange={(event) => {
                      field.onChange(event.kind);
                      pluginEditor.onSelectionChange(event);
                    }}
                  />
                )}
              />
            </div>

            <ErrorBoundary FallbackComponent={ErrorAlert}>
              <PanelQueriesSharedControls
                control={form.control}
                plugin={plugin}
                panelDefinition={panelDefinition}
                onQueriesChange={(q) => setQueries(q)}
                onPluginSpecChange={(spec) => {
                  pluginEditor.onSpecChange(spec);
                }}
                onJSONChange={handlePanelDefinitionChange}
              />
            </ErrorBoundary>
          </div>
        </div>
        <DiscardChangesConfirmationDialog
          description="You have unapplied changes in this panel. Are you sure you want to discard these changes? Changes cannot be recovered."
          isOpen={isDiscardDialogOpened}
          onCancel={() => {
            setDiscardDialogOpened(false);
          }}
          onDiscardChanges={() => {
            setDiscardDialogOpened(false);
            onClose();
          }}
        />
      </PanelEditorProvider>
    </FormProvider>
  );
}

/**
 * The `id` attribute added to the `PanelEditorForm` component, allowing submit buttons to live outside the form.
 */
export const panelEditorFormId = 'panel-editor-form';
