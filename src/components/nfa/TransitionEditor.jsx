import React, { useState, useEffect } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { 
  GitCommit, 
  ArrowRight, 
  Check, 
  Trash2, 
  Edit3, 
  Plus, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';

export default function TransitionEditor() {
  const { 
    nfa, 
    setTransition, 
    removeTransition, 
    editingTransition, 
    setEditingTransition 
  } = useAutomata();

  const [fromState, setFromState] = useState('');
  const [symbol, setSymbol] = useState('');
  const [toStates, setToStates] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Sync with context's editingTransition (e.g. when user clicks a table cell or preset)
  useEffect(() => {
    if (editingTransition.fromState && nfa.states.includes(editingTransition.fromState)) {
      setFromState(editingTransition.fromState);
    } else if (nfa.states.length > 0 && (!fromState || !nfa.states.includes(fromState))) {
      setFromState(nfa.states[0]);
    }

    if (editingTransition.symbol && nfa.alphabet.includes(editingTransition.symbol)) {
      setSymbol(editingTransition.symbol);
    } else if (nfa.alphabet.length > 0 && (!symbol || !nfa.alphabet.includes(symbol))) {
      setSymbol(nfa.alphabet[0]);
    }

    if (Array.isArray(editingTransition.toStates)) {
      setToStates(editingTransition.toStates.filter((s) => nfa.states.includes(s)));
    }
  }, [editingTransition, nfa.states, nfa.alphabet]);

  // When fromState or symbol changes, auto-load current destinations from NFA data
  const handleSourceChange = (newFrom) => {
    setFromState(newFrom);
    const existing = nfa.transitions?.[newFrom]?.[symbol] || [];
    setToStates([...existing]);
  };

  const handleSymbolChange = (newSym) => {
    setSymbol(newSym);
    const existing = nfa.transitions?.[fromState]?.[newSym] || [];
    setToStates([...existing]);
  };

  // Toggle a destination state
  const toggleDestination = (state) => {
    setToStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state].sort()
    );
  };

  const selectAllDestinations = () => {
    setToStates([...nfa.states].sort());
  };

  const clearDestinations = () => {
    setToStates([]);
  };

  // Save transition
  const handleSave = (e) => {
    e?.preventDefault();
    if (!fromState) {
      setMessage({ text: 'Please select a source state.', type: 'error' });
      return;
    }
    if (!symbol) {
      setMessage({ text: 'Please select an input symbol.', type: 'error' });
      return;
    }

    setTransition(fromState, symbol, toStates);
    setMessage({
      text: `Saved δ(${fromState}, ${symbol}) → ${toStates.length > 0 ? `{${toStates.join(', ')}}` : '∅'}`,
      type: 'success',
    });

    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Delete transition
  const handleDeleteCurrent = () => {
    if (fromState && symbol) {
      removeTransition(fromState, symbol);
      setToStates([]);
      setMessage({
        text: `Removed transition δ(${fromState}, ${symbol})`,
        type: 'info',
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Count total non-empty transitions
  const allDefinedTransitions = [];
  Object.entries(nfa.transitions || {}).forEach(([source, symbolMap]) => {
    Object.entries(symbolMap || {}).forEach(([sym, dests]) => {
      if (Array.isArray(dests) && dests.length > 0) {
        allDefinedTransitions.push({
          fromState: source,
          symbol: sym,
          toStates: dests,
        });
      }
    });
  });

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-indigo-400" />
            2. Transition Relation Editor (δ)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure state transitions: δ(source, symbol) → &#123;destinations&#125; (supports non-deterministic multi-state branches)
          </p>
        </div>

        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/60">
          {allDefinedTransitions.length} Active Branches
        </span>
      </div>

      {/* Transition Formulation Form */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Source State */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Source State (from):
            </label>
            <select
              value={fromState}
              onChange={(e) => handleSourceChange(e.target.value)}
              disabled={nfa.states.length === 0}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono disabled:opacity-50"
            >
              <option value="" disabled>-- Select Source State --</option>
              {nfa.states.map((s) => (
                <option key={s} value={s}>
                  {s} {nfa.initialState === s ? '(→ Initial)' : ''} {nfa.finalStates.includes(s) ? '(* Final)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Input Symbol */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              On Input Symbol:
            </label>
            <select
              value={symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              disabled={nfa.alphabet.length === 0}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono disabled:opacity-50"
            >
              <option value="" disabled>-- Select Symbol --</option>
              {nfa.alphabet.map((sym) => (
                <option key={sym} value={sym}>
                  '{sym}'
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination States Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Destination States P(Q)</span>
              <span className="text-[10px] text-indigo-400 lowercase font-mono">
                ({toStates.length} selected {toStates.length > 1 ? '• Non-deterministic branch!' : ''})
              </span>
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectAllDestinations}
                className="text-blue-400 hover:text-blue-300 text-[11px]"
              >
                Select All
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={clearDestinations}
                className="text-slate-400 hover:text-slate-300 text-[11px]"
              >
                Clear (∅)
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Click states below to select destination targets. Selecting multiple states enables non-determinism.
          </p>

          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[52px] items-center">
            {nfa.states.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No states available. Add states first.</span>
            ) : (
              nfa.states.map((st) => {
                const isSelected = toStates.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleDestination(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{st}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons & Status feedback */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!fromState || !symbol}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Transition</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteCurrent}
              disabled={!fromState || !symbol || toStates.length === 0}
              className="px-3 py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Set to ∅</span>
            </button>
          </div>

          {message.text && (
            <div
              className={`text-xs px-3 py-1.5 rounded-lg font-medium animate-fade-in ${
                message.type === 'success'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                  : message.type === 'error'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                  : 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </form>

      {/* List of Defined Non-Empty Transitions */}
      <div className="pt-4 border-t border-slate-700/60 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Active Transition Rules</span>
          <span className="text-[10px] text-slate-500 font-mono font-normal">
            {allDefinedTransitions.length} defined
          </span>
        </h3>

        {allDefinedTransitions.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-center">
            No active transitions defined yet. Use the editor above or load an example.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {allDefinedTransitions.map(({ fromState: src, symbol: sym, toStates: dst }) => (
              <div
                key={`${src}-${sym}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60 hover:border-indigo-500/50 transition-colors group text-xs"
              >
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-200">{src}</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">
                    '{sym}'
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="text-indigo-300 font-semibold">
                    {`{${dst.join(', ')}}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setFromState(src);
                      setSymbol(sym);
                      setToStates([...dst]);
                    }}
                    title="Edit transition"
                    className="p-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeTransition(src, sym)}
                    title="Delete transition"
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
