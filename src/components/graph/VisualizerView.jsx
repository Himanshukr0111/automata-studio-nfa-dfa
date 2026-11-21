import React, { useState } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import AutomataGraphCanvas from './AutomataGraphCanvas';
import { 
  Network, 
  GitFork, 
  Table, 
  Columns, 
  Sparkles, 
  ArrowRight,
  Info,
  CheckCircle2,
  CircleDot
} from 'lucide-react';

export default function VisualizerView() {
  const { nfa, dfa, convertToDfa, validation } = useAutomata();
  const [viewMode, setViewMode] = useState('side-by-side'); // 'nfa' | 'dfa' | 'side-by-side'

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800/60 to-indigo-900/40 border border-blue-500/20 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Network className="w-3.5 h-3.5" />
            <span>Interactive State Diagram Visualizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Automata Graph Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Interactive, draggable state machine diagrams powered by React Flow. Inspect NFA branches, 
            deterministic DFA states, and transition flows with textbook-accurate formal notation.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner self-start sm:self-center">
          <button
            onClick={() => setViewMode('nfa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'nfa'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>NFA Graph</span>
          </button>

          <button
            onClick={() => setViewMode('dfa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'dfa'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>DFA Graph</span>
          </button>

          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Main Graph Display Area */}
      {viewMode === 'nfa' && (
        <AutomataGraphCanvas
          automaton={nfa}
          type="nfa"
          title="NFA State Diagram"
          subtitle={`|Q| = ${nfa.states.length} states • |Σ| = ${nfa.alphabet.length} symbols • Initial: ${nfa.initialState || 'none'}`}
          height="580px"
        />
      )}

      {viewMode === 'dfa' && (
        dfa ? (
          <AutomataGraphCanvas
            automaton={dfa}
            type="dfa"
            title="Generated DFA State Diagram"
            subtitle={`|Q'| = ${dfa.states.length} states • |F'| = ${dfa.finalStates.length} accepting • Initial: ${dfa.initialState}`}
            height="580px"
          />
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm shadow-md">
            <Table className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-white mb-1">DFA Graph Not Available Yet</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
              Convert the current NFA using the Subset Construction algorithm to generate and visualize its equivalent deterministic state diagram.
            </p>
            <button
              onClick={() => convertToDfa()}
              disabled={!validation.isValid}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 mx-auto transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate DFA Graph Now</span>
            </button>
          </div>
        )
      )}

      {viewMode === 'side-by-side' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* NFA Side */}
            <div className="space-y-2">
              <AutomataGraphCanvas
                automaton={nfa}
                type="nfa"
                title="Original NFA Graph"
                subtitle={`Non-deterministic transitions with branching`}
                height="520px"
              />
            </div>

            {/* DFA Side */}
            <div className="space-y-2">
              {dfa ? (
                <AutomataGraphCanvas
                  automaton={dfa}
                  type="dfa"
                  title="Generated DFA Graph"
                  subtitle={`Deterministic subsets: |Q'| = ${dfa.states.length}`}
                  height="520px"
                />
              ) : (
                <div className="h-[520px] rounded-2xl bg-slate-900 border border-slate-700/70 flex flex-col items-center justify-center p-8 text-center">
                  <Table className="w-10 h-10 text-indigo-400 mb-3 opacity-50" />
                  <h4 className="text-sm font-bold text-white mb-1">DFA Not Generated</h4>
                  <p className="text-xs text-slate-400 max-w-xs mb-4">
                    Run subset construction to compare the NFA and DFA side-by-side.
                  </p>
                  <button
                    onClick={() => convertToDfa()}
                    disabled={!validation.isValid}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Convert to DFA</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Formal Automata Diagram Legend */}
      <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span>Automata Graph Notation & Diagram Legend</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Legend 1 */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-500/40">
              Start &rarr;
            </span>
            <span className="text-[11px] text-slate-300">Initial State</span>
          </div>

          {/* Legend 2 */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-5 h-5 rounded-full border border-emerald-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-emerald-400" />
            </div>
            <span className="text-[11px] text-slate-300">Final (Double-Circle)</span>
          </div>

          {/* Legend 3 */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-5 h-5 rounded-full border border-blue-400" />
            <span className="text-[11px] text-slate-300">Standard State</span>
          </div>

          {/* Legend 4 */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-5 h-5 rounded-full border border-rose-500 text-rose-400 flex items-center justify-center text-[10px] font-bold">
              &empty;
            </div>
            <span className="text-[11px] text-slate-300">Dead / Trap State</span>
          </div>

          {/* Legend 5 */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-mono text-[10px] text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-cyan-500/50">
              &lsquo;0, 1&rsquo;
            </span>
            <span className="text-[11px] text-slate-300">Transition Symbol</span>
          </div>

          {/* Legend 6 */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-base text-blue-400 font-bold">&#8634;</span>
            <span className="text-[11px] text-slate-300">Self-Loop Transition</span>
          </div>
        </div>
      </div>
    </div>
  );
}
