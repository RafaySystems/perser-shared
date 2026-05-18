// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");

import type { DatasourcePlugin, TimeSeriesQueryPlugin, VariablePlugin } from '../model';
import { parseVariables, replaceVariables } from '../runtime';
import { createPrometheusClient } from './prometheusClient';
import { getTimeSeriesData, prometheusTimeSeriesQueryDependsOn, PROM_DATASOURCE_KIND } from './getTimeSeriesData';

type PromDatasourceSpec = {
  directUrl?: string;
  proxy?: { spec?: { url?: string } };
};

type LabelValuesSpec = {
  labelName: string;
  matchers?: string[];
  datasource?: { kind: string; name?: string };
};

export const LOCAL_PROMETHEUS_MODULE_NAME = 'Prometheus';

export const LOCAL_PROMETHEUS_PLUGIN_KINDS = new Set([
  'PrometheusDatasource',
  'PrometheusTimeSeriesQuery',
  'PrometheusLabelValuesVariable',
  'PrometheusLabelNamesVariable',
]);

export const LocalPrometheusDatasource: DatasourcePlugin<PromDatasourceSpec> = {
  createClient: (spec, { proxyUrl }) => {
    const url = spec.directUrl ?? proxyUrl;
    if (!url) {
      throw new Error('Prometheus datasource URL missing (proxy or directUrl)');
    }
    return createPrometheusClient(url);
  },
  createInitialOptions: () => ({}),
};

export const LocalPrometheusTimeSeriesQuery: TimeSeriesQueryPlugin = {
  getTimeSeriesData,
  createInitialOptions: () => ({ query: '' }),
  dependsOn: prometheusTimeSeriesQueryDependsOn,
};

export const LocalPrometheusLabelValuesVariable: VariablePlugin<LabelValuesSpec> = {
  getVariableOptions: async (spec, ctx) => {
    const client = await ctx.datasourceStore.getDatasourceClient(
      spec.datasource?.name
        ? { kind: PROM_DATASOURCE_KIND, name: spec.datasource.name }
        : { kind: PROM_DATASOURCE_KIND }
    );
    const match = spec.matchers?.map((m) => replaceVariables(m, ctx.variables));
    const start = Math.floor(ctx.timeRange.start.getTime() / 1000);
    const end = Math.floor(ctx.timeRange.end.getTime() / 1000);
    const { data } = await client.labelValues({
      labelName: replaceVariables(spec.labelName, ctx.variables),
      match,
      start,
      end,
    });
    return {
      data: data.map((value) => ({ label: value, value })),
    };
  },
  dependsOn: (spec) => ({
    variables: [
      ...new Set([
        ...parseVariables(spec.labelName),
        ...(spec.matchers?.flatMap((m) => parseVariables(m)) ?? []),
      ]),
    ],
  }),
  createInitialOptions: () => ({ labelName: '' }),
};

/** In-process Prometheus plugins (no module federation — avoids react 18.2 vs 18.3 mismatch). */
export const LOCAL_PROMETHEUS_PLUGINS: Record<string, unknown> = {
  PrometheusDatasource: LocalPrometheusDatasource,
  PrometheusTimeSeriesQuery: LocalPrometheusTimeSeriesQuery,
  PrometheusLabelValuesVariable: LocalPrometheusLabelValuesVariable,
};
