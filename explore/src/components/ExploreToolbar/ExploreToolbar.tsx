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

import { TimeRangeControls, useTimeZoneParams } from '@perses-dev/plugin-system';
import React, { ReactElement } from 'react';

export interface ExploreToolbarProps {
  exploreTitleComponent?: React.ReactNode;
}

export const ExploreToolbar = (props: ExploreToolbarProps): ReactElement => {
  const { exploreTitleComponent } = props;

  const { timeZone, setTimeZone } = useTimeZoneParams('local');

  const testId = 'explore-toolbar';

  return (
    <div data-testid={testId}>
      <div className="flex w-full">
        {exploreTitleComponent}
        <div className="flex flex-row gap-1 ml-auto flex-wrap-reverse lg:flex-nowrap justify-end">
          <TimeRangeControls timeZone={timeZone} onTimeZoneChange={(tz) => setTimeZone(tz.value)} />
        </div>
      </div>
    </div>
  );
};
