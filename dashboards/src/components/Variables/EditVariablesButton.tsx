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

import { ReactElement, useState } from 'react';
import { Pencil as PencilIcon } from 'lucide-react';
import { Button, ButtonProps, Drawer, InfoTooltip } from '@perses-dev/components';
import { BuiltinVariableDefinition, VariableDefinition } from '@perses-dev/spec';
import { useBuiltinVariableDefinitions } from '@perses-dev/plugin-system';
import { ExternalVariableDefinition } from '../../model/VariableDefinition';
import { TOOLTIP_TEXT } from '../../constants';
import { useExternalVariableDefinitions, useVariableDefinitionActions, useVariableDefinitions } from '../../context';
import { VariableEditor } from './VariableEditor';

export interface EditVariablesButtonProps {
  /**
   * The variant to use to display the button.
   */
  variant?: ButtonProps['variant'];

  /**
   * The color to use to display the button.
   */
  color?: string;

  /**
   * The label used inside the button.
   */
  label?: string;

  fullWidth?: boolean;
}

export function EditVariablesButton({
  variant = 'ghost',
  label = 'Variables',
  fullWidth,
}: EditVariablesButtonProps): ReactElement {
  const [isVariableEditorOpen, setIsVariableEditorOpen] = useState(false);
  const variableDefinitions: VariableDefinition[] = useVariableDefinitions();
  const externalVariableDefinitions: ExternalVariableDefinition[] = useExternalVariableDefinitions();
  const builtinVariableDefinitions: BuiltinVariableDefinition[] = useBuiltinVariableDefinitions();
  const { setVariableDefinitions } = useVariableDefinitionActions();

  const openVariableEditor = (): void => {
    setIsVariableEditorOpen(true);
  };

  const closeVariableEditor = (): void => {
    setIsVariableEditorOpen(false);
  };

  return (
    <>
      <InfoTooltip description={TOOLTIP_TEXT.editVariables}>
        <Button
          onClick={openVariableEditor}
          aria-label={TOOLTIP_TEXT.editVariables}
          variant={variant}
          className={`whitespace-nowrap min-w-0${fullWidth ? ' w-full' : ''}`}
        >
          <PencilIcon className="mr-0.5" />
          {label}
        </Button>
      </InfoTooltip>
      <Drawer
        isOpen={isVariableEditorOpen}
        onClose={closeVariableEditor}
        PaperProps={{ sx: { width: '50%' } }}
        data-testid="variable-editor"
      >
        <VariableEditor
          variableDefinitions={variableDefinitions}
          externalVariableDefinitions={externalVariableDefinitions}
          builtinVariableDefinitions={builtinVariableDefinitions}
          onCancel={closeVariableEditor}
          onChange={(variables: VariableDefinition[]) => {
            setVariableDefinitions(variables);
            setIsVariableEditorOpen(false);
          }}
        />
      </Drawer>
    </>
  );
}
