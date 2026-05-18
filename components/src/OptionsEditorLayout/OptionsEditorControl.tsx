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

import React, { ReactElement } from 'react';
import { Info as InformationOutlineIcon } from 'lucide-react';
import { useId } from '../utils';
import { InfoTooltip } from '../InfoTooltip';
import { Button } from '../ui/button';

export type OptionsEditorControlProps = {
  label: React.ReactNode;
  control: React.ReactElement;
  description?: string;
};

export const OptionsEditorControl = ({ label, control, description }: OptionsEditorControlProps): ReactElement => {
  const generatedControlId = useId('EditorSectionControl');
  const controlId = `${generatedControlId}-control`;
  const labelId = `${generatedControlId}-label`;

  const controlProps = {
    id: controlId,
    'aria-labelledby': labelId,
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-center">
          <label id={labelId} htmlFor={controlId} className="text-sm font-medium">
            {label}
          </label>
          {description && (
            <InfoTooltip description={description} delayDuration={100}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded h-6 w-6 p-0 mx-0.5"
              >
                <InformationOutlineIcon
                  aria-describedby="info-tooltip"
                  aria-hidden={false}
                  fontSize="inherit"
                  className="text-muted-foreground"
                />
              </Button>
            </InfoTooltip>
          )}
        </div>
        <div className="w-[180px] text-right">{React.cloneElement(control, controlProps)}</div>
      </div>
    </div>
  );
};
