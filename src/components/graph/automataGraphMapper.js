import { MarkerType } from '@xyflow/react';
import { formatSubsetDisplay } from '../../algorithms/nfaToDfa.js';

/**
 * Transforms an NFA or DFA model into React Flow nodes and edges.
 * Uses BFS layered automatic positioning to avoid overlapping nodes.
 * Supports dynamic walkthrough highlighting.
 * 
 * @param {Object} automaton - The automaton object (NFA or DFA)
 * @param {string} type - 'nfa' | 'dfa'
 * @param {Object} highlight - Highlighting options for walkthrough steps
 * @returns {{ nodes: Array, edges: Array }}
 */
export function mapAutomatonToGraph(automaton, type = 'nfa', highlight = {}) {
  if (!automaton || !Array.isArray(automaton.states) || automaton.states.length === 0) {
    return { nodes: [], edges: [] };
  }

  const {
    states = [],
    alphabet = [],
    initialState = '',
    finalStates = [],
    transitions = {},
    stateObjects = [], // present in DFA
  } = automaton;

  const finalStateSet = new Set(finalStates);
  const activeSources = new Set(highlight.sourceStates || (highlight.sourceState ? [highlight.sourceState] : []));
  const activeTargets = new Set(highlight.targetStates || (highlight.targetState ? [highlight.targetState] : []));
  const activeFinals = new Set(highlight.highlightFinals || []);
  const activeEdgeKeys = new Set(highlight.edgeKeys || (highlight.edgeKey ? [highlight.edgeKey] : []));

  // ----------------------------------------------------
  // 1. LAYERED BREADTH-FIRST POSITIONING
  // ----------------------------------------------------
  const layers = new Map();
  const queue = [];

  if (initialState && states.includes(initialState)) {
    layers.set(initialState, 0);
    queue.push(initialState);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    const currentLayer = layers.get(current);
    const symbolMap = transitions[current] || {};

    Object.values(symbolMap).forEach((dest) => {
      const destList = Array.isArray(dest) ? dest : dest ? [dest] : [];
      destList.forEach((target) => {
        if (target && states.includes(target) && !layers.has(target)) {
          layers.set(target, currentLayer + 1);
          queue.push(target);
        }
      });
    });
  }

  let maxAssignedLayer = 0;
  layers.forEach((l) => {
    if (l > maxAssignedLayer) maxAssignedLayer = l;
  });

  states.forEach((s) => {
    if (!layers.has(s)) {
      maxAssignedLayer++;
      layers.set(s, maxAssignedLayer);
    }
  });

  const statesByLayer = new Map();
  states.forEach((s) => {
    const l = layers.get(s) ?? 0;
    if (!statesByLayer.has(l)) statesByLayer.set(l, []);
    statesByLayer.get(l).push(s);
  });

  const nodePositions = new Map();
  const LAYER_SPACING_X = 240;
  const NODE_SPACING_Y = 160;
  const BASE_Y = 220;
  const START_X = 120;

  statesByLayer.forEach((layerStates, layerIndex) => {
    const count = layerStates.length;
    layerStates.forEach((stateName, indexInLayer) => {
      const x = START_X + layerIndex * LAYER_SPACING_X;
      const y = BASE_Y + (indexInLayer - (count - 1) / 2) * NODE_SPACING_Y;
      nodePositions.set(stateName, { x, y });
    });
  });

  states.forEach((s) => {
    if (s === 'Dead' || s === '∅') {
      const currentPos = nodePositions.get(s);
      if (currentPos) {
        nodePositions.set(s, { x: currentPos.x, y: BASE_Y + 180 });
      }
    }
  });

  // ----------------------------------------------------
  // 2. CONSTRUCT REACT FLOW NODES
  // ----------------------------------------------------
  const nodes = states.map((stateName) => {
    const pos = nodePositions.get(stateName) || { x: 100, y: 100 };
    const isInitial = stateName === initialState;
    const isFinal = finalStateSet.has(stateName);
    
    let sublabel = '';
    let isEmpty = false;

    if (type === 'dfa' && stateObjects.length > 0) {
      const stObj = stateObjects.find((so) => so.id === stateName);
      if (stObj) {
        sublabel = formatSubsetDisplay(stObj.subset);
        isEmpty = stObj.isEmpty || false;
      }
    } else if (stateName === 'Dead' || stateName === '∅') {
      isEmpty = true;
    }

    const isActiveSource = activeSources.has(stateName);
    const isActiveTarget = activeTargets.has(stateName);
    const isEmphasizedFinal = activeFinals.has(stateName);

    return {
      id: stateName,
      type: 'stateNode',
      position: pos,
      data: {
        label: stateName,
        sublabel,
        isInitial,
        isFinal,
        isEmpty,
        isActiveSource,
        isActiveTarget,
        isEmphasizedFinal,
        type,
      },
    };
  });

  // ----------------------------------------------------
  // 3. CONSTRUCT REACT FLOW EDGES
  // ----------------------------------------------------
  const transitionPairs = new Map();

  Object.entries(transitions).forEach(([source, symbolMap]) => {
    if (!states.includes(source)) return;

    Object.entries(symbolMap || {}).forEach(([symbol, dest]) => {
      const targets = Array.isArray(dest) ? dest : dest ? [dest] : [];

      targets.forEach((target) => {
        if (!target || !states.includes(target)) return;

        const pairKey = `${source}->${target}`;
        if (!transitionPairs.has(pairKey)) {
          transitionPairs.set(pairKey, {
            source,
            target,
            symbols: new Set(),
          });
        }
        transitionPairs.get(pairKey).symbols.add(symbol);
      });
    });
  });

  const edges = [];
  transitionPairs.forEach(({ source, target, symbols }, key) => {
    const label = Array.from(symbols).sort().join(', ');
    const isSelfLoop = source === target;
    const isBidirectional = transitionPairs.has(`${target}->${source}`) && !isSelfLoop;
    const isEdgeActive = activeEdgeKeys.has(key) || activeEdgeKeys.has(`${source}->${target}`);

    if (isSelfLoop) {
      edges.push({
        id: `edge-${key}`,
        source,
        target,
        sourceHandle: 'top-source',
        targetHandle: 'top-target',
        type: 'selfLoop',
        label,
        animated: isEdgeActive,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: isEdgeActive ? '#f59e0b' : '#38bdf8',
        },
        style: {
          stroke: isEdgeActive ? '#f59e0b' : '#38bdf8',
          strokeWidth: isEdgeActive ? 3.5 : 2,
        },
      });
    } else {
      const sourcePos = nodePositions.get(source) || { x: 0, y: 0 };
      const targetPos = nodePositions.get(target) || { x: 0, y: 0 };
      const isReverse = sourcePos.x > targetPos.x;

      edges.push({
        id: `edge-${key}`,
        source,
        target,
        sourceHandle: isReverse ? 'bottom-source' : 'right-source',
        targetHandle: isReverse ? 'bottom-target' : 'left-target',
        type: isBidirectional || isReverse ? 'default' : 'smoothstep',
        label,
        animated: isEdgeActive,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: isEdgeActive ? '#f59e0b' : isReverse ? '#818cf8' : '#38bdf8',
        },
        style: {
          stroke: isEdgeActive ? '#f59e0b' : isReverse ? '#818cf8' : '#38bdf8',
          strokeWidth: isEdgeActive ? 3.5 : 2,
        },
        labelStyle: {
          fill: isEdgeActive ? '#fbbf24' : '#e2e8f0',
          fontWeight: 700,
          fontFamily: 'monospace',
          fontSize: 12,
        },
        labelBgStyle: {
          fill: '#0f172a',
          fillOpacity: 0.95,
          stroke: isEdgeActive ? '#f59e0b' : isReverse ? '#6366f1' : '#0284c7',
          strokeWidth: isEdgeActive ? 2 : 1,
          rx: 4,
          ry: 4,
        },
        labelBgPadding: [6, 4],
      });
    }
  });

  return { nodes, edges };
}
