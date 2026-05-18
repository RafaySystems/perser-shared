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

import { ReactElement, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  Button,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@perses-dev/components';
import { Plus as AddIcon, Pencil as PencilIcon, Copy as CloneIcon, Trash2 as TrashIcon, ArrowUp, ArrowDown, CopyPlus as ContentDuplicate, ExternalLink as OpenInNewIcon, ChevronUp as ExpandMoreIcon } from 'lucide-react';
import { BuiltinVariableDefinition, VariableDefinition } from '@perses-dev/spec';
import { useImmer } from 'use-immer';
import {
  ValidationProvider,
  VARIABLE_TYPES,
  VariableEditorForm,
  VariableState,
  useResolveListVariableValues,
} from '@perses-dev/plugin-system';
import { InfoTooltip, Action } from '@perses-dev/components';
import { ExternalVariableDefinition } from '../../model/VariableDefinition';
import { useDiscardChangesConfirmationDialog, VariableProvider } from '../../context';
import { hydrateVariableDefinitionStates } from '../../context/VariableProvider/hydrationUtils';
import { BuiltinVariableAccordions } from './BuiltinVariableAccordions';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getVariableLabelByKind(kind: string): 'List' | 'Text' | undefined {
  return VARIABLE_TYPES.find((variableType) => variableType.kind === kind)?.label;
}

function getValidation(variableDefinitions: VariableDefinition[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  /**  Variable names must be unique */
  const variableNames = variableDefinitions.map((variableDefinition) => variableDefinition.spec.name);
  const uniqueVariableNames = new Set(variableNames);
  if (variableNames.length !== uniqueVariableNames.size) {
    errors.push('Variable names must be unique');
  }
  return {
    errors: errors,
    isValid: errors.length === 0,
  };
}

export function VariableEditor(props: {
  variableDefinitions: VariableDefinition[];
  externalVariableDefinitions: ExternalVariableDefinition[];
  builtinVariableDefinitions: BuiltinVariableDefinition[];
  onChange: (variableDefinitions: VariableDefinition[]) => void;
  onCancel: () => void;
}): ReactElement {
  const [variableDefinitions, setVariableDefinitions] = useImmer(props.variableDefinitions);
  const [variableEditIdx, setVariableEditIdx] = useState<number | null>(null);
  const [variableFormAction, setVariableFormAction] = useState<Action>('update');

  const externalVariableDefinitions = props.externalVariableDefinitions;
  const builtinVariableDefinitions = props.builtinVariableDefinitions;
  const validation = useMemo(() => getValidation(variableDefinitions), [variableDefinitions]);
  const [variableState] = useMemo(() => {
    return [hydrateVariableDefinitionStates(variableDefinitions, {}, externalVariableDefinitions)];
  }, [externalVariableDefinitions, variableDefinitions]);
  const currentEditingVariableDefinition = typeof variableEditIdx === 'number' && variableDefinitions[variableEditIdx];

  const { openDiscardChangesConfirmationDialog, closeDiscardChangesConfirmationDialog } =
    useDiscardChangesConfirmationDialog();
  const handleCancel = (): void => {
    if (JSON.stringify(props.variableDefinitions) !== JSON.stringify(variableDefinitions)) {
      openDiscardChangesConfirmationDialog({
        onDiscardChanges: () => {
          closeDiscardChangesConfirmationDialog();
          props.onCancel();
        },
        onCancel: () => {
          closeDiscardChangesConfirmationDialog();
        },
        description:
          'You have unapplied changes. Are you sure you want to discard these changes? Changes cannot be recovered.',
      });
    } else {
      props.onCancel();
    }
  };

  const removeVariable = (index: number): void => {
    setVariableDefinitions((draft) => {
      draft.splice(index, 1);
    });
  };

  const addVariable = (): void => {
    setVariableFormAction('create');
    setVariableDefinitions((draft) => {
      draft.push({
        kind: 'TextVariable',
        spec: {
          name: 'NewVariable',
          value: '',
        },
      });
    });
    setVariableEditIdx(variableDefinitions.length);
  };

  const editVariable = (index: number): void => {
    setVariableFormAction('update');
    setVariableEditIdx(index);
  };

  const toggleVariableVisibility = (index: number, visible: boolean): void => {
    setVariableDefinitions((draft) => {
      const v = draft[index];
      if (!v) {
        return;
      }
      if (!v.spec.display) {
        v.spec.display = {
          name: v.spec.name,
          hidden: false,
        };
      }
      v.spec.display.hidden = visible === false;
    });
  };

  const changeVariableOrder = (index: number, direction: 'up' | 'down'): void => {
    setVariableDefinitions((draft) => {
      if (direction === 'up') {
        const prevElement = draft[index - 1];
        const currentElement = draft[index];
        if (index === 0 || !prevElement || !currentElement) {
          return;
        }
        draft[index - 1] = currentElement;
        draft[index] = prevElement;
      } else {
        const nextElement = draft[index + 1];
        const currentElement = draft[index];
        if (index === draft.length - 1 || !nextElement || !currentElement) {
          return;
        }
        draft[index + 1] = currentElement;
        draft[index] = nextElement;
      }
    });
  };

  const overrideVariable = (v: VariableDefinition): void => {
    setVariableDefinitions((draft) => {
      draft.push(v);
    });
  };

  return (
    <>
      {currentEditingVariableDefinition && (
        <VariableEditorFormWithContext
          variableDefinitions={variableDefinitions}
          externalVariableDefinitions={externalVariableDefinitions}
          builtinVariableDefinitions={builtinVariableDefinitions}
          currentEditingVariableDefinition={currentEditingVariableDefinition}
          variableFormAction={variableFormAction}
          onActionChange={setVariableFormAction}
          onSave={(definition: VariableDefinition) => {
            setVariableDefinitions((draft) => {
              draft[variableEditIdx] = definition;
              setVariableEditIdx(null);
            });
          }}
          onClose={() => {
            if (variableFormAction === 'create') {
              removeVariable(variableEditIdx);
            }
            setVariableEditIdx(null);
          }}
        />
      )}
      {!currentEditingVariableDefinition && (
        <>
          <div className="flex items-center px-4 py-2 border-b border-border">
            <h2 className="text-base font-semibold">Edit Dashboard Variables</h2>
            <div className="flex flex-row gap-1 ml-auto">
              <Button
                disabled={props.variableDefinitions === variableDefinitions || !validation.isValid}
                variant="default"
                onClick={() => {
                  props.onChange(variableDefinitions);
                }}
              >
                Apply
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
          <div className="p-4 overflow-y-scroll">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {!validation.isValid &&
                  validation.errors.map((error) => (
                    <Alert variant="destructive" key={error}>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ))}
                <div className="overflow-x-auto">
                  <Table className="min-w-[650px]" aria-label="table of variables">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variableDefinitions.map((v, idx) => (
                        <TableRow key={v.spec.name}>
                          <TableCell>
                            <Switch
                              checked={v.spec.display?.hidden !== true}
                              onCheckedChange={(checked) => {
                                toggleVariableVisibility(idx, checked);
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-bold">
                            <VariableName name={v.spec.name} state={variableState.get({ name: v.spec.name })} />
                          </TableCell>
                          <TableCell>{getVariableLabelByKind(v.kind) ?? v.kind}</TableCell>
                          <TableCell>{v.spec.display?.description ?? ''}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <Button variant="ghost" size="icon" onClick={() => changeVariableOrder(idx, 'up')} disabled={idx === 0}>
                              <ArrowUp />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => changeVariableOrder(idx, 'down')}
                              disabled={idx === variableDefinitions.length - 1}
                            >
                              <ArrowDown />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => editVariable(idx)}>
                              <PencilIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setVariableDefinitions((draft) => {
                                  if (v.kind === 'TextVariable') {
                                    draft.push({
                                      ...v,
                                      spec: { ...v.spec, value: v.spec.value, name: `${v.spec.name}_copy` },
                                    });
                                  } else {
                                    draft.push({ ...v, spec: { ...v.spec, name: `${v.spec.name}_copy` } });
                                  }
                                });
                              }}
                            >
                              <CloneIcon />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => removeVariable(idx)}>
                              <TrashIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex">
                  <Button variant="default" className="ml-auto" onClick={addVariable}>
                    <AddIcon className="mr-1" />
                    Add Variable
                  </Button>
                </div>
              </div>
              {externalVariableDefinitions &&
                !externalVariableDefinitions.every((v) => v.definitions.length === 0) &&
                externalVariableDefinitions.map(
                  (extVar, key) =>
                    extVar.definitions.length > 0 && (
                      <Accordion key={key} type="single" collapsible>
                        <AccordionItem value={extVar.source} className="bg-background/50">
                          <AccordionTrigger>
                            <div className="flex flex-row items-center justify-start">
                              <>
                                {extVar.tooltip ? (
                                  <h2 className="text-base font-semibold">
                                    <InfoTooltip
                                      title={extVar.tooltip.title || ''}
                                      description={extVar.tooltip.description || ''}
                                    >
                                      <span>{capitalize(extVar.source)} Variables</span>
                                    </InfoTooltip>
                                  </h2>
                                ) : (
                                  <h2 className="text-base font-semibold">{capitalize(extVar.source)} Variables</h2>
                                )}
                                {extVar.editLink && (
                                  <a href={extVar.editLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-1 p-1 hover:bg-accent rounded">
                                    <OpenInNewIcon fontSize="small" />
                                  </a>
                                )}
                              </>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="overflow-x-auto">
                              <Table className="min-w-[650px]" aria-label="table of external variables">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Visibility</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {extVar.definitions.map((v) => (
                                    <TableRow key={v.spec.name}>
                                      <TableCell>
                                        <Switch checked={v.spec.display?.hidden !== true} disabled />
                                      </TableCell>
                                      <TableCell className="font-bold">
                                        <VariableName
                                          name={v.spec.name}
                                          state={variableState.get({ name: v.spec.name, source: extVar.source })}
                                        />
                                      </TableCell>
                                      <TableCell>{getVariableLabelByKind(v.kind) ?? v.kind}</TableCell>
                                      <TableCell>{v.spec.display?.description ?? ''}</TableCell>
                                      <TableCell className="text-right">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => overrideVariable(v)}
                                              disabled={!!variableState.get({ name: v.spec.name })}
                                            >
                                              <ContentDuplicate />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Override</TooltipContent>
                                        </Tooltip>
                                        <Button variant="ghost" size="icon" disabled>
                                          <ArrowUp />
                                        </Button>
                                        <Button variant="ghost" size="icon" disabled>
                                          <ArrowDown />
                                        </Button>
                                        <Button variant="ghost" size="icon" disabled>
                                          <PencilIcon />
                                        </Button>
                                        <Button variant="ghost" size="icon" disabled>
                                          <TrashIcon />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )
                )}
              {builtinVariableDefinitions && (
                <BuiltinVariableAccordions builtinVariableDefinitions={builtinVariableDefinitions} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

interface VariableEditorFormWithContextProps {
  variableDefinitions: VariableDefinition[];
  externalVariableDefinitions: ExternalVariableDefinition[];
  builtinVariableDefinitions: BuiltinVariableDefinition[];
  currentEditingVariableDefinition: VariableDefinition;
  variableFormAction: Action;
  onActionChange: (action: Action) => void;
  onSave: (definition: VariableDefinition) => void;
  onClose: () => void;
}

function VariableEditorFormWithContext({
  variableDefinitions,
  externalVariableDefinitions,
  builtinVariableDefinitions,
  currentEditingVariableDefinition,
  variableFormAction,
  onActionChange,
  onSave,
  onClose,
}: VariableEditorFormWithContextProps): ReactElement | null {
  const { initialVariableValues, isLoading } = useResolveListVariableValues(variableDefinitions);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full overflow-hidden">
        <Spinner aria-label="loading" />
      </div>
    );
  }

  return (
    <VariableProvider
      initialVariableDefinitions={variableDefinitions}
      externalVariableDefinitions={externalVariableDefinitions}
      builtinVariableDefinitions={builtinVariableDefinitions}
      initialVariableValues={initialVariableValues}
    >
      <ValidationProvider>
        <VariableEditorForm
          initialVariableDefinition={currentEditingVariableDefinition}
          action={variableFormAction}
          isDraft={true}
          onActionChange={onActionChange}
          onSave={onSave}
          onClose={onClose}
        />
      </ValidationProvider>
    </VariableProvider>
  );
}

export function VariableName(props: { name: string; state: VariableState | undefined }): ReactElement {
  const { name, state } = props;
  return (
    <>
      {!state?.overridden && `${name} `}
      {!state?.overridden && state?.overriding && (
        <span className="font-normal text-primary">
          (overriding)
        </span>
      )}
      {state?.overridden && (
        <>
          <span className="text-muted-foreground">{name}</span>
          <span className="font-normal text-muted-foreground">
            (overridden)
          </span>
        </>
      )}
    </>
  );
}
