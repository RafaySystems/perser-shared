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

import { Box, BoxProps } from '@rafaysystems-perses/components/compat/mui';
import {
  TimeRangeProviderWithQueryParams,
  useInitialRefreshInterval,
  useInitialTimeRange,
} from '@rafaysystems-perses/plugin-system';

import { ErrorAlert, ErrorBoundary, combineSx } from '@rafaysystems-perses/components';
import {
  DatasourceStoreProviderProps,
  VariableProviderProps,
  DatasourceStoreProvider,
  VariableProvider,
  DEFAULT_DASHBOARD_DURATION,
  DEFAULT_REFRESH_INTERVAL,
} from '@rafaysystems-perses/dashboards';
import React, { ReactElement } from 'react';
import { ViewExploreApp } from './ViewExploreApp';

export interface ViewExploreProps extends Omit<BoxProps, 'children'> {
  datasourceApi: DatasourceStoreProviderProps['datasourceApi'];
  projectName?: DatasourceStoreProviderProps['projectName'];
  externalVariableDefinitions?: VariableProviderProps['externalVariableDefinitions'];
  exploreTitleComponent?: React.ReactNode;
}

export function ViewExplore(props: ViewExploreProps): ReactElement {
  const { datasourceApi, projectName, externalVariableDefinitions, sx, exploreTitleComponent, ...others } = props;

  const initialTimeRange = useInitialTimeRange(DEFAULT_DASHBOARD_DURATION);
  const initialRefreshInterval = useInitialRefreshInterval(DEFAULT_REFRESH_INTERVAL);

  return (
    <DatasourceStoreProvider datasourceApi={datasourceApi} projectName={projectName}>
      <TimeRangeProviderWithQueryParams
        initialTimeRange={initialTimeRange}
        initialRefreshInterval={initialRefreshInterval}
      >
        <VariableProvider externalVariableDefinitions={externalVariableDefinitions}>
          <Box
            sx={combineSx(
              {
                display: 'flex',
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
              },
              sx
            )}
            {...others}
          >
            <ErrorBoundary FallbackComponent={ErrorAlert}>
              <ViewExploreApp exploreTitleComponent={exploreTitleComponent} />
            </ErrorBoundary>
          </Box>
        </VariableProvider>
      </TimeRangeProviderWithQueryParams>
    </DatasourceStoreProvider>
  );
}
