import { useMemo, type CSSProperties, type ReactElement } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from '@xyflow/react';
import type { PanelProps } from '../model';
import { DEFAULT_MOCK_TOPOLOGY, type MockTopoEdge, type MockTopoNode } from './mockFixtures';

export type TopologyPanelSpec = {
  nodes?: MockTopoNode[];
  edges?: MockTopoEdge[];
};

const KIND_STYLE: Record<MockTopoNode['kind'], CSSProperties> = {
  gateway: { background: 'hsl(213 60% 28%)', border: '1px solid hsl(213 80% 55%)' },
  inference: { background: 'hsl(142 40% 22%)', border: '1px solid hsl(142 68% 45%)' },
  backend: { background: 'hsl(271 40% 26%)', border: '1px solid hsl(271 76% 65%)' },
  cache: { background: 'hsl(25 50% 22%)', border: '1px solid hsl(25 90% 55%)' },
  db: { background: 'hsl(200 40% 22%)', border: '1px solid hsl(200 70% 55%)' },
};

function toFlowNodes(nodes: MockTopoNode[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    position: { x: n.x, y: n.y },
    data: { label: n.label },
    style: {
      ...KIND_STYLE[n.kind],
      color: 'hsl(210 40% 96%)',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 12,
      fontWeight: 600,
      minWidth: 110,
      textAlign: 'center',
    },
  }));
}

function toFlowEdges(edges: MockTopoEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: true,
    style: { stroke: 'hsl(215 20% 55%)' },
    labelStyle: { fill: 'hsl(215 20% 70%)', fontSize: 10 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(215 20% 55%)' },
  }));
}

export function TopologyPanel({ spec, contentDimensions }: PanelProps<TopologyPanelSpec>): ReactElement {
  const panelSpec = spec as TopologyPanelSpec;
  const height = Math.max(contentDimensions?.height ?? 280, 180);
  const width = Math.max(contentDimensions?.width ?? 400, 200);

  const nodes = useMemo(
    () => toFlowNodes(panelSpec.nodes?.length ? panelSpec.nodes : DEFAULT_MOCK_TOPOLOGY.nodes),
    [panelSpec.nodes]
  );
  const edges = useMemo(
    () => toFlowEdges(panelSpec.edges?.length ? panelSpec.edges : DEFAULT_MOCK_TOPOLOGY.edges),
    [panelSpec.edges]
  );

  return (
    <div style={{ width, height }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          style={{ background: 'hsl(222 40% 8%)' }}
        >
          <Background gap={16} color="hsl(217 28% 22%)" />
          <MiniMap
            pannable
            zoomable
            style={{ background: 'hsl(222 40% 10%)' }}
            maskColor="rgba(0,0,0,0.45)"
            nodeColor={() => 'hsl(213 80% 50%)'}
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
