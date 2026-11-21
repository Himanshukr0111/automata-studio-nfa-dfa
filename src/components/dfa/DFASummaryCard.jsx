import React, { useState } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { 
  Binary, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  GitBranch,
  ArrowRight
} from 'lucide-react';
import { formatSubsetDisplay } from '../../algorithms/nfaToDfa';

export default function DFASummaryCard() {
  const { dfa, nfa } = useAutomata();
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!dfa) return null;

  const jsonString = JSON.stringify(dfa, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metrics & Theoretical Definition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            State Space Size
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-white font-mono">
              |Q'| = {dfa.states.length}
            </span>
            <span className="text-xs text-slate-400">
              (from NFA |Q| = {nfa.states.length})
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Reachable power-set subsets
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Input Alphabet
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-cyan-300 font-mono">
              |Σ| = {dfa.alphabet.length}
            </span>
            <span className="text-xs text-slate-400">
              {`{${dfa.alphabet.join(', ')}}`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Preserved from input NFA
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Initial State
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-blue-400 font-mono">
              {dfa.initialState}
            </span>
            <span className="text-xs text-slate-400">
              = {formatSubsetDisplay(dfa.stateObjects.find(s => s.id === dfa.initialState)?.subset)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            ε-closure of initial state q0
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Final / Accepting States
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              |F'| = {dfa.finalStates.length}
            </span>
            <span className="text-xs text-slate-400">
              {dfa.finalStates.length > 0 ? `{${dfa.finalStates.join(', ')}}` : '∅'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Subsets containing any final state
          </p>
        </div>
      </div>

      {/* Subset Mapping Breakdown Card */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Subset Composition & Equivalence Mapping
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Powerset Mapping P(Q) → Q'
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dfa.stateObjects.map((st) => (
            <div
              key={st.id}
              className={`p-3.5 rounded-xl border transition-all ${
                st.isFinal
                  ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-100'
                  : st.isInitial
                  ? 'bg-blue-950/20 border-blue-800/60 text-blue-100'
                  : st.isEmpty
                  ? 'bg-rose-950/20 border-rose-800/60 text-rose-100'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-extrabold text-base text-white">{st.id}</span>
                  {st.isInitial && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/60">
                      Initial
                    </span>
                  )}
                  {st.isFinal && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                      Accepting
                    </span>
                  )}
                  {st.isEmpty && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/60">
                      Dead / Trap
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <span className="text-slate-500 font-sans text-[11px]">Subset:</span>
                <span className="font-bold text-indigo-300">
                  {formatSubsetDisplay(st.subset)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Model Viewer */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Generated DFA Data Structure</h3>
          </div>

          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {showJson ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showJson ? 'Hide JSON' : 'View JSON Model'}</span>
          </button>
        </div>

        {showJson && (
          <div className="relative mt-3 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-72 animate-fade-in">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <pre>{jsonString}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
