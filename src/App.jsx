import React from 'react';
import { AutomataProvider, useAutomata } from './context/AutomataContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import NFABuilder from './components/nfa/NFABuilder';
import DFAView from './components/dfa/DFAView';
import VisualizerView from './components/graph/VisualizerView';
import StepByStepPlayer from './components/simulation/StepByStepPlayer';
import StringSimulatorView from './components/simulation/StringSimulatorView';

function MainContent() {
  const { activeTab } = useAutomata();

  return (
    <div className="flex-1 min-w-0">
      {activeTab === 'nfa' && <NFABuilder />}
      {activeTab === 'dfa' && <DFAView />}
      {activeTab === 'visualizer' && <VisualizerView />}
      {activeTab === 'walkthrough' && <StepByStepPlayer />}
      {(activeTab === 'tester' || activeTab === 'simulation') && <StringSimulatorView />}
    </div>
  );
}

export default function App() {
  return (
    <AutomataProvider>
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
        <Header />

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <Sidebar />
            <MainContent />
          </div>
        </div>

        <Footer />
      </div>
    </AutomataProvider>
  );
}
