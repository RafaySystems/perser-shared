import type { ReactElement } from 'react';
import type { PanelProps } from '../model';
import { DEFAULT_MOCK_LOGS, type MockLogLevel, type MockLogRow } from './mockFixtures';

export type LogsPanelSpec = {
  logs?: MockLogRow[];
  title?: string;
};

const LEVEL_COLOR: Record<MockLogLevel, string> = {
  debug: 'hsl(215 20% 65%)',
  info: 'hsl(213 80% 59%)',
  warn: 'hsl(45 90% 55%)',
  error: 'hsl(0 72% 55%)',
};

function formatTs(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour12: false });
}

export function LogsPanel({ spec, contentDimensions }: PanelProps<LogsPanelSpec>): ReactElement {
  const logs = (spec as LogsPanelSpec)?.logs?.length ? (spec as LogsPanelSpec).logs! : DEFAULT_MOCK_LOGS;
  const height = Math.max(contentDimensions?.height ?? 220, 120);

  return (
    <div
      style={{
        height,
        overflow: 'auto',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        lineHeight: 1.45,
        padding: '4px 8px',
      }}
    >
      {logs.map((row, i) => (
        <div
          key={`${row.ts}-${i}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '72px 52px 90px 1fr',
            gap: 8,
            padding: '3px 0',
            borderBottom: '1px solid hsl(var(--border) / 0.5)',
          }}
        >
          <span style={{ color: 'hsl(var(--muted-foreground))' }}>{formatTs(row.ts)}</span>
          <span style={{ color: LEVEL_COLOR[row.level], fontWeight: 600, textTransform: 'uppercase' }}>{row.level}</span>
          <span style={{ color: 'hsl(var(--foreground))' }}>{row.service}</span>
          <span style={{ color: 'hsl(var(--muted-foreground))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.message}
          </span>
        </div>
      ))}
    </div>
  );
}
