import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { generateConversionWalkthrough } from '../../algorithms/stepGenerator';
import AutomataGraphCanvas from '../graph/AutomataGraphCanvas';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2,
  Table,
  Activity,
  GitFork,
  FastForward
} from 'lucide-react';
import { formatSubsetDisplay } from '../../algorithms/nfaToDfa';

export default function StepByStepPlayer() {
  const { nfa, dfa, convertToDfa, validation } = useAutomata();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(2500); // ms per step

  // Generate steps dynamically from actual NFA and DFA data
  const steps = useMemo(() => {
    if (!dfa) return [];
    return generateConversionWalkthrough(nfa, dfa);
  }, [nfa, dfa]);

  // Keep index within bounds if steps change
  useEffect(() => {
    if (steps.length > 0 && currentStepIndex >= steps.length) {
      setCurrentStepIndex(steps.length - 1);
    }
  }, [steps, currentStepIndex]);

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

  const currentStep = steps[currentStepIndex] || null;

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
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
          <Activity className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Step-by-Step Conversion Walkthrough
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            To explore the step-by-step conversion player, we first need to execute the 
            Subset Construction algorithm on your current NFA.
          </p>
        </div>

        <button
          onClick={() => convertToDfa()}
          disabled={!validation.isValid}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 active:scale-95 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/25 mx-auto transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Convert NFA and Start Walkthrough</span>
        </button>
      </div>
    );
  }

  const progressPercent = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Workspace Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-800/80 to-blue-950/60 border border-indigo-500/30 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Interactive Educational Walkthrough</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Conversion Player
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Step through the subset construction algorithm one transition at a time. 
            Watch the NFA branches union into deterministic DFA states with live graph synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Playback Button Group */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              title="Restart from step 1"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              title="Previous step"
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={togglePlayPause}
              title={isPlaying ? 'Pause walkthrough' : 'Play automatic walkthrough'}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{currentStepIndex >= steps.length - 1 ? 'Replay' : 'Auto Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              title="Next step"
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-[11px] font-mono mr-1">Speed:</span>
            {[
              { label: '1x', ms: 2800 },
              { label: '1.5x', ms: 1800 },
              { label: '2x', ms: 1000 },
            ].map(({ label, ms }) => (
              <button
                key={label}
                onClick={() => setPlaybackSpeed(ms)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                  playbackSpeed === ms
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-700 text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Track */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Progress: {progressPercent}%</span>
            <span>{currentStep?.title}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Explanation Card */}
      {currentStep && (
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md backdrop-blur-sm space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-xs font-mono font-bold">
                Step {currentStep.stepNumber} of {steps.length}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {currentStep.title}
              </h2>
            </div>

            {currentStep.isNewState && (
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-500/50 flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New State Discovered: {currentStep.targetDfaState}</span>
              </span>
            )}
          </div>

          {/* Mathematical Transition Notation */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-center">
            <span className="text-[10px] uppercase font-sans font-bold text-slate-500 block mb-1">
              Formal Transition Equation
            </span>
            <div className="text-sm sm:text-base font-bold text-indigo-300 overflow-x-auto py-1">
              {currentStep.mathFormula}
            </div>
          </div>

          {/* Detailed Plain-Language Explanation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Explanation & Mechanics</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              {currentStep.explanation.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">›</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Dual Graphs with Real-Time Highlighting */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* NFA Canvas with Active Highlights */}
        <div>
          <AutomataGraphCanvas
            automaton={nfa}
            type="nfa"
            title="NFA State Diagram (Active Sources & Targets)"
            subtitle="Highlighted nodes & edges show states evaluated in this step"
            height="460px"
            highlight={currentStep?.nfaHighlight || {}}
          />
        </div>

        {/* DFA Canvas with Active Highlights */}
        <div>
          <AutomataGraphCanvas
            automaton={dfa}
            type="dfa"
            title="DFA State Diagram (Constructed State Space)"
            subtitle="Highlighted node shows current DFA state & active transition"
            height="460px"
            highlight={currentStep?.dfaHighlight || {}}
          />
        </div>
      </div>
    </div>
  );
}
