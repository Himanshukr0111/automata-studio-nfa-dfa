/**
 * Subset Construction (Powerset Construction) Algorithm
 * Converts any Non-deterministic Finite Automaton (NFA) to an equivalent 
 * Deterministic Finite Automaton (DFA).
 * 
 * Mathematical Formulation:
 * Given NFA M = (Q, Σ, δ, q0, F)
 * Constructs DFA M' = (Q', Σ, δ', q0', F') where:
 * - Q' ⊆ P(Q) (subset of the powerset of Q, only reachable states)
 * - Σ is identical to NFA alphabet
 * - q0' = ε-closure({q0})
 * - δ'(S, a) = ε-closure( ⋃_{p ∈ S} δ(p, a) )
 * - F' = { S ∈ Q' | S ∩ F ≠ ∅ }
 */

/**
 * Computes the ε-closure of a set of NFA states.
 * If no ε-transitions exist, returns the sorted set of states itself.
 * 
 * @param {string[]} states - Array of state names
 * @param {Object} transitions - NFA transition table { state: { symbol: [destinations] } }
 * @returns {string[]} Sorted unique array of states reachable via zero or more ε-transitions
 */
export function computeEpsilonClosure(states, transitions = {}) {
  const closure = new Set(states);
  const stack = [...states];

  while (stack.length > 0) {
    const current = stack.pop();
    const epsDests = transitions[current]?.['ε'] || transitions[current]?.['eps'] || [];

    for (const nextState of epsDests) {
      if (!closure.has(nextState)) {
        closure.add(nextState);
        stack.push(nextState);
      }
    }
  }

  return Array.from(closure).sort();
}

/**
 * Canonical string key for a set of states to ensure unique identification.
 * E.g., ['q1', 'q0'] -> "q0,q1"
 * Empty set -> "∅"
 */
export function getSubsetKey(subset) {
  if (!subset || subset.length === 0) return '∅';
  return Array.from(new Set(subset)).sort().join(',');
}

/**
 * Formats a subset of states for display.
 * E.g., ['q0', 'q1'] -> "{q0, q1}"
 * Empty set -> "∅"
 */
export function formatSubsetDisplay(subset) {
  if (!subset || subset.length === 0) return '∅';
  return `{${Array.from(new Set(subset)).sort().join(', ')}}`;
}

/**
 * Generates letter-based state names:
 * 0 -> 'A', 1 -> 'B', ..., 25 -> 'Z', 26 -> 'S26', etc.
 */
export function generateDfaStateName(index, isDead = false) {
  if (isDead) return 'Dead';
  if (index < 26) {
    return String.fromCharCode(65 + index); // A, B, C...
  }
  return `S${index}`;
}

/**
 * Main Subset Construction Algorithm
 * 
 * @param {Object} nfa - The NFA object
 * @param {string[]} nfa.states - Set of NFA states Q
 * @param {string[]} nfa.alphabet - Input alphabet Σ (excluding ε)
 * @param {string} nfa.initialState - Initial state q0
 * @param {string[]} nfa.finalStates - Final states F
 * @param {Object} nfa.transitions - Transition mapping δ
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeDeadState - Whether to include the empty dead state if reached (default true)
 * 
 * @returns {Object} Resulting DFA structure with step-by-step trace
 */
