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

import { Plus as AddIcon, Pencil as PencilIcon, Trash2 as TrashIcon } from 'lucide-react';
import {
  Action,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@perses-dev/components';
import { DatasourceSpec } from '@perses-dev/spec';
import { DatasourceDefinition, DatasourceEditorForm, ValidationProvider } from '@perses-dev/plugin-system';
import { ReactElement, useState } from 'react';
import { useImmer } from 'use-immer';
import { useDiscardChangesConfirmationDialog } from '../../context';

export function DatasourceEditor(props: {
  datasources: Record<string, DatasourceSpec>;
  onChange: (datasources: Record<string, DatasourceSpec>) => void;
  onCancel: () => void;
}): ReactElement {
  const [datasources, setDatasources] = useImmer(props.datasources);
  const [datasourceFormAction, setDatasourceFormAction] = useState<Action>('update');
  const [datasourceEdit, setDatasourceEdit] = useState<DatasourceDefinition | null>(null);
  const defaultSpec: DatasourceSpec = {
    default: false,
    plugin: {
      // TODO: find a way to avoid assuming that the PrometheusDatasource plugin is installed
      kind: 'PrometheusDatasource',
      spec: {},
    },
  };

  const { openDiscardChangesConfirmationDialog, closeDiscardChangesConfirmationDialog } =
    useDiscardChangesConfirmationDialog();

  const handleCancel = (): void => {
    if (JSON.stringify(props.datasources) !== JSON.stringify(datasources)) {
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

  const removeDatasource = (name: string): void => {
    setDatasources((draft) => {
      delete draft[name];
    });
  };

  const addDatasource = (): void => {
    setDatasourceFormAction('create');
    setDatasourceEdit({
      name: 'NewDatasource',
      spec: defaultSpec,
    });
  };

  const editDatasource = (name: string): void => {
    setDatasourceFormAction('update');
    setDatasourceEdit({
      name: name,
      spec: datasources[name] ?? defaultSpec,
    });
  };

  return (
    <>
      {datasourceEdit ? (
        <ValidationProvider>
          <DatasourceEditorForm
            initialDatasourceDefinition={datasourceEdit}
            action={datasourceFormAction}
            isDraft={true}
            onActionChange={setDatasourceFormAction}
            onSave={(def: DatasourceDefinition) => {
              setDatasources((draft) => {
                delete draft[datasourceEdit.name]; // to tackle the case where datasource name has been changed
                draft[def.name] = def.spec;
                setDatasourceEdit(null);
              });
            }}
            onClose={() => {
              setDatasourceEdit(null);
            }}
          />
        </ValidationProvider>
      ) : (
        <>
          <div className="flex items-center px-4 py-2 border-b">
            <h2 className="text-base font-semibold">Edit Dashboard Datasources</h2>
            <div className="flex flex-row gap-2 ml-auto">
              <Button
                disabled={props.datasources === datasources}
                variant="default"
                onClick={() => {
                  props.onChange(datasources);
                }}
              >
                Apply
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto flex flex-col gap-4">
            <Table aria-label="table of datasources" className="min-w-[650px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(datasources).map(([name, spec]) => {
                  return (
                    <TableRow key={name}>
                      <TableCell className="font-bold">{name}</TableCell>
                      <TableCell>{spec.plugin.kind}</TableCell>
                      <TableCell>{spec.display?.description ?? ''}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editDatasource(name)}
                          className="h-8 w-8"
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDatasource(name)}
                          className="h-8 w-8"
                        >
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <Button variant="default" onClick={addDatasource}>
                <AddIcon className="mr-1 h-4 w-4" />
                Add Datasource
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
