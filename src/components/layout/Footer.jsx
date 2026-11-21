import React from 'react';
import { Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Automata Theory & Computability Project</span>
        </div>
        <p className="text-xs text-slate-500">
          Built with React 18, Vite, Tailwind CSS, React Flow & Lucide React
        </p>
      </div>
    </footer>
  );
}
