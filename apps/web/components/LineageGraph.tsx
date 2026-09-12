'use client';

import { useMemo } from 'react';
import { Background, Controls, Handle, MarkerType, Position, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react';
import type { ArchitectingLineage, LineageStep } from '@limitless/core';

function LineageNode({ data }: NodeProps<Node<LineageStep>>) {
  return (
    <div className="lineageNode">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <span>{data.type} · {data.evidenceGrade}</span>
      <strong>{data.title}</strong>
      <p>{data.detail}</p>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { lineage: LineageNode };

export function LineageGraph({ lineage }: { lineage: ArchitectingLineage }) {
  const nodes = useMemo<Node<LineageStep>[]>(() => lineage.steps.map((step, index) => ({ id: step.id, type: 'lineage', data: step, position: { x: (index % 3) * 320, y: Math.floor(index / 3) * 240 } })), [lineage]);
  const edges = useMemo<Edge[]>(() => lineage.edges.map((edge, index) => ({ id: `edge-${index}`, source: edge.from, target: edge.to, label: edge.label, markerEnd: { type: MarkerType.ArrowClosed, color: '#d4b36a' }, style: { stroke: '#d4b36a' }, labelStyle: { fill: '#7f8998', fontSize: 9 } })), [lineage]);
  return <div className="graphShell"><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView minZoom={0.35} maxZoom={1.35} proOptions={{ hideAttribution: true }}><Background color="rgba(255,255,255,.05)" gap={22} /><Controls showInteractive={false} /></ReactFlow></div>;
}
