# Application Screenshots Directory

This directory is reserved for capturing and displaying high-resolution visual previews of Automata Studio.

### Expected Screenshot Files:

| File Name | Target View | Content Description |
| :--- | :--- | :--- |
| `nfa-builder.png` | NFA Builder | 5-tuple input forms ($Q, \Sigma, q_0, F$), transition editor, and dynamic NFA matrix |
| `dfa-converter.png` | DFA Converter | Generated DFA transition table, state decomposition cards, and JSON inspector |
| `graph-visualizer.png` | State Diagrams | React Flow interactive graph canvas with custom double circles and self-loops |
| `step-player.png` | Conversion Player | Interactive step-by-step walkthrough showing intermediate powerset evaluations |
| `string-simulator.png` | String Simulator | Live ribbon tape visualizer, step-by-step execution trace table, and verdict banner |

### How to Capture & Place Screenshots:
1. Start the development server: `npm run dev`.
2. Open your browser to `http://localhost:3000`.
3. Capture full-window or workspace screenshots of each module.
4. Save the image files in PNG format directly in this `screenshots/` directory matching the names listed above.
5. They will automatically be linked and displayed in GitHub repository documentation.
