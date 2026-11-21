import { formatSubsetDisplay, computeEpsilonClosure } from './nfaToDfa.js';

/**
 * Generates an educational, step-by-step walkthrough sequence
 * for the Subset Construction conversion of an NFA to DFA.
 * 
 * @param {Object} nfa - The input NFA
 * @param {Object} dfa - The generated DFA from convertNfaToDfa
 * @returns {Array<Object>} List of structured step objects
 */
export function generateConversionWalkthrough(nfa, dfa) {
  if (!nfa || !dfa || !nfa.states || nfa.states.length === 0) {
    return [];
  }

  const steps = [];
  const { states: nfaStates, alphabet: nfaAlphabet, initialState: nfaInitial, finalStates: nfaFinals, transitions: nfaTransitions } = nfa;
  const nfaFinalSet = new Set(nfaFinals || []);

  // -------------------------------------------------------------------------
  // STEP 1: INITIAL STATE CREATION
  // -------------------------------------------------------------------------
  const initialClosure = computeEpsilonClosure([nfaInitial], nfaTransitions);
  const initialDfaState = dfa.stateObjects.find((s) => s.id === dfa.initialState) || dfa.stateObjects[0];

  steps.push({
    stepIndex: 0,
    stepNumber: 1,
    type: 'INITIAL_STATE',
    title: 'Initialize DFA Start State',
    summary: `Compute the initial DFA state from the NFA start state (${nfaInitial}).`,
    mathFormula: `q'_0 = \\epsilon\\text{-closure}(\\{${nfaInitial}\\}) = ${formatSubsetDisplay(initialClosure)} \\equiv ${initialDfaState.id}`,
    currentDfaState: initialDfaState.id,
    currentSubset: initialClosure,
    symbol: null,
    nfaBreakdown: [],
    targetDfaState: null,
    targetSubset: [],
    isNewState: true,
    explanation: [
      `We begin by taking the start state of the NFA, which is "${nfaInitial}".`,
      `We compute its ε-closure (all states reachable without consuming input symbols). Here: ε-closure({${nfaInitial}}) = ${formatSubsetDisplay(initialClosure)}.`,
      `We assign this subset as the initial DFA state: "${initialDfaState.id} = ${formatSubsetDisplay(initialClosure)}".`,
      `State "${initialDfaState.id}" is placed into the queue of unprocessed DFA states.`,
    ],
    nfaHighlight: {
      sourceStates: [nfaInitial],
      targetStates: initialClosure,
      activeSymbol: null,
      edgeKey: null,
    },
    dfaHighlight: {
      sourceState: initialDfaState.id,
      targetState: null,
      activeSymbol: null,
      edgeKey: null,
    },
  });

  // -------------------------------------------------------------------------
  // STEP 2 .. K: TRANSITIONS EVALUATION (from dfa.steps)
  // -------------------------------------------------------------------------
  const rawSteps = dfa.steps || [];
  rawSteps.forEach((rawStep, index) => {
    const {
      sourceStateId,
      sourceSubset,
      symbol,
      nfaTransitionsGathered,
      resultingSubset,
      targetStateId,
      isNewStateDiscovered,
    } = rawStep;

    const sourceStateObj = dfa.stateObjects.find((s) => s.id === sourceStateId);
    const targetStateObj = dfa.stateObjects.find((s) => s.id === targetStateId);

    // Build formal math string
    const unionParts = sourceSubset.map((s) => `\\delta_N(${s}, '${symbol}')`).join(' \\cup ');
    const mathFormula = `\\delta_D(${sourceStateId}, '${symbol}') = ${unionParts || '\\emptyset'} = ${formatSubsetDisplay(resultingSubset)} \\equiv ${targetStateId}`;

    const nfaSources = sourceSubset;
    const nfaTargets = resultingSubset;
    const nfaEdgeKeys = [];
    sourceSubset.forEach((s) => {
      const dests = nfaTransitions[s]?.[symbol] || [];
      dests.forEach((d) => nfaEdgeKeys.push(`${s}->${d}`));
    });

    const isDead = targetStateId === 'Dead' || resultingSubset.length === 0;

    const explanation = [
      `Examine DFA state "${sourceStateId}" representing the subset of NFA states: ${formatSubsetDisplay(sourceSubset)}.`,
      `Evaluate input symbol '${symbol}' across each NFA state in this subset:`,
    ];

    if (nfaTransitionsGathered.length === 0) {
      explanation.push(`None of the states in ${formatSubsetDisplay(sourceSubset)} have transitions on '${symbol}'. The resulting set is empty (∅).`);
      if (isDead) {
        explanation.push(`This transitions to the Dead/Trap state (${targetStateId} = ∅) to maintain complete determinism.`);
      }
    } else {
      nfaTransitionsGathered.forEach((trans) => {
        explanation.push(`• δ(${trans.from}, '${symbol}') = ${trans.to.length > 0 ? `{${trans.to.join(', ')}}` : '∅'}`);
      });
      explanation.push(`Taking the union of all reachable states yields: ${formatSubsetDisplay(resultingSubset)}.`);
    }

    if (isNewStateDiscovered) {
      explanation.push(`✨ New DFA State Discovered! Subset ${formatSubsetDisplay(resultingSubset)} has not been seen before. We label it "${targetStateId}" and add it to our processing queue.`);
    } else {
      explanation.push(`Subset ${formatSubsetDisplay(resultingSubset)} matches previously discovered DFA state "${targetStateId}". We record the deterministic transition ${sourceStateId} on '${symbol}' → ${targetStateId}.`);
    }

    steps.push({
      stepIndex: steps.length,
      stepNumber: steps.length + 1,
      type: 'TRANSITION_EVALUATION',
      title: `Transition: ${sourceStateId} on '${symbol}' → ${targetStateId}`,
      summary: `Compute destinations from ${sourceStateId} on input '${symbol}'.`,
      mathFormula,
      currentDfaState: sourceStateId,
      currentSubset: sourceSubset,
      symbol,
      nfaBreakdown: nfaTransitionsGathered,
      targetDfaState: targetStateId,
      targetSubset: resultingSubset,
      isNewState: isNewStateDiscovered,
      explanation,
      nfaHighlight: {
        sourceStates: nfaSources,
        targetStates: nfaTargets,
        activeSymbol: symbol,
        edgeKeys: nfaEdgeKeys,
      },
      dfaHighlight: {
        sourceState: sourceStateId,
        targetState: targetStateId,
        activeSymbol: symbol,
        edgeKey: `${sourceStateId}->${targetStateId}`,
      },
    });
  });

  // -------------------------------------------------------------------------
  // STEP K+1: IDENTIFY ACCEPTING STATES
  // -------------------------------------------------------------------------
  const acceptingDfaStates = dfa.stateObjects.filter((s) => s.isFinal);
  const nonAcceptingDfaStates = dfa.stateObjects.filter((s) => !s.isFinal);

  const finalExplanation = [
    `In Automata Theory, a DFA state S is an accepting state if and only if it contains AT LEAST ONE accepting state from the original NFA: S ∩ F_NFA ≠ ∅.`,
    `NFA Accepting States (F_NFA): {${nfaFinals.join(', ') || '∅'}}`,
    `We test each discovered DFA state:`,
  ];

  dfa.stateObjects.forEach((st) => {
    const intersection = st.subset.filter((s) => nfaFinalSet.has(s));
    if (intersection.length > 0) {
      finalExplanation.push(`• State ${st.id} = ${formatSubsetDisplay(st.subset)} contains {${intersection.join(', ')}} ∈ F_NFA → ACCEPTING (*)`);
    } else {
      finalExplanation.push(`• State ${st.id} = ${formatSubsetDisplay(st.subset)} contains no final states → Rejecting`);
    }
  });

  steps.push({
    stepIndex: steps.length,
    stepNumber: steps.length + 1,
    type: 'ACCEPTING_STATES',
    title: 'Identify Accepting / Final DFA States',
    summary: `Determine which DFA states accept strings based on the intersection with F_NFA.`,
    mathFormula: `F' = \\{ S \\in Q' \\mid S \\cap F_{\\text{NFA}} \\ne \\emptyset \\} = \\{${acceptingDfaStates.map((s) => s.id).join(', ') || '\\emptyset'}\\}`,
    currentDfaState: null,
    currentSubset: [],
    symbol: null,
    nfaBreakdown: [],
    targetDfaState: null,
    targetSubset: [],
    isNewState: false,
    explanation: finalExplanation,
    nfaHighlight: {
      sourceStates: nfaFinals,
      targetStates: [],
      activeSymbol: null,
      edgeKeys: [],
    },
    dfaHighlight: {
      sourceState: null,
      targetState: null,
      highlightFinals: acceptingDfaStates.map((s) => s.id),
      activeSymbol: null,
      edgeKey: null,
    },
  });

  // -------------------------------------------------------------------------
  // STEP K+2: CONVERSION COMPLETE
  // -------------------------------------------------------------------------
  steps.push({
    stepIndex: steps.length,
    stepNumber: steps.length + 1,
    type: 'COMPLETE',
    title: 'Subset Construction Complete!',
    summary: `The equivalent Deterministic Finite Automaton (DFA) has been fully constructed.`,
    mathFormula: `M' = (Q', \\Sigma, \\delta', q'_0, F') \\quad \\text{with } |Q'|=${dfa.states.length}, |\\Sigma|=${dfa.alphabet.length}, |F'|=${dfa.finalStates.length}`,
    currentDfaState: null,
    currentSubset: [],
    symbol: null,
    nfaBreakdown: [],
    targetDfaState: null,
    targetSubset: [],
    isNewState: false,
    explanation: [
      `All reachable subsets have been evaluated and all transitions are strictly deterministic.`,
      `Original NFA size: ${nfaStates.length} states → Generated DFA size: ${dfa.states.length} states.`,
      `Language Equivalence: The constructed DFA recognizes the EXACT same formal language as the input NFA: L(M') = L(M).`,
      `You can now view the completed transition table or test string acceptance in the upcoming simulator!`,
    ],
    nfaHighlight: {
      sourceStates: [],
      targetStates: [],
      activeSymbol: null,
      edgeKeys: [],
    },
    dfaHighlight: {
      sourceState: null,
      targetState: null,
      activeSymbol: null,
      edgeKey: null,
    },
  });

  return steps;
}
