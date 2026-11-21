import React, { useState } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  Flag, 
  Layers, 
  KeyRound,
  Check
} from 'lucide-react';

export default function NFAConfigCard() {
  const { 
    nfa, 
    addState, 
    removeState, 
    addSymbol, 
    removeSymbol, 
    setInitialState, 
    toggleFinalState 
  } = useAutomata();

  const [newStateInput, setNewStateInput] = useState('');
  const [newSymbolInput, setNewSymbolInput] = useState('');
  const [inputError, setInputError] = useState({ state: '', symbol: '' });

  // Handle adding state
  const handleAddState = (e) => {
    e?.preventDefault();
    const trimmed = newStateInput.trim();
    if (!trimmed) {
      setInputError((prev) => ({ ...prev, state: 'State name cannot be empty.' }));
      return;
    }
    if (nfa.states.includes(trimmed)) {
      setInputError((prev) => ({ ...prev, state: `State "${trimmed}" already exists.` }));
      return;
    }
    addState(trimmed);
    setNewStateInput('');
    setInputError((prev) => ({ ...prev, state: '' }));
  };

  // Quick auto-generator for next state (e.g. q0 -> q1 -> q2 -> q3)
  const handleAutoAddState = () => {
    let index = nfa.states.length;
    let candidate = `q${index}`;
    while (nfa.states.includes(candidate)) {
      index++;
      candidate = `q${index}`;
    }
    addState(candidate);
    setInputError((prev) => ({ ...prev, state: '' }));
  };

  // Handle adding alphabet symbol
  const handleAddSymbol = (e) => {
    e?.preventDefault();
    const trimmed = newSymbolInput.trim();
    if (!trimmed) {
      setInputError((prev) => ({ ...prev, symbol: 'Symbol cannot be empty.' }));
      return;
    }
    if (nfa.alphabet.includes(trimmed)) {
      setInputError((prev) => ({ ...prev, symbol: `Symbol "${trimmed}" already exists.` }));
      return;
    }
    addSymbol(trimmed);
    setNewSymbolInput('');
    setInputError((prev) => ({ ...prev, symbol: '' }));
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            1. Automaton Formal Definition
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Define the set of states Q, input alphabet Σ, initial state q0, and accepting states F
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STATES (Q) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <span>States Set (Q)</span>
              <span className="text-[10px] text-blue-400 lowercase font-mono">
                ({nfa.states.length} states)
              </span>
            </label>
            <button
              type="button"
              onClick={handleAutoAddState}
              className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Auto Next (q{nfa.states.length})
            </button>
          </div>

          <form onSubmit={handleAddState} className="flex gap-2">
            <input
              type="text"
              value={newStateInput}
              onChange={(e) => {
                setNewStateInput(e.target.value);
                if (inputError.state) setInputError((prev) => ({ ...prev, state: '' }));
              }}
              placeholder="e.g. q3, A, S1"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {inputError.state && (
            <p className="text-[11px] text-rose-400 font-medium">{inputError.state}</p>
          )}

          {/* State Badges List */}
          <div className="flex flex-wrap gap-2 min-h-[42px] p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            {nfa.states.length === 0 ? (
              <span className="text-xs text-slate-500 italic flex items-center">
                No states defined yet. Add states above.
              </span>
            ) : (
              nfa.states.map((state) => {
                const isInitial = nfa.initialState === state;
                const isFinal = nfa.finalStates.includes(state);
                return (
                  <div
                    key={state}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      isInitial && isFinal
                        ? 'bg-purple-900/40 text-purple-200 border border-purple-500/50'
                        : isInitial
                        ? 'bg-blue-900/40 text-blue-200 border border-blue-500/50'
                        : isFinal
                        ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-500/50'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isInitial && <span className="text-[10px] text-blue-400 font-bold" title="Initial state">→</span>}
                    {isFinal && <span className="text-[10px] text-emerald-400 font-bold" title="Final state">*</span>}
                    <span>{state}</span>
                    <button
                      type="button"
                      onClick={() => removeState(state)}
                      title={`Remove state ${state}`}
                      className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded p-0.5 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ALPHABET (Σ) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Input Alphabet (Σ)</span>
              <span className="text-[10px] text-cyan-400 lowercase font-mono">
                ({nfa.alphabet.length} symbols)
              </span>
            </label>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>Quick:</span>
              {['0', '1', 'a', 'b'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => addSymbol(sym)}
                  disabled={nfa.alphabet.includes(sym)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-mono text-cyan-300"
                >
                  +{sym}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddSymbol} className="flex gap-2">
            <input
              type="text"
              value={newSymbolInput}
              onChange={(e) => {
                setNewSymbolInput(e.target.value);
                if (inputError.symbol) setInputError((prev) => ({ ...prev, symbol: '' }));
              }}
              placeholder="e.g. 0, 1, a, b"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {inputError.symbol && (
            <p className="text-[11px] text-rose-400 font-medium">{inputError.symbol}</p>
          )}

          {/* Alphabet Badges List */}
          <div className="flex flex-wrap gap-2 min-h-[42px] p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            {nfa.alphabet.length === 0 ? (
              <span className="text-xs text-slate-500 italic flex items-center">
                No alphabet symbols defined yet. Add symbols above.
              </span>
            ) : (
              nfa.alphabet.map((sym) => (
                <div
                  key={sym}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-cyan-950/40 text-cyan-200 border border-cyan-800/60"
                >
                  <span>{sym}</span>
                  <button
                    type="button"
                    onClick={() => removeSymbol(sym)}
                    title={`Remove symbol "${sym}"`}
                    className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded p-0.5 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* INITIAL STATE & FINAL STATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700/60">
        {/* Initial State (q0) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>Initial State (q0)</span>
          </label>
          <p className="text-[11px] text-slate-400">
            The unique entry point where the automaton starts evaluation.
          </p>

          <select
            value={nfa.initialState || ''}
            onChange={(e) => setInitialState(e.target.value)}
            disabled={nfa.states.length === 0}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono disabled:opacity-50"
          >
            <option value="" disabled>
              {nfa.states.length === 0 ? '-- No states available --' : '-- Select initial state --'}
            </option>
            {nfa.states.map((s) => (
              <option key={s} value={s}>
                {s} {nfa.finalStates.includes(s) ? '(* Final)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Final States (F) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Flag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Final / Accepting States (F)</span>
            </label>
            <span className="text-[10px] text-emerald-400 font-mono">
              ({nfa.finalStates.length} of {nfa.states.length} accepting)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Click states below to toggle accepting status (*).
          </p>

          <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[42px] items-center">
            {nfa.states.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No states available</span>
            ) : (
              nfa.states.map((s) => {
                const isFinal = nfa.finalStates.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleFinalState(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all active:scale-95 ${
                      isFinal
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-1 ring-emerald-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isFinal && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{s}</span>
                    {isFinal && <span className="text-[10px] text-emerald-200">*</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
