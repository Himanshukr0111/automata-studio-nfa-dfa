/**
 * NFA (Non-deterministic Finite Automaton) Core Data Model & Utilities
 * 
 * Formal Definition: M = (Q, Σ, δ, q0, F)
 * - Q: Finite set of states
 * - Σ: Finite set of input symbols (alphabet)
 * - δ: Transition function Q × (Σ ∪ {ε}) → P(Q)
 * - q0: Initial state (q0 ∈ Q)
 * - F: Set of accepting/final states (F ⊆ Q)
 */

export const DEFAULT_EXAMPLE_NFA = {
  states: ['q0', 'q1', 'q2'],
  alphabet: ['0', '1'],
  initialState: 'q0',
  finalStates: ['q2'],
  transitions: {
    q0: {
      '0': ['q0', 'q1'],
      '1': ['q0'],
    },
    q1: {
      '0': [],
      '1': ['q2'],
    },
    q2: {
      '0': [],
      '1': [],
    },
  },
};

export const PRESET_NFAS = [
  {
    id: 'example-standard',
    name: 'Standard NFA (Ends with 01 or has 00)',
    description: 'q0 branches on 0 to {q0, q1}; q1 reaches accepting state q2 on 1.',
    data: DEFAULT_EXAMPLE_NFA,
  },
  {
    id: 'example-ends-with-01',
    name: 'Strings Ending with "01"',
    description: 'Accepts all binary strings ending with "01".',
    data: {
      states: ['q0', 'q1', 'q2'],
      alphabet: ['0', '1'],
      initialState: 'q0',
      finalStates: ['q2'],
      transitions: {
        q0: { '0': ['q0', 'q1'], '1': ['q0'] },
        q1: { '1': ['q2'] },
        q2: {},
      },
    },
  },
  {
    id: 'example-contains-00',
    name: 'Strings Containing Substring "00"',
    description: 'Accepts binary strings containing at least one consecutive pair of zeros.',
    data: {
      states: ['q0', 'q1', 'q2'],
      alphabet: ['0', '1'],
      initialState: 'q0',
      finalStates: ['q2'],
      transitions: {
        q0: { '0': ['q0', 'q1'], '1': ['q0'] },
        q1: { '0': ['q2'] },
        q2: { '0': ['q2'], '1': ['q2'] },
      },
    },
  },
];

/**
 * Creates a clean, empty NFA
 */
export function createEmptyNFA() {
  return {
    states: [],
    alphabet: [],
    initialState: '',
    finalStates: [],
    transitions: {},
  };
}

/**
 * Deep clone an NFA object
 */
export function cloneNFA(nfa) {
  return JSON.parse(JSON.stringify(nfa));
}

/**
 * Validates the complete NFA 5-tuple
 * Returns an object with errors, warnings, and isValid flag
 */
