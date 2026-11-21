import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import {
  GitBranch,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Table
} from 'lucide-react';

export default function Header() {
  const { nfa, dfa, validation, loadExample, resetToEmpty, convertToDfa, activeTab, setActiveTab } = useAutomata();

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                Automata Studio
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                v1.0 Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              NFA to DFA Conversion Simulator • Automata Theory & Computability
            </p>
          </div>
        </div>

        {/* Center: Validation / DFA status */}
        <div className="hidden md:flex items-center gap-2">
          {validation.isValid ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Valid NFA ({nfa.states.length} states, {nfa.alphabet.length} symbols)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{validation.errors.length} NFA Error(s)</span>
            </div>
          )}

          {dfa && (
            <button
              onClick={() => setActiveTab('dfa')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${activeTab === 'dfa'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/60'
                }`}
            >
              <Table className="w-3.5 h-3.5 text-indigo-300" />
              <span>DFA: {dfa.states.length} States</span>
            </button>
          )}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => convertToDfa()}
            disabled={!validation.isValid}
            title="Convert NFA to DFA using Subset Construction"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <span>Convert to DFA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => loadExample('example-standard')}
            title="Load the standard textbook example NFA"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Example</span>
          </button>

          <button
            onClick={resetToEmpty}
            title="Clear all states, alphabet symbols and transitions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </header>
  );
}
