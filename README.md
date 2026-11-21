# Automata Studio: NFA to DFA Conversion Simulator

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Flow](https://img.shields.io/badge/@xyflow/react-12.3-ff0072.svg)](https://reactflow.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Automata Studio** is an interactive, educational simulator designed for computer science students and educators studying **Automata Theory & Computability**. The application enables users to design custom **Non-deterministic Finite Automata (NFA)**, convert them into equivalent **Deterministic Finite Automata (DFA)** using the canonical **Subset Construction (Powerset Construction)** algorithm, interactively visualize state diagrams via **React Flow**, follow a step-by-step conversion walkthrough, and simulate input string acceptance or rejection with live trajectory tracing.

---

## 🔗 Repository
- **GitHub Repository**: [https://github.com/Himanshukr0111/automata-studio-nfa-dfa](https://github.com/Himanshukr0111/automata-studio-nfa-dfa)
- **Author**: [Himanshu Kumar](https://github.com/Himanshukr0111)

---

## 🎯 Project Objectives

1. **Formal Automata Modeling**: Enable dynamic definition of the formal 5-tuple $M = (Q, \Sigma, \delta, q_0, F)$ with real-time theoretical validation.
2. **Mathematical Correctness**: Execute the exact Subset Construction algorithm with support for multiple destination branches, $\epsilon$-closures, and dead/trap state handling.
3. **Dual State Diagram Visualization**: Render interactive, draggable state machine diagrams adhering to standard formal notation (start arrow, double concentric circles for final states, self-loop arches).
4. **Pedagogical Walkthrough**: Provide a step-by-step player with mathematical formulas and natural language explanations.
5. **String Acceptance Simulator**: Trace input strings symbol-by-symbol through the generated DFA with an execution trace table and live graph synchronization.

---

## 💻 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (JavaScript) | Declarative UI and component lifecycle |
| **Bundler & Dev Server** | Vite 6 | Lightning-fast HMR and optimized production bundling |
| **Styling & Theme** | Tailwind CSS v3 | Dark navy glassmorphic UI design system |
| **Graph Visualizer** | React Flow (`@xyflow/react` v12) | Interactive, draggable graph canvases with custom nodes/edges |
| **Iconography** | Lucide React | Modern vector iconography |
| **State Management** | React Context API | Centralized, reactive automata state store |

---

## ✨ Features Across All Modules

### 1. NFA Builder & 5-Tuple Configuration
- **States Set ($Q$)**: Dynamic addition and removal of arbitrary state identifiers (`q0`, `q1`, `q2`, `A`, `S0`) with auto-increment generation.
- **Alphabet ($\Sigma$)**: Custom symbol configuration with quick-insert presets (`0`, `1`, `a`, `b`).
- **Initial State ($q_0$)**: Single selection with formal validation.
- **Final / Accepting States ($F$)**: Interactive multi-select toggling.
- **Cascading Cleanup**: Removing a state or symbol automatically cleans all corresponding transitions.
- **Real-Time Validator**: Flags duplicate state names, missing initial states, invalid references, and non-accepting configurations.

### 2. Transition Relation Editor & Dynamic Matrix
- Multi-destination branch selection: $\delta(q, a) \to \{q_i, q_j\}$.
- Non-deterministic branching support.
- **Dynamic NFA Transition Table**: Updates in real time without static hardcoding. Clicking any cell immediately loads that state-symbol pair into the editor.

### 3. Subset Construction Engine (DFA Converter)
- Pure algorithm implementation in `src/algorithms/nfaToDfa.js`.
- Computes $\epsilon$-closures: $q'_0 = \epsilon\text{-closure}(\{q_0\})$.
- Explores reachable power-set subsets via Breadth-First Search (BFS) worklist.
- Computes deterministic transitions: $\delta'(S, a) = \epsilon\text{-closure}\left(\bigcup_{p \in S} \delta(p, a)\right)$.
- Handles empty destination sets by creating and trapping in canonical Dead states ($Dead = \emptyset$).
- Identifies final DFA states: $S \in F' \iff S \cap F_{NFA} \ne \emptyset$.
- Displays the complete DFA Transition Table, state composition cards, and JSON inspector.

### 4. Interactive State Diagram Visualizer
- Powered by `@xyflow/react`.
- **Formal State Representation**:
  - `Start →` incoming start arrow for initial states.
  - Concentric **double-circle** geometry for final/accepting states.
  - Dedicated custom node styling for regular and dead states.
- **Self-Loop Curves**: Custom cubic-bezier arching edges for transitions where $source = target$.
- **Bidirectional Curve Routing**: Prevents edge overlapping on reverse transitions.
- **View Modes**: NFA Diagram, DFA Diagram, and Side-by-Side Comparison.
- **Controls**: Interactive zoom, pan, fit-to-screen, and reset-layout.

### 5. Step-by-Step Conversion Walkthrough Player
- Dynamically generated from actual algorithm execution data.
- **Four Pedagogical Stages**:
  1. Start state initialization ($\epsilon$-closure).
  2. Transition-by-transition evaluations with formal union formulas.
  3. Final state intersection identification.
  4. Algorithm summary and equivalence confirmation.
- **Interactive Controls**: Play, Pause, Next Step, Previous Step, Restart, and variable playback speeds (`1x`, `1.5x`, `2x`).
- **Live Graph Highlighting**: Active source states glow in amber, target states in cyan, and active transitions animate with glowing dashed strokes.

### 6. String Acceptance & Rejection Simulator
- Tests any input string against the generated DFA.
- Validates input symbols against $\Sigma$.
- Consumes symbols deterministically: $r_i = \delta'(r_{i-1}, a_i)$.
- **Empty String ($\epsilon$)** handling: correctly checks if $q'_0 \in F'$.
- **Input Tape Ribbon**: Highlights the active symbol and marks previously consumed characters.
- **Execution Trace Table**: Step number, symbol, from-state, to-state, and formal notation.
- **Acceptance Verdict**: Large **ACCEPTED** (emerald) or **REJECTED** (rose) banner with detailed theoretical justification.

---

## 📸 Application Screenshots

> **Note**: Application screenshots can be viewed in the [`screenshots/`](screenshots/) directory. To display live previews in this section, capture full-resolution screenshots from your browser and place them in the `screenshots/` directory using the canonical filenames below:

| UI Module | Visual Description | Canonical File Path |
| :--- | :--- | :--- |
| **NFA Builder** | Custom 5-tuple input forms ($Q, \Sigma, q_0, F$), transition relation editor, and dynamic NFA matrix | `screenshots/nfa-builder.png` |
| **DFA Converter** | Generated deterministic states, subset transition matrix, and JSON inspector | `screenshots/dfa-converter.png` |
| **Graph Visualizer** | Interactive React Flow dual and side-by-side automata state diagrams | `screenshots/graph-visualizer.png` |
| **Step-by-Step Player** | Interactive pedagogical conversion walkthrough with live union formula tracing | `screenshots/step-player.png` |
| **String Simulator** | Symbol-by-symbol tape ribbon visualizer, execution trace table, and verdict banner | `screenshots/string-simulator.png` |

#### How to Add Screenshots:
1. Start the local development server: `npm run dev`.
2. Open `http://localhost:3000` in your browser.
3. Capture clear screenshots of each tab and save them into the `screenshots/` directory matching the names listed above.

---

## 🗂 Project Folder Structure

```text
automata-studio-nfa-dfa/
├── index.html                   # Entry HTML template with Google Fonts
├── package.json                 # Project dependencies and npm scripts
├── postcss.config.js            # PostCSS configuration for Tailwind CSS
├── tailwind.config.js           # Tailwind theme configuration
├── vite.config.js               # Vite configuration (port 3000)
├── LICENSE                      # Official MIT License file
├── README.md                    # Comprehensive project documentation
├── screenshots/                 # Application UI screenshots directory
│   └── README.md                # Screenshot placement instructions
├── tests/                       # Automated test suites
│   └── verify-automata.js       # 6-suite, 34-assertion automata verification runner
└── src/
    ├── main.jsx                 # React root mount & CSS stylesheets
    ├── index.css                # Tailwind directives & typography layers
    ├── App.jsx                  # Main application orchestrator & layout
    ├── algorithms/              # Pure automata algorithms
    │   ├── nfaToDfa.js          # Subset construction engine & ε-closure
    │   ├── stepGenerator.js     # Pedagogical step-by-step walkthrough generator
    │   └── stringSimulator.js   # Deterministic string execution simulator
    ├── core/
    │   └── nfa.js               # NFA data structures, immutability helpers & validator
    ├── context/
    │   └── AutomataContext.jsx  # Centralized React Context state store
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx       # Header bar with live validation & action buttons
    │   │   ├── Sidebar.jsx      # Navigation sidebar & preset library
    │   │   └── Footer.jsx       # Academic project footer
    │   ├── nfa/
    │   │   ├── NFABuilder.jsx           # Main NFA Builder workspace view
    │   │   ├── NFAConfigCard.jsx        # 5-tuple input forms (Q, Σ, q0, F)
    │   │   ├── TransitionEditor.jsx     # Non-deterministic transition relation editor
    │   │   ├── TransitionTable.jsx      # Dynamic NFA matrix with cell clicking
    │   │   ├── NFAValidationBanner.jsx  # Real-time alert banner
    │   │   └── NFAModelPreview.jsx      # Formal 5-tuple & JSON inspector
    │   ├── dfa/
    │   │   ├── DFAView.jsx              # Main DFA Converter workspace
    │   │   ├── DFATransitionTable.jsx   # Generated DFA transition matrix
    │   │   └── DFASummaryCard.jsx       # State decomposition & equivalence breakdown
    │   ├── graph/
    │   │   ├── VisualizerView.jsx       # Dedicated visualizer with tab modes
    │   │   ├── AutomataGraphCanvas.jsx  # React Flow canvas with controls
    │   │   ├── automataGraphMapper.js   # BFS layered layout & edge mapper
    │   │   ├── StateNode.jsx            # Custom circular node (double circle, start arrow)
    │   │   └── SelfLoopEdge.jsx         # Custom arching self-loop edge
    │   └── simulation/
    │       ├── StepByStepPlayer.jsx     # Interactive conversion walkthrough player
    │       └── StringSimulatorView.jsx  # String testing simulator & tape visualizer
```

---

## 🚀 Installation & Running Instructions

### Prerequisites
- **Node.js**: Version 18.x or higher (Node 20+ recommended)
- **npm**: Version 9.x or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Himanshukr0111/automata-studio-nfa-dfa.git
cd automata-studio-nfa-dfa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Run Automated Test Suite
```bash
npm test
```
Executes all 6 validation suites and 34 assertions verifying algorithm correctness, powerset generation, $\epsilon$-closures, trap states, and string acceptance.

### 5. Build for Production
```bash
npm run build
```

---

## 📐 The Subset Construction Algorithm Explained

An NFA allows non-deterministic branching and $\epsilon$-transitions, meaning from a given state and input symbol, the machine can be in multiple states simultaneously:
$$\delta_N: Q \times (\Sigma \cup \{\epsilon\}) \to 2^Q$$

A DFA must have exactly one deterministic next state for every state and input symbol:
$$\delta_D: Q_D \times \Sigma \to Q_D$$

### Mathematical Steps:
1. **Initial DFA State**:
   $$q'_0 = \epsilon\text{-closure}(\{q_0\})$$
2. **Successor Subsets**:
   For each unprocessed DFA state $S \subseteq Q$ and symbol $a \in \Sigma$:
   $$\delta_D(S, a) = \epsilon\text{-closure}\left( \bigcup_{p \in S} \delta_N(p, a) \right)$$
3. **Queue Exploration**:
   If the resulting subset $T = \delta_D(S, a)$ has not been discovered yet, register it as a new DFA state and append it to the BFS queue.
4. **Handling the Empty Set ($\emptyset$)**:
   If reading $a$ from $S$ yields no reachable states ($\bigcup = \emptyset$), the DFA transitions to the Dead/Trap state ($Dead = \emptyset$), ensuring the transition function is total.
5. **Accepting States**:
   A DFA state $S$ is accepting if and only if it contains at least one accepting state of the NFA:
   $$F_D = \{ S \in Q_D \mid S \cap F_N \ne \emptyset \}$$

---

## 🧪 Verification & QA Testing Summary

Automated testing is integrated and runnable via `npm test` (`tests/verify-automata.js`). The suite systematically executes across 6 distinct automata architectures:
- **Test Suite 1 (Standard Textbook NFA)**: Verified 3 states ($A, B, C$), initial state $A$, final state $C$, transitions matching manual derivations, and string acceptance (`01` accepted, `11` rejected).
- **Test Suite 2 (NFA with $\epsilon$-Transitions)**: Verified start state $\epsilon$-closure inclusion and string acceptance through $\epsilon$-paths.
- **Test Suite 3 (Dead / Trap States)**: Verified that non-total NFAs correctly generate and loop in the Dead state ($Dead = \emptyset$).
- **Test Suite 4 (Unreachable States)**: Verified that unreachable orphan states are omitted from the generated DFA powerset.
- **Test Suite 5 (Single-State NFA)**: Verified 1-state DFA loops and empty string ($\epsilon$) acceptance.
- **Test Suite 6 (3-Symbol Alphabet $\{a, b, c\}$)**: Verified multi-symbol handling and string simulation.
- **Verification Command**: `npm test`
- **Total Automated Invariants Verified**: **34 / 34 PASSED (100%)**.
- **Production Build**: `npm run build` completed with **0 errors**.

---

## 🎓 Academic Credit & License
- Developed by **Himanshu Kumar** ([@Himanshukr0111](https://github.com/Himanshukr0111)) for the **Automata Theory & Computability** university curriculum.
- Licensed under the [MIT License](LICENSE).
