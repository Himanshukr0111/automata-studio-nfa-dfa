import assert from 'node:assert/strict';
import { convertNfaToDfa } from '../src/algorithms/nfaToDfa.js';
import { simulateDfaString } from '../src/algorithms/stringSimulator.js';
import { validateNFA, DEFAULT_EXAMPLE_NFA } from '../src/core/nfa.js';

let passedCount = 0;
function testAssert(condition, message) {
  assert.ok(condition, message);
  passedCount++;
}

console.log('Running Automata Studio Verification Suite (6 Suites, 34 Assertions)...\n');

// ==========================================
// Suite 1: Standard Textbook NFA (10 tests)
// ==========================================
console.log('--- Test Suite 1: Standard Textbook NFA ---');
const nfaValidation = validateNFA(DEFAULT_EXAMPLE_NFA);
testAssert(nfaValidation.isValid, '1.1: Default NFA should be valid');

const dfa1 = convertNfaToDfa(DEFAULT_EXAMPLE_NFA);
testAssert(dfa1.states.length === 3, '1.2: DFA must have 3 states (A, B, C)');
testAssert(dfa1.initialState === 'A', '1.3: Initial DFA state must be A');
testAssert(dfa1.finalStates.includes('C'), '1.4: Final DFA state must be C');
testAssert(dfa1.transitions['A']['0'] === 'B', '1.5: A on 0 -> B');
testAssert(dfa1.transitions['A']['1'] === 'A', '1.6: A on 1 -> A');
testAssert(dfa1.transitions['B']['0'] === 'B', '1.7: B on 0 -> B');
testAssert(dfa1.transitions['B']['1'] === 'C', '1.8: B on 1 -> C');
testAssert(simulateDfaString(dfa1, '01').status === 'ACCEPTED', "1.9: String '01' accepted");
testAssert(simulateDfaString(dfa1, '11').status === 'REJECTED', "1.10: String '11' rejected");
console.log('✓ Suite 1 passed (10/10 assertions)');

// ==========================================
// Suite 2: NFA with ε-Transitions (5 tests)
// ==========================================
console.log('--- Test Suite 2: NFA with ε-Transitions ---');
const epsilonNfa = {
  states: ['q0', 'q1', 'q2'],
  alphabet: ['a', 'b'],
  initialState: 'q0',
  finalStates: ['q2'],
  transitions: {
    q0: { 'ε': ['q1'] },
    q1: { a: ['q2'] },
    q2: {}
  }
};
const dfa2 = convertNfaToDfa(epsilonNfa);
testAssert(dfa2.stateObjects.find(s => s.id === dfa2.initialState).subset.includes('q1'), '2.1: Start state ε-closure includes q1');
testAssert(dfa2.states.length >= 2, '2.2: DFA generated with reachable states');
testAssert(simulateDfaString(dfa2, 'a').status === 'ACCEPTED', "2.3: String 'a' accepted via ε-path");
testAssert(simulateDfaString(dfa2, '').status === 'REJECTED', '2.4: Empty string rejected');
testAssert(simulateDfaString(dfa2, 'b').status === 'REJECTED', "2.5: String 'b' rejected");
console.log('✓ Suite 2 passed (5/5 assertions)');

// ==========================================
// Suite 3: Dead / Trap State Handling (5 tests)
// ==========================================
console.log('--- Test Suite 3: Dead / Trap States ---');
const incompleteNfa = {
  states: ['q0', 'q1'],
  alphabet: ['0', '1'],
  initialState: 'q0',
  finalStates: ['q1'],
  transitions: {
    q0: { '0': ['q1'] }
  }
};
const dfa3 = convertNfaToDfa(incompleteNfa, { includeDeadState: true });
const deadState = dfa3.stateObjects.find(s => s.isEmpty);
testAssert(Boolean(deadState), '3.1: Dead state generated for missing transitions');
testAssert(dfa3.transitions['A']['1'] === deadState.id, '3.2: Transition on missing symbol maps to Dead');
testAssert(dfa3.transitions[deadState.id]['0'] === deadState.id, '3.3: Dead state self-loops on 0');
testAssert(dfa3.transitions[deadState.id]['1'] === deadState.id, '3.4: Dead state self-loops on 1');
testAssert(simulateDfaString(dfa3, '1').status === 'REJECTED', "3.5: String '1' rejected by trap");
console.log('✓ Suite 3 passed (5/5 assertions)');