export function convertNfaToDfa(nfa, options = { includeDeadState: true }) {
  if (!nfa || !nfa.states || nfa.states.length === 0) {
    throw new Error('Cannot convert empty NFA: states set is missing or empty.');
  }
  if (!nfa.initialState) {
    throw new Error('Cannot convert NFA: initial state is not specified.');
  }
  if (!nfa.alphabet || nfa.alphabet.length === 0) {
    throw new Error('Cannot convert NFA: alphabet is empty.');
  }

  const { states: nfaStates, alphabet, initialState: nfaInitial, finalStates: nfaFinals, transitions: nfaTransitions = {} } = nfa;
  const nfaFinalSet = new Set(nfaFinals || []);

  // Filter out epsilon from DFA alphabet if present
  const dfaAlphabet = alphabet.filter((sym) => sym !== 'ε' && sym !== 'eps');

  // Step 1: Initial DFA State
  const initialSubset = computeEpsilonClosure([nfaInitial], nfaTransitions);
  const initialKey = getSubsetKey(initialSubset);

  const dfaStateMap = new Map(); // key -> DFA state object
  const queue = [];              // Queue of keys to process (BFS)
  const conversionSteps = [];    // Recorded steps for educational visualization
  let stateCounter = 0;

  // Helper to register a new DFA state
  function getOrCreateDfaState(subset) {
    const key = getSubsetKey(subset);
    if (dfaStateMap.has(key)) {
      return { state: dfaStateMap.get(key), isNew: false };
    }

    const isEmpty = subset.length === 0;
    const name = generateDfaStateName(stateCounter++, isEmpty);
    const isInitial = key === initialKey;
    const isFinal = subset.some((s) => nfaFinalSet.has(s));

    const newState = {
      id: name,
      name,
      subset: [...subset].sort(),
      displayLabel: `${name} = ${formatSubsetDisplay(subset)}`,
      key,
      isInitial,
      isFinal,
      isEmpty,
    };

    dfaStateMap.set(key, newState);
    queue.push(key);
    return { state: newState, isNew: true };
  }

  // Register initial state
  const { state: startState } = getOrCreateDfaState(initialSubset);

  const dfaTransitions = {}; // { [stateId]: { [symbol]: targetStateId } }

  // Step 2: Process Queue until all reachable states are explored
  while (queue.length > 0) {
    const currentKey = queue.shift();
    const currentState = dfaStateMap.get(currentKey);
    const currentSubset = currentState.subset;

    dfaTransitions[currentState.id] = {};

    for (const symbol of dfaAlphabet) {
      // Find all states reachable on this symbol from any state in currentSubset
      const reachableStatesSet = new Set();
      const nfaStepBreakdown = [];

      for (const nfaState of currentSubset) {
        const dests = nfaTransitions[nfaState]?.[symbol] || [];
        if (dests.length > 0) {
          nfaStepBreakdown.push({
            from: nfaState,
            symbol,
            to: [...dests],
          });
          for (const d of dests) {
            reachableStatesSet.add(d);
          }
        }
      }

      // Compute ε-closure of reached states
      const targetSubset = computeEpsilonClosure(Array.from(reachableStatesSet), nfaTransitions);
      const targetKey = getSubsetKey(targetSubset);

      let targetDfaState;
      let isNewState = false;

      if (targetSubset.length === 0) {
        // Destination is empty set ∅
        if (options.includeDeadState) {
          const res = getOrCreateDfaState([]);
          targetDfaState = res.state;
          isNewState = res.isNew;
          dfaTransitions[currentState.id][symbol] = targetDfaState.id;
        } else {
          // Explicit null/none
          dfaTransitions[currentState.id][symbol] = null;
        }
      } else {
        const res = getOrCreateDfaState(targetSubset);
        targetDfaState = res.state;
        isNewState = res.isNew;
        dfaTransitions[currentState.id][symbol] = targetDfaState.id;
      }

      // Record step details for visualization & educational tracing
      conversionSteps.push({
        stepNumber: conversionSteps.length + 1,
        sourceStateId: currentState.id,
        sourceSubset: [...currentSubset],
        sourceDisplay: currentState.displayLabel,
        symbol,
        nfaTransitionsGathered: nfaStepBreakdown,
        resultingSubset: [...targetSubset],
        resultingDisplay: targetDfaState ? targetDfaState.displayLabel : '∅',
        targetStateId: targetDfaState ? targetDfaState.id : '∅',
        isNewStateDiscovered: isNewState,
        description: `From DFA state ${currentState.id} (${formatSubsetDisplay(currentSubset)}) on symbol '${symbol}': ⋃ δ(q, '${symbol}') = ${formatSubsetDisplay(targetSubset)}${
          targetDfaState ? ` → maps to DFA state ${targetDfaState.id}` : ' → ∅'
        }${isNewState ? ' (New state discovered!)' : ''}`,
      });
    }
  }

  // Collect ordered DFA states list
  const allDfaStates = Array.from(dfaStateMap.values());
  const finalDfaStates = allDfaStates.filter((s) => s.isFinal).map((s) => s.id);

  return {
    states: allDfaStates.map((s) => s.id),
    stateObjects: allDfaStates,
    alphabet: dfaAlphabet,
    initialState: startState.id,
    finalStates: finalDfaStates,
    transitions: dfaTransitions,
    steps: conversionSteps,
    metadata: {
      nfaStateCount: nfaStates.length,
      dfaStateCount: allDfaStates.length,
      isEquivalent: true,
      hasDeadState: allDfaStates.some((s) => s.isEmpty),
    },
  };
}
