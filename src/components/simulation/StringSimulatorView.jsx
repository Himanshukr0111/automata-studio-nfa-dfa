import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { simulateDfaString, simulateBatchDfaStrings } from '../../algorithms/stringSimulator';
import AutomataGraphCanvas from '../graph/AutomataGraphCanvas';
import { formatSubsetDisplay } from '../../algorithms/nfaToDfa';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertCircle, 
  HelpCircle,
  Table,
  ArrowRight,
  Activity,
  Binary,
  Layers,
  Check
} from 'lucide-react';

export default function StringSimulatorView() {
  const { dfa, nfa, convertToDfa, validation, setActiveTab } = useAutomata();

  const [inputString, setInputString] = useState('01');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500); // ms per symbol

  // Run simulation whenever dfa or inputString changes
  const simulationResult = useMemo(() => {
    if (!dfa) return null;
    return simulateDfaString(dfa, inputString);
  }, [dfa, inputString]);

  const steps = simulationResult?.steps || [];
  const totalSteps = steps.length;

  // Reset or adjust current step index when input changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStepIndex(steps.length > 0 ? 0 : 0);
  }, [inputString, dfa]);

  // Automatic playback timer
  useEffect(() => {
    let timer = null;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const togglePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  // If no DFA has been generated yet
  if (!dfa) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm shadow-lg max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
          <Binary className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            String Acceptance & Rejection Simulator
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            To test whether strings are accepted or rejected, first convert your NFA into a 
            Deterministic Finite Automaton (DFA) using the Subset Construction algorithm.
          </p>
        </div>

        <button
          onClick={() => convertToDfa()}
          disabled={!validation.isValid}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 active:scale-95 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/25 mx-auto transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate DFA and Open Simulator</span>
        </button>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex] || null;
  const isSimulationFinished = steps.length === 0 || currentStepIndex === steps.length - 1;

  // Graph highlighting payload for current step
  const dfaHighlight = useMemo(() => {
    if (!simulationResult || !simulationResult.isValidInput) return {};

    if (simulationResult.isEmptyString) {
      return {
        sourceState: simulationResult.startState,
        highlightFinals: simulationResult.isAccepted ? [simulationResult.startState] : [],
      };
    }

    if (currentStep) {
      return {
        sourceState: currentStep.fromState,
        targetState: currentStep.toState,
        edgeKey: `${currentStep.fromState}->${currentStep.toState}`,
        activeSymbol: currentStep.symbol,
      };
    }

    return {};
  }, [currentStep, simulationResult]);

  // Suggested preset strings from user specifications
  const presetStrings = [
    { label: '01', desc: 'Accept (Ends with 01)' },
    { label: '101', desc: 'Accept' },
    { label: '11', desc: 'Reject' },
    { label: '0011', desc: 'Test 0011' },
    { label: '111', desc: 'Reject' },
    { label: '0', desc: 'Single 0' },
    { label: 'ε', desc: 'Empty String' },
  ];

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-800/80 to-blue-950/60 border border-cyan-500/30 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Binary className="w-3.5 h-3.5" />
            <span>Phase 6 String Verification Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            String Acceptance Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Test any input string against the generated DFA. Follow the deterministic state trajectory 
            symbol-by-symbol to determine formal language membership (Accepted vs Rejected).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
            DFA Alphabet: <strong className="text-cyan-400">{`{${dfa.alphabet.join(', ')}}`}</strong>
          </span>
        </div>
      </div>

      {/* String Input & Quick Presets Section */}
      <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Main Input Field */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Input String (w &isin; &Sigma;*)</span>
              <span className="text-[11px] text-slate-400 lowercase font-normal">
                Length: {inputString === 'ε' ? 0 : inputString.length} symbol{inputString.length !== 1 ? 's' : ''}
              </span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={inputString}
                onChange={(e) => setInputString(e.target.value.trim())}
                placeholder="e.g. 01, 101, 0011 (type 'ε' for empty string)"
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              {inputString && (
                <button
                  type="button"
                  onClick={() => setInputString('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Symbol Quick Inserters */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Insert:</span>
            {dfa.alphabet.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => setInputString((prev) => (prev === 'ε' ? sym : prev + sym))}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-mono font-bold text-cyan-300 transition-colors active:scale-95"
              >
                +{sym}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setInputString('ε')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-mono font-bold text-amber-300 transition-colors active:scale-95"
              title="Test empty string"
            >
              &epsilon;
            </button>
          </div>
        </div>

        {/* Preset Bank */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/60">
          <span className="text-xs text-slate-400 mr-1">Quick Test:</span>
          {presetStrings.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setInputString(preset.label)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                inputString === preset.label
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <span>{preset.label}</span>
              <span className="text-[10px] text-slate-400 opacity-80">({preset.desc})</span>
            </button>
          ))}
        </div>

        {/* Validation Errors */}
        {simulationResult && !simulationResult.isValidInput && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/70 text-rose-200 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{simulationResult.validationError}</span>
          </div>
        )}
      </div>

      {/* Interactive Step-by-Step Trajectory Player */}
      {simulationResult && simulationResult.isValidInput && (
        <div className="space-y-6">
          {/* Controls & Ribbon Container */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Playback Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  disabled={steps.length === 0}
                  title="Restart to first symbol"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrevious}
                  disabled={steps.length === 0 || currentStepIndex === 0}
                  title="Previous symbol"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev Symbol</span>
                </button>

                <button
                  onClick={togglePlayPause}
                  disabled={steps.length === 0}
                  title={isPlaying ? 'Pause simulation' : 'Play automatic simulation'}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-cyan-600/30 transition-all"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{currentStepIndex >= steps.length - 1 ? 'Replay' : 'Run Simulation'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={steps.length === 0 || currentStepIndex === steps.length - 1}
                  title="Next symbol"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
                >
                  <span className="hidden sm:inline">Next Symbol</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Step Status Counter & Speed Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="text-[11px] font-mono mr-1">Speed:</span>
                  {[
                    { label: '1x', ms: 1800 },
                    { label: '1.5x', ms: 1100 },
                    { label: '2x', ms: 600 },
                  ].map(({ label, ms }) => (
                    <button
                      key={label}
                      onClick={() => setPlaybackSpeed(ms)}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                        playbackSpeed === ms
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
                  {steps.length === 0 ? 'Empty String (ε)' : `Symbol ${currentStepIndex + 1} of ${steps.length}`}
                </span>
              </div>
            </div>

            {/* Input Tape / Ribbon Visualizer */}
            {!simulationResult.isEmptyString && (
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block mb-2">
                  Input Tape Inspection Ribbon:
                </span>
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  {simulationResult.symbols.map((sym, idx) => {
                    const isCurrent = idx === currentStepIndex;
                    const isPast = idx < currentStepIndex;

                    return (
                      <div
                        key={idx}
                        onClick={() => setCurrentStepIndex(idx)}
                        className={`cursor-pointer flex flex-col items-center justify-center w-11 h-12 rounded-xl font-mono text-sm font-bold transition-all ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300 z-10'
                            : isPast
                            ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{sym}</span>
                        <span className="text-[9px] font-sans font-normal opacity-70">
                          #{idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Active Step Transition Detail Banner */}
          {currentStep && (
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0">
                  '{currentStep.symbol}'
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Active Step Transition
                  </h3>
                  <div className="text-sm font-mono font-bold text-white flex items-center gap-2 mt-0.5">
                    <span>{currentStep.fromState}</span>
                    <span className="text-slate-500 font-normal">({formatSubsetDisplay(currentStep.fromSubset)})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span className={currentStep.isTargetFinal ? 'text-emerald-400' : 'text-blue-300'}>
                      {currentStep.toState}
                    </span>
                    <span className="text-slate-500 font-normal">({formatSubsetDisplay(currentStep.toSubset)})</span>
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300">
                {currentStep.transitionNotation}
              </div>
            </div>
          )}

          {/* Final Result Acceptance Banner */}
          <div
            className={`p-6 rounded-2xl border shadow-lg transition-all ${
              simulationResult.isAccepted
                ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/40 border-emerald-600/70 text-emerald-100'
                : 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/40 border-rose-600/70 text-rose-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    simulationResult.isAccepted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {simulationResult.isAccepted ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <XCircle className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl font-extrabold tracking-tight ${
                        simulationResult.isAccepted ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      STRING {simulationResult.status}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                      Final State: {simulationResult.finalState || 'none'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {simulationResult.explanation}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border self-start sm:self-center shrink-0 ${
                  simulationResult.isAccepted
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-rose-950 text-rose-300 border-rose-500/50'
                }`}
              >
                {simulationResult.isAccepted ? 'Final State ∈ F_DFA' : 'Final State ∉ F_DFA'}
              </span>
            </div>
          </div>

          {/* Synchronized Live DFA Graph */}
          <div>
            <AutomataGraphCanvas
              automaton={dfa}
              type="dfa"
              title="DFA Trajectory Graph"
              subtitle="Synchronized live highlight follows the active simulation state and transition"
              height="480px"
              highlight={dfaHighlight}
            />
          </div>

          {/* Detailed Execution Trace Table */}
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Execution Trace Table</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {steps.length} Transition Step{steps.length !== 1 ? 's' : ''}
              </span>
            </div>

            {simulationResult.isEmptyString ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono text-center">
                Empty string (&epsilon;): Machine remains in start state <strong>{simulationResult.startState}</strong> without consuming transitions.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-700/70">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-700 text-slate-300">
                      <th className="py-3 px-4 w-16">Step</th>
                      <th className="py-3 px-4 w-20 text-center text-cyan-300">Symbol</th>
                      <th className="py-3 px-4">From State</th>
                      <th className="py-3 px-4">To State</th>
                      <th className="py-3 px-4">Transition Function</th>
                      <th className="py-3 px-4 text-center">Destination Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                    {steps.map((st, idx) => {
                      const isCurrentRow = idx === currentStepIndex;

                      return (
                        <tr
                          key={st.stepNumber}
                          onClick={() => setCurrentStepIndex(idx)}
                          className={`cursor-pointer transition-colors ${
                            isCurrentRow
                              ? 'bg-cyan-950/40 text-cyan-200 font-bold'
                              : 'hover:bg-slate-800/50 text-slate-300'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold">{st.stepNumber}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 font-bold">
                              {st.symbol}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-white font-bold">{st.fromState}</span>{' '}
                            <span className="text-slate-400 text-[11px] font-normal">
                              ({formatSubsetDisplay(st.fromSubset)})
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-bold ${
                                st.isTargetFinal ? 'text-emerald-400' : 'text-blue-300'
                              }`}
                            >
                              {st.toState}
                            </span>{' '}
                            <span className="text-slate-400 text-[11px] font-normal">
                              ({formatSubsetDisplay(st.toSubset)})
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {st.transitionNotation}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {st.isTargetFinal ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 border border-emerald-700/60 text-emerald-300">
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Accepting (*)</span>
                              </span>
                            ) : st.isDead ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-rose-950/60 border border-rose-800/60 text-rose-300">
                                <span>Dead / Trap (∅)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                                <span>Non-Accepting</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
