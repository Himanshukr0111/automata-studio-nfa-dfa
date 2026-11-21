import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from '@xyflow/react';
import StateNode from './StateNode';
import SelfLoopEdge from './SelfLoopEdge';
import { mapAutomatonToGraph } from './automataGraphMapper';
import { Maximize2, RefreshCw } from 'lucide-react';

const nodeTypes = {
  stateNode: StateNode,
};

const edgeTypes = {
  selfLoop: SelfLoopEdge,
};

export default function AutomataGraphCanvas({
  automaton,
  type = 'nfa',
  title = '',
  subtitle = '',
  height = '520px',
  highlight = {},
}) {
  const [rfInstance, setRfInstance] = useState(null);

  // Compute graph nodes and edges with highlights
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return mapAutomatonToGraph(automaton, type, highlight);
  }, [automaton, type, highlight]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when automaton or highlight changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = mapAutomatonToGraph(automaton, type, highlight);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [automaton, type, highlight, setNodes, setEdges]);

  // Reset node positions to original automatic layered layout
  const handleResetLayout = useCallback(() => {
    const { nodes: freshNodes, edges: freshEdges } = mapAutomatonToGraph(automaton, type, highlight);
    setNodes(freshNodes);
    setEdges(freshEdges);
    if (rfInstance) {
      setTimeout(() => {
        rfInstance.fitView({ padding: 0.25, duration: 400 });
      }, 50);
    }
  }, [automaton, type, highlight, rfInstance, setNodes, setEdges]);

  const handleFitView = useCallback(() => {
    if (rfInstance) {
      rfInstance.fitView({ padding: 0.25, duration: 400 });
    }
  }, [rfInstance]);

  if (!automaton || !automaton.states || automaton.states.length === 0) {
    return (
      <div 
        style={{ height }} 
        className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs"
      >
        <p>No states defined to visualize. Configure states in the NFA Builder.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col rounded-2xl bg-slate-900 border border-slate-700/70 overflow-hidden shadow-xl">
      {/* Canvas Top Bar */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 bg-slate-950/80 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${type === 'dfa' ? 'bg-indigo-400' : 'bg-blue-400'}`} />
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {nodes.length} states • {edges.length} transitions
            </span>
            <button
              onClick={handleResetLayout}
              title="Reset to automatic layered layout"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFitView}
              title="Fit to canvas"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* React Flow Container */}
      <div style={{ height }} className="w-full relative bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={setRfInstance}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2.0}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls 
            showInteractive={false}
            className="!bg-slate-900 !border-slate-700 !fill-slate-300 !rounded-xl overflow-hidden shadow-lg" 
          />

          <Panel position="bottom-right" className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1 text-[10px] text-slate-400 font-mono shadow-md backdrop-blur-sm hidden sm:block">
            Draggable nodes • Scroll to zoom
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
