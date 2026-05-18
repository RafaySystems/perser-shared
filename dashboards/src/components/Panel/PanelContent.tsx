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

import { usePlugin, PanelProps, QueryData, PanelPlugin } from '@perses-dev/plugin-system';
import { UnknownSpec, PanelDefinition, QueryDataType } from '@perses-dev/spec';
import { ReactElement } from 'react';
import { LoadingOverlay, Skeleton } from '@perses-dev/components';
import { PanelPluginLoader } from './PanelPluginLoader';

export interface PanelContentProps extends Omit<PanelProps<UnknownSpec>, 'queryResults'> {
  panelPluginKind: string;
  definition?: PanelDefinition<UnknownSpec>;
  queryResults: QueryData[];
}

/**
 * Based on the status of the queries (loading, error or data available), this component renders a
 * loading overlay, throws an error, or renders the panel content.
 */
export function PanelContent(props: PanelContentProps): ReactElement {
  const { panelPluginKind, definition, queryResults, spec, contentDimensions } = props;
  const { data: plugin, isLoading: isPanelLoading } = usePlugin('Panel', panelPluginKind, { useErrorBoundary: true });

  // Show fullsize skeleton if the panel plugin is loading.
  if (isPanelLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width={contentDimensions?.width}
        height={contentDimensions?.height}
        aria-label="Loading..."
      />
    );
  }

  const queryResultsWithData = queryResults.flatMap((q) =>
    q.data ? [{ data: q.data, definition: q.definition }] : []
  );

  const allQueriesSettled =
    queryResults.length > 0 && queryResults.every((q) => !q.isFetching && !q.isLoading);

  const panelQueryResults =
    queryResultsWithData.length > 0
      ? queryResultsWithData
      : allQueriesSettled
        ? queryResults.map((q) => ({
            definition: q.definition,
            data: q.data ?? { series: [] },
          }))
        : [];

  // Render when we have data, no queries (Markdown), or all queries finished (incl. empty/zero series).
  if (panelQueryResults.length > 0 || queryResults.length === 0) {
    return (
      <PanelPluginLoader
        kind={panelPluginKind}
        spec={spec}
        contentDimensions={contentDimensions}
        definition={definition}
        queryResults={panelQueryResults}
      />
    );
  }

  if (queryResults.some((q) => q.isFetching || q.isLoading)) {
    return <PanelLoading plugin={plugin} spec={spec} definition={definition} contentDimensions={contentDimensions} />;
  }

  const queryError = queryResults.find((q) => q.error);
  if (queryError) {
    throw queryError.error;
  }

  // Queries disabled (e.g. not in viewport yet) — keep loading until they run.
  return <PanelLoading plugin={plugin} spec={spec} definition={definition} contentDimensions={contentDimensions} />;
}

interface PanelLoadingProps extends Pick<PanelContentProps, 'spec' | 'definition' | 'contentDimensions'> {
  plugin?: PanelPlugin<UnknownSpec, PanelProps<UnknownSpec, QueryDataType>>;
}

function PanelLoading({ plugin, spec, definition, contentDimensions }: PanelLoadingProps): ReactElement {
  if (plugin?.LoadingComponent) {
    return (
      <plugin.LoadingComponent
        spec={spec}
        contentDimensions={contentDimensions}
        definition={definition}
        queryResults={[]}
      />
    );
  }
  return <LoadingOverlay />;
}
