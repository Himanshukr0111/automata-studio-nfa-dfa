import React, { useState } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { Code2, Copy, Check, Eye, EyeOff } from 'lucide-react';

export default function NFAModelPreview() {
  const { nfa } = useAutomata();
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(nfa, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">4. NFA Formal Specification & Data Model</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {showJson ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showJson ? 'Hide JSON' : 'View JSON Model'}</span>
          </button>
        </div>
      </div>

      {/* Formal 5-tuple sets display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono">
          <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">States Set (Q)</span>
          <span className="text-blue-300 font-bold text-sm">
            {nfa.states.length > 0 ? `{${nfa.states.join(', ')}}` : '∅'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono">
          <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Alphabet (Σ)</span>
          <span className="text-cyan-300 font-bold text-sm">
            {nfa.alphabet.length > 0 ? `{${nfa.alphabet.join(', ')}}` : '∅'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono">
          <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Initial State (q0)</span>
          <span className="text-amber-300 font-bold text-sm">
            {nfa.initialState || '<not set>'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono">
          <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Final States (F)</span>
          <span className="text-emerald-300 font-bold text-sm">
            {nfa.finalStates.length > 0 ? `{${nfa.finalStates.join(', ')}}` : '∅'}
          </span>
        </div>
      </div>

      {/* Collapsible JSON Viewer */}
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
  );
}
