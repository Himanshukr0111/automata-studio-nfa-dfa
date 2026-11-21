import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function NFAValidationBanner() {
  const { validation, nfa } = useAutomata();

  if (validation.errors.length > 0) {
    return (
      <div className="rounded-2xl bg-rose-950/40 border border-rose-800/70 p-4 text-rose-200 shadow-sm animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-100">
              NFA Configuration Invalid ({validation.errors.length} Error{validation.errors.length > 1 ? 's' : ''})
            </h4>
            <ul className="list-disc list-inside text-xs space-y-1 text-rose-300">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (validation.warnings.length > 0) {
    return (
      <div className="rounded-2xl bg-amber-950/40 border border-amber-800/70 p-4 text-amber-200 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-100">Configuration Notice</h4>
            <ul className="list-disc list-inside text-xs space-y-1 text-amber-300">
              {validation.warnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-emerald-950/30 border border-emerald-800/50 p-3.5 text-emerald-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-emerald-300">
          Automaton is formally valid and ready for subset construction conversion!
        </span>
      </div>
      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/50 hidden sm:inline">
        |Q|={nfa.states.length}, |Σ|={nfa.alphabet.length}, |F|={nfa.finalStates.length}
      </span>
    </div>
  );
}
