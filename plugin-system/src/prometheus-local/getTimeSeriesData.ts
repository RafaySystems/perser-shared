// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");

import type { TimeSeries, TimeSeriesData } from '@perses-dev/spec';
import type { TimeSeriesQueryPlugin } from '../model';
import { parseVariables, replaceVariables } from '../runtime';
import type { PrometheusHttpClient, PromQueryResponse } from './prometheusClient';

export const PROM_DATASOURCE_KIND = 'PrometheusDatasource';
const DEFAULT_SELECTOR = { kind: PROM_DATASOURCE_KIND };

type PromQuerySpec = {
  query?: string;
  datasource?: { kind: string; name?: string };
  seriesNameFormat?: string;
};

function unixSec(d: Date): number {
  return Math.floor(d.getTime() / 1000);
}

function replacePromBuiltins(query: string, stepSec: number): string {
  const interval = `${stepSec}s`;
  const rateInterval = `${Math.max(stepSec * 4, stepSec)}s`;
  return query
    .replace(/\$__rate_interval/g, rateInterval)
    .replace(/\$__interval_ms/g, String(stepSec * 1000))
    .replace(/\$__interval/g, interval);
}

function seriesLabel(metric: Record<string, string> | undefined, seriesNameFormat?: string): string {
  if (!metric) return 'value';
  if (seriesNameFormat) {
    return seriesNameFormat.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => metric[key] ?? '');
  }
  const pairs = Object.entries(metric)
    .filter(([k]) => k !== '__name__')
    .map(([k, v]) => `${k}="${v}"`);
  if (pairs.length > 0) return pairs.join(', ');
  return metric.__name__ ?? 'value';
}

function toSeries(
  response: PromQueryResponse,
  seriesNameFormat?: string
): TimeSeries[] {
  const data = response.data;
  if (!data?.result) return [];

  if (data.resultType === 'matrix') {
    return data.result.map((r) => {
      const name = seriesLabel(r.metric, seriesNameFormat);
      return {
        name,
        formattedName: name,
        labels: r.metric,
        values: (r.values ?? []).map(([ts, val]) => [ts * 1000, parseFloat(val)] as [number, number]),
      };
    });
  }

  if (data.resultType === 'vector') {
    return data.result.map((r) => {
      const name = seriesLabel(r.metric, seriesNameFormat);
      const tuple = r.value ?? [0, '0'];
      return {
        name,
        formattedName: name,
        labels: r.metric,
        values: [[tuple[0] * 1000, parseFloat(tuple[1])] as [number, number]],
      };
    });
  }

  return [];
}

export const getTimeSeriesData: TimeSeriesQueryPlugin<PromQuerySpec>['getTimeSeriesData'] = async (
  spec,
  context,
  abortSignal
) => {
  if (!spec.query?.trim()) {
    return { series: [] };
  }

  const client = (await context.datasourceStore.getDatasourceClient(
    spec.datasource?.name
      ? { kind: PROM_DATASOURCE_KIND, name: spec.datasource.name }
      : DEFAULT_SELECTOR
  )) as PrometheusHttpClient;

  const start = unixSec(context.timeRange.start);
  const end = unixSec(context.timeRange.end);
  const stepSec = Math.max(
    15,
    Math.floor((context.suggestedStepMs ?? 15_000) / 1000)
  );

  let query = replacePromBuiltins(replaceVariables(spec.query, context.variableState), stepSec);
  const seriesNameFormat = spec.seriesNameFormat
    ? replaceVariables(spec.seriesNameFormat, context.variableState)
    : undefined;

  let response: PromQueryResponse;
  if (context.mode === 'instant') {
    response = await client.instantQuery({ query, time: end }, { signal: abortSignal });
  } else {
    let alignedEnd = end;
    let alignedStart = start;
    if (alignedEnd <= alignedStart) {
      alignedEnd = alignedStart + stepSec;
    }
    response = await client.rangeQuery(
      { query, start: alignedStart, end: alignedEnd, step: stepSec },
      { signal: abortSignal }
    );
  }

  return {
    timeRange: context.timeRange,
    stepMs: stepSec * 1000,
    series: toSeries(response, seriesNameFormat),
    metadata: { executedQueryString: query },
  } satisfies TimeSeriesData;
};

export const prometheusTimeSeriesQueryDependsOn: TimeSeriesQueryPlugin<PromQuerySpec>['dependsOn'] = (spec) => {
  const vars = [
    ...parseVariables(spec.query ?? ''),
    ...parseVariables(spec.seriesNameFormat ?? ''),
  ];
  return { variables: [...new Set(vars)] };
};
