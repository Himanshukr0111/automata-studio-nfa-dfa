import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import DFATransitionTable from './DFATransitionTable';
import DFASummaryCard from './DFASummaryCard';
import {
  Table,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export default function DFAView() {
  const { dfa, nfa, convertToDfa, conversionError, setActiveTab, validation } = useAutomata();

  // If no DFA is generated yet, show prompt to convert
  if (!dfa) {
    return (
      <div className="space-y-6">
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm shadow-lg max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <Table className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">
            Deterministic Finite Automaton (DFA) Generator
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Convert the current Non-deterministic Finite Automaton into an equivalent DFA using the
            formal <strong>Subset Construction (Powerset Construction)</strong> algorithm.
          </p>

          {conversionError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800/70 text-rose-300 text-xs text-left flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-bold">Conversion Error:</p>
                <p>{conversionError}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => convertToDfa()}
              disabled={!validation.isValid}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate DFA (Subset Construction)</span>
            </button>

            <button
              onClick={() => setActiveTab('nfa')}
              className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white text-sm font-medium rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to NFA Editor</span>
            </button>
          </div>
        </div>

        {/* Algorithm Overview Educational Note */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-3">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>How Subset Construction Operates</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
            <li>The initial DFA state is formed by computing the &epsilon;-closure of the NFA start state: q&apos;0 = &epsilon;-closure(&#123;q0&#125;).</li>
            <li>For every generated DFA state S &sube; Q and input symbol a &isin; &Sigma;, find all reachable states: T = &epsilon;-closure(&#8899; &delta;(p, a)).</li>
            <li>If subset T is newly discovered, it is added to the queue of discovered DFA states.</li>
            <li>A DFA state is marked as accepting (*) if its subset contains at least one NFA accepting state (S &cap; F &ne; &empty;).</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-800/60 to-slate-800/40 border border-indigo-500/20 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DFA Generated Successfully</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Generated DFA
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Derived using the Subset Construction algorithm. Every transition is strictly deterministic with no branching or ambiguous destinations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('tester')}
            title="Open string acceptance simulator"
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all"
          >
            <span>Test Strings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('walkthrough')}
            title="Open step-by-step conversion player"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-emerald-300 hover:text-white text-xs font-semibold rounded-xl border border-emerald-800/60 hover:border-emerald-500/60 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Step Walkthrough</span>
          </button>

          <button
            onClick={() => setActiveTab('visualizer')}
            title="Open interactive state diagrams"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-300 hover:text-white text-xs font-semibold rounded-xl border border-cyan-800/60 hover:border-cyan-500/60 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>View Graph</span>
          </button>

          <button
            onClick={() => convertToDfa()}
            title="Re-run subset construction"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-run</span>
          </button>

          <button
            onClick={() => setActiveTab('nfa')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit NFA</span>
          </button>
        </div>
      </div>

      {/* Generated DFA Transition Table */}
      <DFATransitionTable />

      {/* Summary, Metrics & Subset Mapping */}
      <DFASummaryCard />
    </div>
  );
}
