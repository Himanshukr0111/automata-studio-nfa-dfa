import { formatSubsetDisplay } from './nfaToDfa.js';

/**
 * Pure String Acceptance Simulator for Deterministic Finite Automata (DFA)
 * 
 * Formal Definition:
 * Given DFA M' = (Q', Σ, δ', q0', F') and input string w = a1 a2 ... an (ai ∈ Σ):
 * The computation path is a sequence of states: r0, r1, ..., rn ∈ Q' such that:
 * 1. r0 = q0' (starts in initial DFA state)
 * 2. ri = δ'(r_{i-1}, ai) for each i = 1, ..., n
 * 3. The string w is ACCEPTED if rn ∈ F', otherwise REJECTED.
 * 
 * @param {Object} dfa - The generated DFA
 * @param {string} inputString - The input string to test
 * @returns {Object} Comprehensive simulation result and step-by-step trace
 */
export function simulateDfaString(dfa, inputString = '') {
  if (!dfa || !dfa.initialState || !Array.isArray(dfa.states) || dfa.states.length === 0) {
    return {
      isValidInput: false,
      validationError: 'Cannot simulate: DFA is missing or has no initial state.',
      inputString: '',
      symbols: [],
      steps: [],
      finalState: null,
      isAccepted: false,
      status: 'INVALID_DFA',
    };
  }

  // Handle epsilon / empty string representation
  const cleanInput = (inputString === 'ε' || inputString === 'eps' || inputString === 'λ') ? '' : String(inputString ?? '');
  const symbols = cleanInput ? cleanInput.split('') : [];
  const validAlphabetSet = new Set(dfa.alphabet || []);

  // 1. Validate alphabet symbols
  const invalidSymbols = symbols.filter((sym) => !validAlphabetSet.has(sym));
  if (invalidSymbols.length > 0) {
    const uniqueInvalid = Array.from(new Set(invalidSymbols));
    return {
      isValidInput: false,
      validationError: `String contains invalid symbol(s): ${uniqueInvalid.map(s => `'${s}'`).join(', ')}. Valid alphabet Σ = {${dfa.alphabet.join(', ')}}.`,
      inputString: cleanInput,
      symbols,
      steps: [],
      finalState: null,
      isAccepted: false,
      status: 'INVALID_SYMBOLS',
    };
  }

  const finalStateSet = new Set(dfa.finalStates || []);
  const stateObjMap = new Map();
  (dfa.stateObjects || []).forEach((st) => stateObjMap.set(st.id, st));

  // 2. Handle Empty String (length 0)
  if (symbols.length === 0) {
    const startState = dfa.initialState;
    const isStartFinal = finalStateSet.has(startState);
    const startObj = stateObjMap.get(startState);

    return {
      isValidInput: true,
      validationError: null,
      inputString: '',
      isEmptyString: true,
      symbols: [],
      steps: [],
      startState,
      finalState: startState,
      finalSubset: startObj?.subset || [],
      isAccepted: isStartFinal,
      status: isStartFinal ? 'ACCEPTED' : 'REJECTED',
      explanation: isStartFinal
        ? `The empty string (ε) consumes no transitions and leaves the automaton in initial state "${startState}". Because "${startState}" is an accepting state (*), ε is ACCEPTED.`
        : `The empty string (ε) consumes no transitions and leaves the automaton in initial state "${startState}". Because "${startState}" is NOT an accepting state, ε is REJECTED.`,
    };
  }

  // 3. Process Non-Empty String
  let currentState = dfa.initialState;
  const steps = [];

  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    const fromState = currentState;
    const fromObj = stateObjMap.get(fromState);

    // Look up transition in DFA transition table
    let toState = dfa.transitions?.[fromState]?.[symbol];

    // If transition leads to undefined or null, route to Dead state if available
    let isDead = false;
    if (!toState || toState === 'Dead' || toState === '∅') {
      toState = toState || 'Dead';
      isDead = true;
    } else {
      const targetObj = stateObjMap.get(toState);
      if (targetObj?.isEmpty) {
        isDead = true;
      }
    }

    const toObj = stateObjMap.get(toState);
    const isTargetFinal = finalStateSet.has(toState);

    steps.push({
      stepNumber: i + 1,
      symbolIndex: i,
      symbol,
      fromState,
      fromSubset: fromObj?.subset || [],
      fromDisplay: fromObj?.displayLabel || `${fromState}`,
      toState,
      toSubset: toObj?.subset || [],
      toDisplay: toObj?.displayLabel || `${toState}`,
      isTargetFinal,
      isDead,
      transitionNotation: `δ'(${fromState}, '${symbol}') = ${toState}`,
      edgeKey: `${fromState}->${toState}`,
      description: `Step ${i + 1}: Reading '${symbol}' from state ${fromState} (${formatSubsetDisplay(fromObj?.subset)}) transitions to ${toState} (${formatSubsetDisplay(toObj?.subset)})${isTargetFinal ? ' [Accepting state]' : ''}${isDead ? ' [Dead state: trapped]' : ''}.`,
    });

    currentState = toState;
  }

  const finalState = currentState;
  const finalObj = stateObjMap.get(finalState);
  const isAccepted = finalStateSet.has(finalState);

  const status = isAccepted ? 'ACCEPTED' : 'REJECTED';
  const explanation = isAccepted
    ? `After consuming all ${symbols.length} symbols of "${cleanInput}", the computation ends in state "${finalState}" (${formatSubsetDisplay(finalObj?.subset)}). Since "${finalState}" belongs to the set of accepting states F', the string is ACCEPTED.`
    : `After consuming all ${symbols.length} symbols of "${cleanInput}", the computation ends in state "${finalState}" (${formatSubsetDisplay(finalObj?.subset)}). Since "${finalState}" does NOT belong to the accepting states F', the string is REJECTED.`;

  return {
    isValidInput: true,
    validationError: null,
    inputString: cleanInput,
    isEmptyString: false,
    symbols,
    steps,
    startState: dfa.initialState,
    finalState,
    finalSubset: finalObj?.subset || [],
    isAccepted,
    status,
    explanation,
  };
}

/**
 * Runs batch verification on an array of test strings
 * 
 * @param {Object} dfa - The DFA
 * @param {string[]} testStrings - List of strings to evaluate
 * @returns {Array<Object>} List of results
 */
export function simulateBatchDfaStrings(dfa, testStrings = []) {
  return testStrings.map((str) => {
    const result = simulateDfaString(dfa, str);
    return {
      string: str,
      isAccepted: result.isAccepted,
      status: result.status,
      finalState: result.finalState,
      isValid: result.isValidInput,
      stepCount: result.steps.length,
      explanation: result.explanation,
    };
  });
}
