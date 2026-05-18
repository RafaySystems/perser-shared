import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Table',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

const metrics = [
  { name: 'cpu_usage_percent', type: 'gauge', labels: 4, status: 'active', lastSeen: '5s ago' },
  { name: 'http_requests_total', type: 'counter', labels: 6, status: 'active', lastSeen: '1s ago' },
  { name: 'memory_bytes', type: 'gauge', labels: 3, status: 'active', lastSeen: '10s ago' },
  { name: 'disk_io_bytes', type: 'counter', labels: 5, status: 'stale', lastSeen: '2m ago' },
  { name: 'network_packets', type: 'counter', labels: 4, status: 'stale', lastSeen: '5m ago' },
];

export const MetricsTable: Story = {
  render: () => (
    <Table>
      <TableCaption>Active metrics from the last scrape</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Metric Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Labels</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Last Seen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((m) => (
          <TableRow key={m.name}>
            <TableCell className="font-mono text-sm">{m.name}</TableCell>
            <TableCell>
              <Badge variant={m.type === 'counter' ? 'default' : 'secondary'} className="text-xs">
                {m.type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{m.labels}</TableCell>
            <TableCell>
              <span
                className={`inline-flex h-2 w-2 rounded-full mr-2 ${m.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}
              />
              {m.status}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">{m.lastSeen}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
