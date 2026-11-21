import React from 'react';
import NFAValidationBanner from './NFAValidationBanner';
import NFAConfigCard from './NFAConfigCard';
import TransitionEditor from './TransitionEditor';
import TransitionTable from './TransitionTable';
import NFAModelPreview from './NFAModelPreview';
import { GitFork, Sparkles, ArrowRight, Table } from 'lucide-react';
import { useAutomata } from '../../context/AutomataContext';

export default function NFABuilder() {
  const { loadExample, convertToDfa, validation, dfa, setActiveTab } = useAutomata();

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800/60 to-slate-800/40 border border-blue-500/20 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <GitFork className="w-3.5 h-3.5" />
            <span>Interactive Automata Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NFA Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Construct custom Non-deterministic Finite Automata (NFA) by specifying the 5-tuple, 
            branching transitions, and accepting states. The transition table updates dynamically in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('visualizer')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-300 text-xs font-semibold rounded-xl border border-cyan-800/60 hover:border-cyan-500/60 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>View Graph</span>
          </button>

          <button
            onClick={() => loadExample('example-standard')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Load Example NFA</span>
          </button>

          <button
            onClick={() => convertToDfa()}
            disabled={!validation.isValid}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
          >
            <span>Convert to DFA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Validation Banner */}
      <NFAValidationBanner />

      {/* Section 1: States, Alphabet, Initial State, Final States */}
      <NFAConfigCard />

      {/* Section 2: Transitions Relation Editor */}
      <TransitionEditor />

      {/* Section 3: Dynamic NFA Transition Table */}
      <TransitionTable />

      {/* Conversion Call-to-Action Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900 border border-indigo-700/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-indigo-400" />
            Run Subset Construction Algorithm
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Transform this non-deterministic model into an equivalent Deterministic Finite Automaton (DFA).
            The engine computes $\epsilon$-closures, combines power-set branches, and generates the canonical DFA transition table.
          </p>
        </div>

        <button
          onClick={() => convertToDfa()}
          disabled={!validation.isValid}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <span>Convert to DFA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Section 4: Formal 5-tuple & Raw JSON Data Model */}
      <NFAModelPreview />
    </div>
  );
}
