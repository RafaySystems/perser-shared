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

import { RadioGroup, RadioGroupItem } from '@perses-dev/components';
import { Label } from '@perses-dev/components';
import { ReactElement, ReactNode, useState } from 'react';
import { OptionsEditorTabPanel } from '../OptionsEditorTabPanel';

export type OptionsEditorRadio = {
  label: string;
  /**
   * Content rendered when the tab is active.
   */
  content: ReactNode;
};

export type OptionsEditorRadiosProps = {
  tabs: OptionsEditorRadio[];
  defaultTab: number;
  onModeChange: (value: number) => void;
  isReadonly?: boolean;
};

export const OptionsEditorRadios = (props: OptionsEditorRadiosProps): ReactElement => {
  const { tabs, defaultTab, onModeChange, isReadonly } = props;
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleChange = (value: string) => {
    const v = parseInt(value);
    setActiveTab(v);
    onModeChange(v);
  };

  return (
    <>
      <div className="border-b border-border">
        <RadioGroup
          className="flex flex-row gap-4 py-2"
          defaultValue={String(defaultTab)}
          value={String(activeTab)}
          onValueChange={handleChange}
          aria-label="Configuration radio"
        >
          {tabs.map(({ label }, i) => (
            <div key={label} className="flex items-center gap-2">
              <RadioGroupItem value={String(i)} id={`radio-tab-${i}`} disabled={isReadonly} />
              <Label htmlFor={`radio-tab-${i}`} className={isReadonly ? 'opacity-50 cursor-not-allowed' : ''}>
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      {tabs.map(({ label, content }, i) => (
        <OptionsEditorTabPanel key={label} value={activeTab} index={i}>
          {content}
        </OptionsEditorTabPanel>
      ))}
    </>
  );
};
