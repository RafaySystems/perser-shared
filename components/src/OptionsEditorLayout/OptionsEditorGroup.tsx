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

export type OptionsEditorGroupProps = {
  /**
   * Text that communicates the purpose of the grouping.
   */
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

/**
 * Group similar content within panel options.
 */
export const OptionsEditorGroup = ({ title, children, icon }: OptionsEditorGroupProps): ReactElement => {
  return (
    <div>
      <div className="flex border-b border-border mb-2">
        <h4 className="text-xs font-medium uppercase tracking-widest">{title}</h4>
        {icon && <div className="ml-auto">{icon}</div>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};
