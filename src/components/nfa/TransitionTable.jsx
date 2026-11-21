import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { Table, MousePointerClick, HelpCircle } from 'lucide-react';

export default function TransitionTable() {
  const { nfa, selectCellForEditing } = useAutomata();

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-400" />
            3. Dynamic NFA Transition Table
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mathematical representation of transition function δ: Q × Σ → P(Q). Click any cell to edit.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="text-blue-400 font-bold">→</span> Initial state
          </span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold">*</span> Final state
          </span>
          <span className="flex items-center gap-1">
            <span className="text-slate-500 font-bold">∅</span> Empty transition
          </span>
        </div>
      </div>

      {nfa.states.length === 0 || nfa.alphabet.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
          Define at least one state and one alphabet symbol to generate the transition table.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700/70">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-700 text-slate-300 font-semibold">
                <th className="py-3 px-4 w-44 font-mono text-slate-400 uppercase tracking-wider">
                  State \ Symbol
                </th>
                {nfa.alphabet.map((sym) => (
                  <th
                    key={sym}
                    className="py-3 px-4 font-mono text-center text-cyan-300 border-l border-slate-800"
                  >
                    <span className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/60 inline-block">
                      {sym}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {nfa.states.map((state) => {
                const isInitial = nfa.initialState === state;
                const isFinal = nfa.finalStates.includes(state);

                return (
                  <tr
                    key={state}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {/* State Header Cell */}
                    <td className="py-3.5 px-4 font-mono font-medium border-r border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 text-right font-bold">
                          {isInitial && <span className="text-blue-400" title="Initial state">→</span>}
                          {isFinal && <span className="text-emerald-400" title="Accepting/Final state">*</span>}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            isInitial && isFinal
                              ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40'
                              : isInitial
                              ? 'bg-blue-900/40 text-blue-200 border border-blue-500/40'
                              : isFinal
                              ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-200'
                          }`}
                        >
                          {state}
                        </span>
                      </div>
                    </td>

                    {/* Transition Cells for each alphabet symbol */}
                    {nfa.alphabet.map((sym) => {
                      const dests = nfa.transitions?.[state]?.[sym] || [];
                      const hasDests = dests.length > 0;

                      return (
                        <td
                          key={sym}
                          onClick={() => selectCellForEditing(state, sym)}
                          title={`Click to edit δ(${state}, ${sym})`}
                          className="py-3 px-4 text-center border-l border-slate-800 cursor-pointer hover:bg-indigo-950/30 transition-colors group"
                        >
                          {hasDests ? (
                            <div className="inline-flex flex-wrap items-center justify-center gap-1">
                              <span className="font-mono font-bold text-indigo-300 bg-indigo-950/50 group-hover:bg-indigo-900/70 border border-indigo-800/60 px-2.5 py-1 rounded-lg transition-colors">
                                {dests.join(', ')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-600 font-mono text-sm group-hover:text-slate-400">
                              ∅
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span className="flex items-center gap-1">
          <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
          Tip: Click any table cell above to quickly edit its target destination states.
        </span>
        <span className="font-mono text-slate-400">
          Table size: {nfa.states.length} × {nfa.alphabet.length}
        </span>
      </div>
    </div>
  );
}
