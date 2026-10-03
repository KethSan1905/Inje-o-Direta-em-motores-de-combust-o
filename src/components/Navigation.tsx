import React from 'react';
import { Gauge, RotateCcw } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onResetSimulation: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onResetSimulation
}) => {
  const navLinks = [
    { id: 'intro', label: 'Introdução' },
    { id: 'simulator', label: 'Simulador 4T' },
    { id: 'circuit', label: 'Circuito HPFP & Rail' },
    { id: 'comparison', label: 'Direta vs Indireta' },
    { id: 'carbon', label: 'Válvulas & Carbonização' },
    { id: 'calculator', label: 'Calculadora' },
    { id: 'diagnostics', label: 'Diagnóstico & Quiz' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Text Element Wordmark */}
        <button
          onClick={() => onTabChange('intro')}
          className="text-left font-bold text-lg tracking-tight text-white hover:text-cyan-400 transition-colors shrink-0"
        >
          GDI Engineering Lab
        </button>

        {/* Zone 2: 4-6 Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-slate-400">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                activeTab === item.id
                  ? 'text-cyan-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile view dropdown / selector */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {navLinks.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onResetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors whitespace-nowrap active:scale-95"
            title="Redefinir parâmetros do simulador para valores nominais"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redefinir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
