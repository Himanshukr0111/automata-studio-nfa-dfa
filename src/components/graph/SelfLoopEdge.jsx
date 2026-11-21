import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer } from '@xyflow/react';

function SelfLoopEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  markerEnd,
  style = {},
}) {
  // Compute arch coordinates above the circular node
  const radiusX = 35;
  const radiusY = 45;
  const startX = sourceX - 12;
  const startY = sourceY;
  const endX = sourceX + 12;
  const endY = sourceY;

  // Cubic Bezier curve that loops up and back down
  const c1X = startX - radiusX;
  const c1Y = startY - radiusY * 1.6;
  const c2X = endX + radiusX;
  const c2Y = endY - radiusY * 1.6;

  const edgePath = `M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${endX} ${endY}`;

  // Center of the loop apex for the label
  const labelX = sourceX;
  const labelY = sourceY - radiusY * 1.35;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: '#60a5fa',
          strokeWidth: 2,
          ...style,
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="px-2 py-0.5 rounded-md bg-slate-950/95 border border-cyan-500/50 shadow-md font-mono text-[11px] font-bold text-cyan-300 z-20"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(SelfLoopEdge);
