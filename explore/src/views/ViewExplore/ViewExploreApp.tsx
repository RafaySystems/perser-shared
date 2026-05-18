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

import { ChartsProvider, generateChartsTheme, usePaletteMode } from '@perses-dev/components';
import { ReactElement, ReactNode, useMemo } from 'react';
import { ExploreManager, ExplorerManagerProviderWithQueryParams } from '../../components';

export interface ViewAppProps {
  exploreTitleComponent?: ReactNode;
}

export function ViewExploreApp(props: ViewAppProps): ReactElement {
  const { exploreTitleComponent } = props;
  const mode = usePaletteMode();
  const chartsTheme = useMemo(() => generateChartsTheme(mode), [mode]);

  return (
    <ChartsProvider chartsTheme={chartsTheme} enablePinning={false}>
      <div className="grow overflow-x-hidden overflow-y-auto flex flex-col">
        <ExplorerManagerProviderWithQueryParams>
          <ExploreManager exploreTitleComponent={exploreTitleComponent} />
        </ExplorerManagerProviderWithQueryParams>
      </div>
    </ChartsProvider>
  );
}
