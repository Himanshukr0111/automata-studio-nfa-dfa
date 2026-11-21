import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ArrowRight } from 'lucide-react';

function StateNode({ data, selected }) {
  const { 
    label, 
    sublabel, 
    isInitial = false, 
    isFinal = false, 
    isEmpty = false,
    isActiveSource = false,
    isActiveTarget = false,
    isEmphasizedFinal = false,
    type = 'nfa' 
  } = data;

  // Active highlight classes during walkthrough steps
  let highlightRing = '';
  if (isActiveSource) {
    highlightRing = 'ring-4 ring-amber-400 shadow-lg shadow-amber-500/30 scale-110 z-30';
  } else if (isActiveTarget) {
    highlightRing = 'ring-4 ring-cyan-400 shadow-lg shadow-cyan-500/30 scale-110 z-30';
  } else if (isEmphasizedFinal) {
    highlightRing = 'ring-4 ring-emerald-400 shadow-xl shadow-emerald-500/40 scale-105 z-30';
  }

  return (
    <div className={`relative group cursor-grab active:cursor-grabbing select-none transition-transform duration-300 ${highlightRing}`}>
      {/* Invisible Handles on all 4 cardinal directions */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left-target" 
        className="!w-2 !h-2 !bg-transparent !border-0 !opacity-0" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right-source" 
        className="!w-2 !h-2 !bg-transparent !border-0 !opacity-0" 
      />
      <Handle 
        type="source" 
        position={Position.Top} 
        id="top-source" 
        className="!w-2 !h-2 !bg-transparent !border-0 !opacity-0" 
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top-target" 
        className="!w-2 !h-2 !bg-transparent !border-0 !opacity-0" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom-source" 
        className="!w-2 !h-2 !bg-transparent !border-0 !opacity-0" 
      />
      <Handle 
        type="target" 
        position={Position.Bottom} 
        id="bottom-target" 
        className="!w-2 !h-2 !bg-transparent !border-0 !opacity-0" 
      />

      {/* Start Arrow for Initial State */}
      {isInitial && (
        <div 
          className="absolute -left-16 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-mono font-bold text-blue-400 bg-slate-950/90 px-2 py-0.5 rounded-md border border-blue-500/50 shadow-md shadow-blue-500/10 pointer-events-none z-10 animate-pulse"
          title="Initial Start State"
        >
          <span>Start</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      {/* Step Highlighting Indicator Badges */}
      {isActiveSource && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow pointer-events-none whitespace-nowrap z-20">
          Source
        </div>
      )}
      {isActiveTarget && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow pointer-events-none whitespace-nowrap z-20">
          Target
        </div>
      )}

      {/* Node Circle Visual Container */}
      {isFinal ? (
        /* Double-Circle Styling for Accepting/Final State */
        <div 
          className={`w-[84px] h-[84px] rounded-full border-2 p-1 flex items-center justify-center transition-all duration-300 ${
            selected 
              ? 'border-emerald-300 shadow-lg shadow-emerald-500/30 scale-105' 
              : 'border-emerald-400/90 shadow-md shadow-emerald-500/15'
          } bg-slate-900`}
        >
          <div className="w-full h-full rounded-full border-2 border-emerald-400/90 bg-emerald-950/40 flex flex-col items-center justify-center text-center px-1">
            <span className="font-mono font-extrabold text-sm text-emerald-200 tracking-tight leading-none">
              {label}
            </span>
            {sublabel && (
              <span 
                className="font-mono text-[10px] text-emerald-300/80 mt-1 max-w-[62px] truncate leading-none" 
                title={sublabel}
              >
                {sublabel}
              </span>
            )}
          </div>
        </div>
      ) : isEmpty ? (
        /* Dead / Trap State Styling */
        <div 
          className={`w-[80px] h-[80px] rounded-full border-2 flex flex-col items-center justify-center text-center p-1 transition-all duration-300 ${
            selected 
              ? 'border-rose-400 shadow-lg shadow-rose-500/30 scale-105' 
              : 'border-rose-500/80 shadow-md shadow-rose-500/10'
          } bg-slate-900`}
        >
          <span className="font-mono font-extrabold text-sm text-rose-300 leading-none">
            {label}
          </span>
          <span className="font-mono text-xs text-rose-400 font-bold mt-1 leading-none">
            ∅
          </span>
        </div>
      ) : (
        /* Standard Automata State Circle */
        <div 
          className={`w-[80px] h-[80px] rounded-full border-2 flex flex-col items-center justify-center text-center p-1 transition-all duration-300 ${
            selected 
              ? 'border-blue-400 shadow-lg shadow-blue-500/30 scale-105' 
              : isInitial
              ? 'border-blue-500/90 shadow-md shadow-blue-500/20 bg-blue-950/30'
              : 'border-slate-600 hover:border-slate-400 shadow-md shadow-slate-900/40'
          } bg-slate-900`}
        >
          <span className="font-mono font-extrabold text-sm text-slate-100 leading-none">
            {label}
          </span>
          {sublabel && (
            <span 
              className="font-mono text-[10px] text-blue-300/80 mt-1 max-w-[62px] truncate leading-none" 
              title={sublabel}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(StateNode);
