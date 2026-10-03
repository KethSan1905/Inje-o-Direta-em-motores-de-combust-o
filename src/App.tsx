/**
 * GDI Lab - Motores de Injeção Direta de Combustão
 * Interactive Automotive Engineering Simulator & Technical Guide
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { IntroductionPage } from './components/IntroductionPage';
import { CylinderSimulator } from './components/CylinderSimulator';
import { FuelCircuitExplorer } from './components/FuelCircuitExplorer';
import { DirectVsIndirectComparison } from './components/DirectVsIndirectComparison';
import { CarbonBuildupGuide } from './components/CarbonBuildupGuide';
import { EngineeringCalculator } from './components/EngineeringCalculator';
import { TroubleshootingQuiz } from './components/TroubleshootingQuiz';
import { Gauge, Zap, Flame, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('intro');

  const handleResetSimulation = () => {
    setActiveTab('intro');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col bg-tech-grid">
      {/* 3-Zone Top Navigation Contract */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetSimulation={handleResetSimulation}
      />

      {/* Hero Header Area */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                <Flame className="w-4 h-4" />
                <span>Termodinâmica & Fluidodinâmica de Motores de Combustão</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Motores de Injeção Direta de Combustão
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Plataforma técnica interativa sobre sistemas <strong>GDI</strong>, <strong>TSI/TFSI</strong>, <strong>Common Rail Diesel</strong> e <strong>Injeção Dupla</strong>. Analise a física da pulverização a alta pressão, resfriamento latente na câmara, estratégias de mistura e diagnósticos preventivos.
              </p>
            </div>

            {/* Quick Highlight Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Pressão do Rail</span>
                <span className="text-xl font-bold font-mono text-cyan-400">até 2.500 <span className="text-xs text-slate-500">bar</span></span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Microatomização a laser</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Resfriamento Latente</span>
                <span className="text-xl font-bold font-mono text-amber-400">até -25 <span className="text-xs text-slate-500">°C</span></span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Supressão de detonação</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Tamanho da Gota</span>
                <span className="text-xl font-bold font-mono text-rose-400">4 a 15 <span className="text-xs text-slate-500">µm</span></span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Vaporização imediata</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Eficiência Térmica</span>
                <span className="text-xl font-bold font-mono text-emerald-400">até 42 <span className="text-xs text-slate-500">%</span></span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Downsizing com turbo</span>
              </div>
            </div>
          </div>

          {/* Quick Module Jump Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-800/80 mt-6 no-scrollbar text-xs">
            <span className="text-slate-500 font-mono shrink-0 mr-1">Módulos:</span>
            {[
              { id: 'intro', label: 'Introdução Teórica' },
              { id: 'simulator', label: '1. Simulador 4T (0.25x)' },
              { id: 'circuit', label: '2. Circuito HPFP & Rail' },
              { id: 'comparison', label: '3. Direta vs Indireta (MPI)' },
              { id: 'carbon', label: '4. Carbonização de Válvulas' },
              { id: 'calculator', label: '5. Calculadora do Engenheiro' },
              { id: 'diagnostics', label: '6. Diagnósticos OBD & Quiz' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {activeTab === 'intro' && (
          <IntroductionPage
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {activeTab === 'simulator' && <CylinderSimulator />}
        {activeTab === 'circuit' && <FuelCircuitExplorer />}
        {activeTab === 'comparison' && <DirectVsIndirectComparison />}
        {activeTab === 'carbon' && <CarbonBuildupGuide />}
        {activeTab === 'calculator' && <EngineeringCalculator />}
        {activeTab === 'diagnostics' && <TroubleshootingQuiz />}
      </main>

      {/* Technical Automotive Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-300">GDI Engineering Lab</span>
            <span className="mx-2">·</span>
            <span>Manual Técnico de Sistemas de Injeção Direta</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Normas SAE J1930 / ISO 27145</span>
            <span>·</span>
            <span>Ciclos Otto e Diesel</span>
            <span>·</span>
            <span>Bosch Automotive Handbook 11th Ed.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
