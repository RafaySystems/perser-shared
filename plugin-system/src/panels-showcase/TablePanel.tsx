import type { ReactElement } from 'react';
import type { PanelProps } from '../model';
import { DEFAULT_MOCK_TABLE, type MockTableRow } from './mockFixtures';

export type TablePanelSpec = {
  rows?: MockTableRow[];
};

const STATUS_COLOR: Record<MockTableRow['status'], string> = {
  ok: 'hsl(142 68% 45%)',
  degraded: 'hsl(45 90% 50%)',
  down: 'hsl(0 72% 55%)',
};

export function TablePanel({ spec, contentDimensions }: PanelProps<TablePanelSpec>): ReactElement {
  const rows = (spec as TablePanelSpec)?.rows?.length ? (spec as TablePanelSpec).rows! : DEFAULT_MOCK_TABLE;
  const height = Math.max(contentDimensions?.height ?? 220, 120);

  return (
    <div style={{ height, overflow: 'auto', padding: '4px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: 'hsl(var(--muted-foreground))', borderBottom: '1px solid hsl(var(--border))' }}>
            <th style={{ padding: '6px 10px', fontWeight: 500 }}>Service</th>
            <th style={{ padding: '6px 10px', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '6px 10px', fontWeight: 500, textAlign: 'right' }}>RPS</th>
            <th style={{ padding: '6px 10px', fontWeight: 500, textAlign: 'right' }}>p99</th>
            <th style={{ padding: '6px 10px', fontWeight: 500, textAlign: 'right' }}>Errors %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid hsl(var(--border) / 0.45)' }}>
              <td style={{ padding: '7px 10px', fontWeight: 500 }}>{row.service}</td>
              <td style={{ padding: '7px 10px' }}>
                <span style={{ color: STATUS_COLOR[row.status], textTransform: 'capitalize' }}>{row.status}</span>
              </td>
              <td style={{ padding: '7px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.rps}</td>
              <td style={{ padding: '7px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.p99ms}ms</td>
              <td style={{ padding: '7px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.errorRate.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
