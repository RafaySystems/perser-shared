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
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@perses-dev/components';
import { useQueryClient } from '@tanstack/react-query';
import { TimeSeriesQueryDefinition, UnknownSpec } from '@perses-dev/spec';
import { useActiveTimeSeriesQueries, useDatasourceClient, useTimeRange } from '@perses-dev/plugin-system';
import { ReactElement } from 'react';

export interface WarningDisplay {
  query: string;
  summary: string;
}

const TABLE_MAX_WIDTH = 1000;

interface QuerySummaryTableProps {
  showTotalQueries?: boolean;
}

export function QuerySummaryTable(props: QuerySummaryTableProps): ReactElement | null {
  const { showTotalQueries = true } = props;
  const datasourceClient = useDatasourceClient({ kind: 'PrometheusDatasource' });
  const { absoluteTimeRange } = useTimeRange();

  // for displaying a summary of recent query results
  const queryClient = useQueryClient();
  const queries = queryClient.getQueryCache().findAll();
  const activeQueries = queries.filter((query) => query.state.status === 'loading');
  const completedQueries = queries.filter((query) => query.state.status === 'success');
  const querySummary = useActiveTimeSeriesQueries();

  if (datasourceClient.isLoading === true) {
    return null;
  }

  const warnings: WarningDisplay[] = [];
  querySummary.forEach((query) => {
    const queryData = query.state.data;
    if (queryData && queryData.metadata?.notices) {
      const queryKey = query.queryKey as [TimeSeriesQueryDefinition<UnknownSpec>];
      const warningMessage = queryData.metadata.notices[0]?.message;
      if (warningMessage) {
        warnings.push({
          query: String(queryKey[0].spec.plugin.spec.query),
          summary: warningMessage,
        });
      }
    }
  });

  return (
    <div className="flex flex-col gap-2 mb-4" style={{ maxWidth: TABLE_MAX_WIDTH }}>
      <div className="p-2">
        <h2 className="text-base font-semibold mb-2">Query Summary</h2>
        <div className="rounded-md border">
          <Table aria-label="query summary table">
            <TableHeader>
              <TableRow>
                <TableHead>Queries Loading</TableHead>
                <TableHead>Recent Time Series Queries</TableHead>
                {showTotalQueries && <TableHead>Total Queries</TableHead>}
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{activeQueries.length}</TableCell>
                <TableCell>{querySummary.length}</TableCell>
                {showTotalQueries && <TableCell>{completedQueries.length}</TableCell>}
                <TableCell>{absoluteTimeRange.start.toString()}</TableCell>
                <TableCell>{absoluteTimeRange.end.toString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="p-2">
          <h3 className="text-sm font-semibold mb-2">Warnings</h3>
          <div className="rounded-md border mb-4">
            <Table aria-label="query warnings table">
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warnings.map((details, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell>{details.query}</TableCell>
                      <TableCell>{details.summary}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Button disabled variant="outline">
            TODO: Action Button
          </Button>
        </div>
      )}
    </div>
  );
}
