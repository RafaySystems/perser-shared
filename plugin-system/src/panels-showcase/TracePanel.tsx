import type { ReactElement } from 'react';
import type { PanelProps } from '../model';
import { DEFAULT_MOCK_TRACE, type MockTraceSpan } from './mockFixtures';

export type TracePanelSpec = {
  root?: MockTraceSpan;
};

const SERVICE_COLORS = [
  'hsl(213 80% 59%)',
  'hsl(142 68% 45%)',
  'hsl(271 76% 65%)',
  'hsl(25 90% 55%)',
  'hsl(0 70% 55%)',
];

function flatten(span: MockTraceSpan, depth = 0): Array<MockTraceSpan & { depth: number }> {
  const self = [{ ...span, depth }];
  const kids = (span.children ?? []).flatMap((c) => flatten(c, depth + 1));
  return [...self, ...kids];
}

export function TracePanel({ spec, contentDimensions }: PanelProps<TracePanelSpec>): ReactElement {
  const root = (spec as TracePanelSpec)?.root ?? DEFAULT_MOCK_TRACE;
  const spans = flatten(root);
  const total = Math.max(root.durationMs, 1);
  const height = Math.max(contentDimensions?.height ?? 220, 120);
  const serviceColor = new Map<string, string>();
  let colorIdx = 0;

  const colorFor = (service: string): string => {
    if (!serviceColor.has(service)) {
      serviceColor.set(service, SERVICE_COLORS[colorIdx % SERVICE_COLORS.length]!);
      colorIdx += 1;
    }
    return serviceColor.get(service)!;
  };

  return (
    <div style={{ height, overflow: 'auto', padding: '8px 10px', fontSize: 12 }}>
      {spans.map((span) => {
        const left = (span.startMs / total) * 100;
        const width = Math.max((span.durationMs / total) * 100, 1.5);
        return (
          <div key={span.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 56px', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <div style={{ paddingLeft: span.depth * 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontWeight: 600 }}>{span.name}</div>
              <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>{span.service}</div>
            </div>
            <div style={{ position: 'relative', height: 18, background: 'hsl(var(--muted) / 0.45)', borderRadius: 4 }}>
              <div
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  width: `${width}%`,
                  top: 2,
                  bottom: 2,
                  borderRadius: 3,
                  background: colorFor(span.service),
                }}
              />
            </div>
            <div style={{ textAlign: 'right', color: 'hsl(var(--muted-foreground))', fontVariantNumeric: 'tabular-nums' }}>
              {span.durationMs}ms
            </div>
          </div>
        );
      })}
    </div>
  );
}
