import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  DEFAULT_EXAMPLE_NFA,
  PRESET_NFAS,
  createEmptyNFA,
  validateNFA,
  addStateToNFA,
  removeStateFromNFA,
  addSymbolToNFA,
  removeSymbolFromNFA,
  setTransitionInNFA,
  removeTransitionFromNFA,
  cloneNFA,
} from '../core/nfa';
import { convertNfaToDfa } from '../algorithms/nfaToDfa';

const AutomataContext = createContext(null);

export function AutomataProvider({ children }) {
  const [nfa, setNfa] = useState(() => cloneNFA(DEFAULT_EXAMPLE_NFA));
  const [dfa, setDfa] = useState(null);
  const [conversionError, setConversionError] = useState(null);
  const [activeTab, setActiveTab] = useState('nfa'); // 'nfa', 'dfa', 'visualizer', 'simulation'
  
  // Selected transition in editor: { fromState: '', symbol: '', toStates: [] }
  const [editingTransition, setEditingTransition] = useState({
    fromState: '',
    symbol: '',
    toStates: [],
  });

  // Derived NFA validation
  const validation = useMemo(() => {
    return validateNFA(nfa);
  }, [nfa]);

  // Actions
  const loadExample = useCallback((presetId = 'example-standard') => {
    const preset = PRESET_NFAS.find((p) => p.id === presetId) || PRESET_NFAS[0];
    const newNfa = cloneNFA(preset.data);
    setNfa(newNfa);
    setDfa(null);
    setConversionError(null);
    setEditingTransition({
      fromState: newNfa.states[0] || '',
      symbol: newNfa.alphabet[0] || '',
      toStates: newNfa.transitions[newNfa.states[0]]?.[newNfa.alphabet[0]] || [],
    });
  }, []);

  const resetToEmpty = useCallback(() => {
    setNfa(createEmptyNFA());
    setDfa(null);
    setConversionError(null);
    setEditingTransition({ fromState: '', symbol: '', toStates: [] });
  }, []);

  const addState = useCallback((stateName) => {
    setNfa((prev) => addStateToNFA(prev, stateName));
    setDfa(null); // Invalidate outdated DFA
  }, []);

  const removeState = useCallback((stateName) => {
    setNfa((prev) => removeStateFromNFA(prev, stateName));
    setDfa(null);
  }, []);

  const addSymbol = useCallback((symbol) => {
    setNfa((prev) => addSymbolToNFA(prev, symbol));
    setDfa(null);
  }, []);

  const removeSymbol = useCallback((symbol) => {
    setNfa((prev) => removeSymbolFromNFA(prev, symbol));
    setDfa(null);
  }, []);

  const setInitialState = useCallback((stateName) => {
    setNfa((prev) => {
      const next = cloneNFA(prev);
      next.initialState = stateName;
      return next;
    });
    setDfa(null);
  }, []);

  const toggleFinalState = useCallback((stateName) => {
    setNfa((prev) => {
      const next = cloneNFA(prev);
      if (next.finalStates.includes(stateName)) {
        next.finalStates = next.finalStates.filter((s) => s !== stateName);
      } else {
        next.finalStates.push(stateName);
      }
      return next;
    });
    setDfa(null);
  }, []);

  const setTransition = useCallback((fromState, symbol, toStates) => {
    setNfa((prev) => setTransitionInNFA(prev, fromState, symbol, toStates));
    setDfa(null);
  }, []);

  const removeTransition = useCallback((fromState, symbol) => {
    setNfa((prev) => removeTransitionFromNFA(prev, fromState, symbol));
    setDfa(null);
  }, []);

  const selectCellForEditing = useCallback((fromState, symbol) => {
    const currentDest = nfa.transitions?.[fromState]?.[symbol] || [];
    setEditingTransition({
      fromState,
      symbol,
      toStates: [...currentDest],
    });
  }, [nfa]);

  // Convert NFA to DFA using Subset Construction algorithm
  const convertToDfa = useCallback((options = { includeDeadState: true }) => {
    const val = validateNFA(nfa);
    if (!val.isValid) {
      setConversionError(val.errors[0] || 'NFA is invalid. Fix errors before conversion.');
      return { success: false, errors: val.errors };
    }

    try {
      const generatedDfa = convertNfaToDfa(nfa, options);
      setDfa(generatedDfa);
      setConversionError(null);
      setActiveTab('dfa'); // Navigate directly to DFA view
      return { success: true, dfa: generatedDfa };
    } catch (err) {
      setConversionError(err.message || 'Error occurred during subset construction conversion.');
      return { success: false, error: err.message };
    }
  }, [nfa]);

  const value = {
    nfa,
    dfa,
    conversionError,
    validation,
    activeTab,
    setActiveTab,
    editingTransition,
    setEditingTransition,
    selectCellForEditing,
    loadExample,
    resetToEmpty,
    addState,
    removeState,
    addSymbol,
    removeSymbol,
    setInitialState,
    toggleFinalState,
    setTransition,
    removeTransition,
    convertToDfa,
  };

  return (
    <AutomataContext.Provider value={value}>
      {children}
    </AutomataContext.Provider>
  );
}

export function useAutomata() {
  const context = useContext(AutomataContext);
  if (!context) {
    throw new Error('useAutomata must be used within an AutomataProvider');
  }
  return context;
}
