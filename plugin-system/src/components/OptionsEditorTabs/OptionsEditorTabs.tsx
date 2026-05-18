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

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@perses-dev/components';
import { ReactElement, ReactNode } from 'react';

export type OptionsEditorTab = {
  label: string;
  /**
   * Content rendered when the tab is active.
   */
  content: ReactNode;
};

export type OptionsEditorTabsProps = {
  tabs: OptionsEditorTab[];
};

export const OptionsEditorTabs = ({ tabs }: OptionsEditorTabsProps): ReactElement => {
  return (
    <Tabs defaultValue={tabs[0]?.label ?? ''}>
      <div className="border-b border-border">
        <TabsList className="h-auto bg-transparent p-0 rounded-none">
          {tabs.map(({ label }, i) => (
            <TabsTrigger
              key={label}
              value={label}
              id={`options-editor-tab-${i}`}
              aria-controls={`options-editor-tabpanel-${i}`}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map(({ label, content }, i) => (
        <TabsContent
          key={label}
          value={label}
          id={`options-editor-tabpanel-${i}`}
          aria-labelledby={`options-editor-tab-${i}`}
          className="mt-2"
        >
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
