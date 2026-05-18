// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");

export type PromInstantResult = {
  resultType: 'vector' | 'matrix' | 'scalar';
  result: Array<{
    metric?: Record<string, string>;
    value?: [number, string];
    values?: Array<[number, string]>;
  }>;
};

export type PromQueryResponse = {
  status: string;
  data?: PromInstantResult;
  warnings?: string[];
};

export interface PrometheusHttpClient {
  rangeQuery: (
    params: { query: string; start: number; end: number; step: number },
    opts?: { signal?: AbortSignal }
  ) => Promise<PromQueryResponse>;
  instantQuery: (
    params: { query: string; time: number },
    opts?: { signal?: AbortSignal }
  ) => Promise<PromQueryResponse>;
  labelValues: (
    params: { labelName: string; match?: string[]; start?: number; end?: number },
    opts?: { signal?: AbortSignal }
  ) => Promise<{ data: string[] }>;
}

export function createPrometheusClient(proxyUrl: string): PrometheusHttpClient {
  const base = proxyUrl.replace(/\/$/, '');

  async function getJson<T>(path: string, search: Record<string, string | string[]>, signal?: AbortSignal): Promise<T> {
    const url = new URL(`${base}${path}`);
    for (const [key, value] of Object.entries(search)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          url.searchParams.append(key, v);
        }
      } else {
        url.searchParams.set(key, value);
      }
    }
    const res = await fetch(url.toString(), { signal });
    const body = (await res.json()) as T & { message?: string };
    if (!res.ok) {
      throw new Error((body as { message?: string }).message ?? res.statusText);
    }
    return body;
  }

  return {
    rangeQuery: (params, opts) =>
      getJson<PromQueryResponse>('/api/v1/query_range', {
        query: params.query,
        start: String(params.start),
        end: String(params.end),
        step: String(params.step),
      }, opts?.signal),

    instantQuery: (params, opts) =>
      getJson<PromQueryResponse>('/api/v1/query', {
        query: params.query,
        time: String(params.time),
      }, opts?.signal),

    labelValues: (params, opts) => {
      const search: Record<string, string | string[]> = {};
      if (params.start !== undefined) search.start = String(params.start);
      if (params.end !== undefined) search.end = String(params.end);
      if (params.match?.length) search['match[]'] = params.match;
      return getJson<{ status: string; data: string[] }>(
        `/api/v1/label/${encodeURIComponent(params.labelName)}/values`,
        search,
        opts?.signal
      ).then((r) => ({ data: r.data ?? [] }));
    },
  };
}
