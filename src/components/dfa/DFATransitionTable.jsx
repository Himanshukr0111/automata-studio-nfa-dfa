import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { Table, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatSubsetDisplay } from '../../algorithms/nfaToDfa';

export default function DFATransitionTable() {
  const { dfa } = useAutomata();

  if (!dfa) return null;

  // Find subset for any state id to show in cells
  const stateSubsetMap = new Map();
  dfa.stateObjects.forEach((s) => {
    stateSubsetMap.set(s.id, formatSubsetDisplay(s.subset));
  });

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-indigo-400" />
            DFA Transition Table (Deterministic)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete transition function δ': Q' × Σ → Q'. Every state has exactly one destination per symbol.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="text-blue-400 font-bold">→</span> Initial DFA State
          </span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold">*</span> Final / Accepting State
          </span>
          <span className="flex items-center gap-1">
            <span className="text-rose-400 font-bold">∅</span> Dead / Trap State
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700/70">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-700 text-slate-300 font-semibold">
              <th className="py-3.5 px-4 w-60 font-mono text-slate-400 uppercase tracking-wider">
                DFA State (Subset Q)
              </th>
              {dfa.alphabet.map((sym) => (
                <th
                  key={sym}
                  className="py-3.5 px-4 font-mono text-center text-cyan-300 border-l border-slate-800"
                >
                  <span className="px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/60 inline-block font-bold">
                    {sym}
                  </span>
                </th>
              ))}
              <th className="py-3.5 px-4 w-28 text-center text-slate-400 uppercase tracking-wider border-l border-slate-800">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
            {dfa.stateObjects.map((stateObj) => {
              const { id, isInitial, isFinal, isEmpty, subset } = stateObj;
              const formattedSubset = formatSubsetDisplay(subset);

              return (
                <tr
                  key={id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isFinal ? 'bg-emerald-950/10' : ''
                  }`}
                >
                  {/* State Name & Subset Definition */}
                  <td className="py-3.5 px-4 font-mono font-medium border-r border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 text-right font-bold">
                        {isInitial && <span className="text-blue-400" title="Initial DFA state">→</span>}
                        {isFinal && <span className="text-emerald-400" title="Accepting/Final DFA state">*</span>}
                        {isEmpty && <span className="text-rose-400" title="Dead/Trap state">∅</span>}
                      </span>

                      <div className="flex items-baseline gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            isFinal
                              ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-500/50'
                              : isInitial
                              ? 'bg-blue-900/40 text-blue-200 border border-blue-500/50'
                              : isEmpty
                              ? 'bg-rose-950/50 text-rose-300 border border-rose-800/60'
                              : 'bg-slate-800 text-slate-200'
                          }`}
                        >
                          {id}
                        </span>

                        <span className="text-[11px] text-slate-400 font-normal">
                          = {formattedSubset}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Transition destinations for each alphabet symbol */}
                  {dfa.alphabet.map((sym) => {
                    const targetId = dfa.transitions?.[id]?.[sym];
                    const targetSubset = stateSubsetMap.get(targetId) || '∅';
                    const isTargetFinal = dfa.finalStates.includes(targetId);

                    return (
                      <td
                        key={sym}
                        className="py-3 px-4 text-center border-l border-slate-800"
                      >
                        {targetId ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 font-mono shadow-sm">
                            <span
                              className={`font-bold ${
                                isTargetFinal ? 'text-emerald-400' : 'text-blue-300'
                              }`}
                            >
                              {targetId}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {targetSubset}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-mono">∅</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Accepting / Rejecting Status Badge */}
                  <td className="py-3 px-4 text-center border-l border-slate-800">
                    {isFinal ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 border border-emerald-700/60 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Accepting</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        <span>Rejecting</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Deterministic property: Exactly one valid transition exists per (state, symbol) tuple.</span>
        <span className="font-mono text-slate-400">
          DFA Size: {dfa.states.length} states × {dfa.alphabet.length} symbols
        </span>
      </div>
    </div>
  );
}
