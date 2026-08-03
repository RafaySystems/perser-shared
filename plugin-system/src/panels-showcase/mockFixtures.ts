/** Shared mock payloads for showcase panels (no live backends). */

export type MockLogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface MockLogRow {
  ts: number;
  level: MockLogLevel;
  service: string;
  message: string;
}

export interface MockTraceSpan {
  id: string;
  name: string;
  service: string;
  startMs: number;
  durationMs: number;
  children?: MockTraceSpan[];
}

export interface MockTableRow {
  id: string;
  service: string;
  status: 'ok' | 'degraded' | 'down';
  rps: number;
  p99ms: number;
  errorRate: number;
}

export interface MockTopoNode {
  id: string;
  label: string;
  kind: 'gateway' | 'inference' | 'backend' | 'cache' | 'db';
  x: number;
  y: number;
}

export interface MockTopoEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface MockGeoSite {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  status: 'healthy' | 'degraded' | 'down';
}

const now = Date.now();

export const DEFAULT_MOCK_LOGS: MockLogRow[] = [
  { ts: now - 12_000, level: 'info', service: 'gateway', message: 'Accepted request id=req-18421 path=/v1/chat/completions' },
  { ts: now - 11_200, level: 'debug', service: 'gateway', message: 'Auth: bearer token validated (tenant=acme)' },
  { ts: now - 10_800, level: 'info', service: 'inference', message: 'Routed to pool=gpu-a100 model=llama-3.1-70b' },
  { ts: now - 9_500, level: 'warn', service: 'inference', message: 'Queue depth elevated: 42 (threshold=40)' },
  { ts: now - 8_200, level: 'info', service: 'backend', message: 'Upstream latency p99=312ms' },
  { ts: now - 6_100, level: 'error', service: 'cache', message: 'Redis GET timeout after 200ms key=sess:acme:19' },
  { ts: now - 5_400, level: 'info', service: 'cache', message: 'Fallback to origin for cache miss' },
  { ts: now - 3_800, level: 'info', service: 'gateway', message: 'Response 200 in 418ms tokens_out=256' },
  { ts: now - 2_200, level: 'debug', service: 'gateway', message: 'Rate limit remaining=982/1000' },
  { ts: now - 900, level: 'warn', service: 'inference', message: 'Replica cold-start on node=gpu-07' },
];

export const DEFAULT_MOCK_TRACE: MockTraceSpan = {
  id: 'span-root',
  name: 'POST /v1/chat/completions',
  service: 'gateway',
  startMs: 0,
  durationMs: 420,
  children: [
    {
      id: 'span-auth',
      name: 'Authenticate',
      service: 'gateway',
      startMs: 2,
      durationMs: 18,
    },
    {
      id: 'span-route',
      name: 'RouteInference',
      service: 'inference',
      startMs: 22,
      durationMs: 380,
      children: [
        { id: 'span-sched', name: 'ScheduleReplica', service: 'inference', startMs: 24, durationMs: 40 },
        { id: 'span-infer', name: 'GenerateTokens', service: 'backend', startMs: 70, durationMs: 300 },
        { id: 'span-cache', name: 'CachePrompt', service: 'cache', startMs: 375, durationMs: 22 },
      ],
    },
  ],
};

export const DEFAULT_MOCK_TABLE: MockTableRow[] = [
  { id: '1', service: 'gateway', status: 'ok', rps: 1240, p99ms: 85, errorRate: 0.12 },
  { id: '2', service: 'inference-router', status: 'ok', rps: 980, p99ms: 210, errorRate: 0.35 },
  { id: '3', service: 'vllm-pool-a', status: 'degraded', rps: 640, p99ms: 890, errorRate: 1.8 },
  { id: '4', service: 'redis-cache', status: 'ok', rps: 4200, p99ms: 6, errorRate: 0.02 },
  { id: '5', service: 'pg-metadata', status: 'ok', rps: 220, p99ms: 34, errorRate: 0.05 },
  { id: '6', service: 'otel-collector', status: 'down', rps: 0, p99ms: 0, errorRate: 100 },
];

export const DEFAULT_MOCK_TOPOLOGY = {
  nodes: [
    { id: 'gw', label: 'Agent Gateway', kind: 'gateway', x: 40, y: 120 },
    { id: 'inf', label: 'Inference Router', kind: 'inference', x: 280, y: 120 },
    { id: 'vllm', label: 'vLLM Pool', kind: 'backend', x: 520, y: 40 },
    { id: 'tei', label: 'Embedding', kind: 'backend', x: 520, y: 200 },
    { id: 'cache', label: 'Redis', kind: 'cache', x: 280, y: 260 },
    { id: 'db', label: 'Postgres', kind: 'db', x: 40, y: 260 },
  ] satisfies MockTopoNode[],
  edges: [
    { id: 'e1', source: 'gw', target: 'inf', label: 'gRPC' },
    { id: 'e2', source: 'inf', target: 'vllm', label: 'HTTP' },
    { id: 'e3', source: 'inf', target: 'tei', label: 'HTTP' },
    { id: 'e4', source: 'inf', target: 'cache', label: 'cache' },
    { id: 'e5', source: 'gw', target: 'db', label: 'meta' },
  ] satisfies MockTopoEdge[],
};

export const DEFAULT_MOCK_GEO_SITES: MockGeoSite[] = [
  { id: 'us-west', name: 'US West', region: 'us-west-2', lat: 45.52, lng: -122.68, status: 'healthy' },
  { id: 'us-east', name: 'US East', region: 'us-east-1', lat: 39.04, lng: -77.49, status: 'healthy' },
  { id: 'eu-west', name: 'EU West', region: 'eu-west-1', lat: 53.35, lng: -6.26, status: 'degraded' },
  { id: 'ap-south', name: 'AP South', region: 'ap-south-1', lat: 19.08, lng: 72.88, status: 'healthy' },
  { id: 'ap-ne', name: 'AP Northeast', region: 'ap-northeast-1', lat: 35.68, lng: 139.69, status: 'down' },
];