export function validateNFA(nfa) {
  const errors = [];
  const warnings = [];

  if (!nfa) {
    return { isValid: false, errors: ['NFA definition is missing.'], warnings: [] };
  }

  // 1. Validate States
  if (!Array.isArray(nfa.states) || nfa.states.length === 0) {
    errors.push('State set Q cannot be empty. Please define at least one state.');
  } else {
    const seenStates = new Set();
    nfa.states.forEach((state) => {
      if (!state || state.trim() === '') {
        errors.push('State names cannot be empty or whitespace.');
      } else if (seenStates.has(state)) {
        errors.push(`Duplicate state detected: "${state}". Each state name must be unique.`);
      }
      seenStates.add(state);
    });
  }

  // 2. Validate Alphabet
  if (!Array.isArray(nfa.alphabet) || nfa.alphabet.length === 0) {
    errors.push('Alphabet Σ cannot be empty. Please define at least one symbol.');
  } else {
    const seenSymbols = new Set();
    nfa.alphabet.forEach((sym) => {
      if (!sym || sym.trim() === '') {
        errors.push('Alphabet symbols cannot be empty.');
      } else if (seenSymbols.has(sym)) {
        errors.push(`Duplicate alphabet symbol detected: "${sym}".`);
      }
      seenSymbols.add(sym);
    });
  }

  const validStateSet = new Set(nfa.states || []);
  const validAlphabetSet = new Set(nfa.alphabet || []);

  // 3. Validate Initial State
  if (!nfa.initialState) {
    errors.push('Missing initial state q0. Please specify an entry state.');
  } else if (!validStateSet.has(nfa.initialState)) {
    errors.push(`Initial state "${nfa.initialState}" does not exist in the defined states list Q.`);
  }

  // 4. Validate Final States
  if (!Array.isArray(nfa.finalStates)) {
    errors.push('Final states F must be an array.');
  } else {
    nfa.finalStates.forEach((finalState) => {
      if (!validStateSet.has(finalState)) {
        errors.push(`Final state "${finalState}" is not included in the defined states list Q.`);
      }
    });

    if (nfa.finalStates.length === 0) {
      warnings.push('No final/accepting states defined. This automaton will reject all input strings.');
    }
  }

  // 5. Validate Transitions
  if (nfa.transitions && typeof nfa.transitions === 'object') {
    Object.entries(nfa.transitions).forEach(([fromState, symbolMap]) => {
      if (!validStateSet.has(fromState)) {
        errors.push(`Transition source state "${fromState}" does not exist in states list.`);
      }

      if (symbolMap && typeof symbolMap === 'object') {
        Object.entries(symbolMap).forEach(([symbol, toStates]) => {
          if (!validAlphabetSet.has(symbol) && symbol !== 'ε' && symbol !== 'eps') {
            errors.push(`Transition uses symbol "${symbol}" which is not defined in alphabet Σ.`);
          }

          if (Array.isArray(toStates)) {
            const seenDest = new Set();
            toStates.forEach((dest) => {
              if (!validStateSet.has(dest)) {
                errors.push(`Transition from "${fromState}" on "${symbol}" points to non-existent state "${dest}".`);
              }
              if (seenDest.has(dest)) {
                warnings.push(`Duplicate destination state "${dest}" in transition from "${fromState}" on "${symbol}".`);
              }
              seenDest.add(dest);
            });
          } else {
            errors.push(`Destination states for "${fromState}" on "${symbol}" must be an array of states.`);
          }
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get transition destinations: δ(fromState, symbol) -> string[]
 */
export function getTransitions(nfa, fromState, symbol) {
  if (!nfa?.transitions?.[fromState]?.[symbol]) {
    return [];
  }
  return nfa.transitions[fromState][symbol] || [];
}

/**
 * Cleanly add a state to an NFA
 */
export function addStateToNFA(nfa, newState) {
  const trimmed = newState.trim();
  if (!trimmed || nfa.states.includes(trimmed)) return nfa;

  const next = cloneNFA(nfa);
  next.states.push(trimmed);

  // If this is the very first state added, make it the initial state by default
  if (!next.initialState) {
    next.initialState = trimmed;
  }

  if (!next.transitions[trimmed]) {
    next.transitions[trimmed] = {};
  }

  return next;
}

/**
 * Remove a state and clean up all related references and transitions
 */
export function removeStateFromNFA(nfa, stateToRemove) {
  const next = cloneNFA(nfa);
  next.states = next.states.filter((s) => s !== stateToRemove);

  // If removed state was initial state, clear or reassign
  if (next.initialState === stateToRemove) {
    next.initialState = next.states[0] || '';
  }

  // Remove from final states
  next.finalStates = next.finalStates.filter((s) => s !== stateToRemove);

  // Delete outgoing transitions
  delete next.transitions[stateToRemove];

  // Remove incoming transitions pointing to this state
  Object.keys(next.transitions).forEach((fromState) => {
    Object.keys(next.transitions[fromState]).forEach((sym) => {
      next.transitions[fromState][sym] = next.transitions[fromState][sym].filter(
        (target) => target !== stateToRemove
      );
    });
  });

  return next;
}

/**
 * Add a symbol to the alphabet
 */
export function addSymbolToNFA(nfa, newSymbol) {
  const trimmed = newSymbol.trim();
  if (!trimmed || nfa.alphabet.includes(trimmed)) return nfa;

  const next = cloneNFA(nfa);
  next.alphabet.push(trimmed);
  return next;
}

/**
 * Remove a symbol and clean up all transitions on that symbol
 */
export function removeSymbolFromNFA(nfa, symbolToRemove) {
  const next = cloneNFA(nfa);
  next.alphabet = next.alphabet.filter((sym) => sym !== symbolToRemove);

  // Clean transitions using this symbol
  Object.keys(next.transitions).forEach((fromState) => {
    delete next.transitions[fromState][symbolToRemove];
  });

  return next;
}

/**
 * Set or update a transition δ(fromState, symbol) = [toStates]
 */
export function setTransitionInNFA(nfa, fromState, symbol, toStates) {
  const next = cloneNFA(nfa);
  if (!next.transitions[fromState]) {
    next.transitions[fromState] = {};
  }

  // Sort and remove duplicates
  const uniqueCleanDestinations = Array.from(new Set(toStates.filter(Boolean))).sort();

  next.transitions[fromState][symbol] = uniqueCleanDestinations;
  return next;
}

/**
 * Remove a transition δ(fromState, symbol)
 */
export function removeTransitionFromNFA(nfa, fromState, symbol) {
  const next = cloneNFA(nfa);
  if (next.transitions[fromState]) {
    delete next.transitions[fromState][symbol];
  }
  return next;
}
