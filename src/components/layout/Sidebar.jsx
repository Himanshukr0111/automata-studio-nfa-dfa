import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { PRESET_NFAS } from '../../core/nfa';
import { 
  GitFork, 
  Table, 
  Network, 
  PlayCircle, 
  Binary,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, loadExample, dfa } = useAutomata();

  const navItems = [
    {
      id: 'nfa',
      label: 'NFA Builder',
      desc: 'Define 5-tuple & transitions',
      icon: GitFork,
      status: 'active',
      badge: 'Phase 2',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'dfa',
      label: 'DFA Converter',
      desc: dfa ? `${dfa.states.length} states generated` : 'Subset construction table',
      icon: Table,
      status: 'active',
      badge: 'Phase 3',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'visualizer',
      label: 'Graph Visualizer',
      desc: 'Dual React Flow state graphs',
      icon: Network,
      status: 'active',
      badge: 'Phase 4',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'walkthrough',
      label: 'Step Player',
      desc: 'Subset construction walkthrough',
      icon: PlayCircle,
      status: 'active',
      badge: 'Phase 5',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'tester',
      label: 'String Simulator',
      desc: 'Interactive acceptance testing',
      icon: Binary,
      status: 'active',
      badge: 'Phase 6',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
      {/* Navigation Card */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-3">
          Simulator Modules
        </h3>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isClickable = item.status === 'active';

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isClickable) {
                    setActiveTab(item.id);
                  }
                }}
                disabled={!isClickable}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : isClickable
                    ? 'hover:bg-slate-700/60 text-slate-200'
                    : 'opacity-50 cursor-not-allowed text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semibold truncate leading-tight">
                      {item.label}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ml-2 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Preset Library Card */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 px-1 text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Automata Presets
          </h3>
        </div>
        <div className="space-y-2">
          {PRESET_NFAS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadExample(preset.id)}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-blue-500/40 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-blue-300 flex items-center justify-between">
                <span>{preset.name}</span>
                <span className="text-[10px] text-slate-500 group-hover:text-slate-400">Load</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Formal Automata Reference */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 text-xs text-slate-400 space-y-2.5">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span>String Acceptance Theory</span>
        </div>
        <p className="font-mono text-slate-200 bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-[11px] leading-relaxed">
          w &isin; L(M) &hArr; &delta;*(q0, w) &isin; F
        </p>
        <ul className="space-y-1 text-[11px] text-slate-400">
          <li>• Start at initial DFA state q'0</li>
          <li>• Consume symbols one-by-one deterministically</li>
          <li>• Accepted if final state belongs to F'</li>
          <li>• Rejected if final state not in F' or trapped</li>
        </ul>
      </div>
    </aside>
  );
}
