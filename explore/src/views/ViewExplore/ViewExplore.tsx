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

import {
  TimeRangeProviderWithQueryParams,
  useInitialRefreshInterval,
  useInitialTimeRange,
} from '@perses-dev/plugin-system';

import { ErrorAlert, ErrorBoundary } from '@perses-dev/components';
import {
  DatasourceStoreProviderProps,
  VariableProviderProps,
  DatasourceStoreProvider,
  VariableProvider,
  DEFAULT_DASHBOARD_DURATION,
  DEFAULT_REFRESH_INTERVAL,
} from '@perses-dev/dashboards';
import React, { HTMLAttributes, ReactElement } from 'react';
import { cn } from '@perses-dev/components';
import { ViewExploreApp } from './ViewExploreApp';

export interface ViewExploreProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  datasourceApi: DatasourceStoreProviderProps['datasourceApi'];
  projectName?: DatasourceStoreProviderProps['projectName'];
  externalVariableDefinitions?: VariableProviderProps['externalVariableDefinitions'];
  exploreTitleComponent?: React.ReactNode;
}

export function ViewExplore(props: ViewExploreProps): ReactElement {
  const { datasourceApi, projectName, externalVariableDefinitions, className, exploreTitleComponent, ...others } =
    props;

  const initialTimeRange = useInitialTimeRange(DEFAULT_DASHBOARD_DURATION);
  const initialRefreshInterval = useInitialRefreshInterval(DEFAULT_REFRESH_INTERVAL);

  return (
    <DatasourceStoreProvider datasourceApi={datasourceApi} projectName={projectName}>
      <TimeRangeProviderWithQueryParams
        initialTimeRange={initialTimeRange}
        initialRefreshInterval={initialRefreshInterval}
      >
        <VariableProvider externalVariableDefinitions={externalVariableDefinitions}>
          <div className={cn('flex w-full h-full relative overflow-hidden', className)} {...others}>
            <ErrorBoundary FallbackComponent={ErrorAlert}>
              <ViewExploreApp exploreTitleComponent={exploreTitleComponent} />
            </ErrorBoundary>
          </div>
        </VariableProvider>
      </TimeRangeProviderWithQueryParams>
    </DatasourceStoreProvider>
  );
}