// ==========================================
// Suite 4: Unreachable / Orphan States (4 tests)
// ==========================================
console.log('--- Test Suite 4: Unreachable States ---');
const unreachableNfa = {
  states: ['q0', 'q1', 'q_orphan'],
  alphabet: ['0', '1'],
  initialState: 'q0',
  finalStates: ['q1'],
  transitions: {
    q0: { '0': ['q1'], '1': ['q0'] },
    q1: { '0': ['q1'], '1': ['q0'] },
    q_orphan: { '0': ['q1'] }
  }
};
const dfa4 = convertNfaToDfa(unreachableNfa);
const dfaContainsOrphan = dfa4.stateObjects.some(s => s.subset.includes('q_orphan'));
testAssert(!dfaContainsOrphan, '4.1: Unreachable state omitted from DFA powerset');
testAssert(dfa4.states.length === 2, '4.2: DFA contains exactly 2 reachable states');
testAssert(simulateDfaString(dfa4, '0').status === 'ACCEPTED', "4.3: String '0' accepted");
testAssert(simulateDfaString(dfa4, '1').status === 'REJECTED', "4.4: String '1' rejected");
console.log('✓ Suite 4 passed (4/4 assertions)');

// ==========================================
// Suite 5: Single-State NFA & Empty String (5 tests)
// ==========================================
console.log('--- Test Suite 5: Single-State NFA ---');
const singleStateNfa = {
  states: ['q0'],
  alphabet: ['0', '1'],
  initialState: 'q0',
  finalStates: ['q0'],
  transitions: {
    q0: { '0': ['q0'], '1': ['q0'] }
  }
};
const dfa5 = convertNfaToDfa(singleStateNfa);
testAssert(dfa5.states.length === 1, '5.1: 1-state NFA produces 1-state DFA');
testAssert(dfa5.initialState === 'A', '5.2: Initial state is A');
testAssert(dfa5.finalStates.includes('A'), '5.3: Initial state is accepting');
testAssert(simulateDfaString(dfa5, '').status === 'ACCEPTED', '5.4: Empty string accepted');
testAssert(simulateDfaString(dfa5, '010101').status === 'ACCEPTED', "5.5: Non-empty string '010101' accepted");
console.log('✓ Suite 5 passed (5/5 assertions)');

// ==========================================
// Suite 6: 3-Symbol Alphabet {a, b, c} (5 tests)
// ==========================================
console.log('--- Test Suite 6: 3-Symbol Alphabet ---');
const threeSymbolNfa = {
  states: ['q0', 'q1'],
  alphabet: ['a', 'b', 'c'],
  initialState: 'q0',
  finalStates: ['q1'],
  transitions: {
    q0: { 'a': ['q1'] },
    q1: { 'b': ['q1'], 'c': ['q0'] }
  }
};
const dfa6 = convertNfaToDfa(threeSymbolNfa);
testAssert(dfa6.alphabet.length === 3, '6.1: Alphabet length is 3');
testAssert(dfa6.alphabet.join(',') === 'a,b,c', '6.2: Alphabet matches {a, b, c}');
testAssert(simulateDfaString(dfa6, 'a').status === 'ACCEPTED', "6.3: String 'a' accepted");
testAssert(simulateDfaString(dfa6, 'ab').status === 'ACCEPTED', "6.4: String 'ab' accepted");
testAssert(simulateDfaString(dfa6, 'ac').status === 'REJECTED', "6.5: String 'ac' rejected");
console.log('✓ Suite 6 passed (5/5 assertions)');

console.log(`\n==============================================`);
console.log(`Summary: All ${passedCount} / 34 assertions PASSED (100%)!`);
console.log(`==============================================\n`);
