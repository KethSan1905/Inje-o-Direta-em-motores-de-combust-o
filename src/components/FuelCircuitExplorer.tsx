import React, { useState } from 'react';
import { FUEL_CIRCUIT_COMPONENTS } from '../data/engineData';
import { FuelCircuitComponent } from '../types/engine';
import { Activity, AlertTriangle, CheckCircle, Wrench, Shield, ArrowRight, Gauge, Cpu } from 'lucide-react';

export const FuelCircuitExplorer: React.FC = () => {
  const [selectedComponentId, setSelectedComponentId] = useState<string>('hpfp');

  const selectedComponent: FuelCircuitComponent =
    FUEL_CIRCUIT_COMPONENTS.find((c) => c.id === selectedComponentId) || FUEL_CIRCUIT_COMPONENTS[1];

  return (
    <section className="py-6">
      {/* Module Title */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
          <Activity className="w-4 h-4" />
          <span>Arquitetura Eletromecânica de Combustível</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Circuito de Alta Pressão & Common Rail
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Entenda o fluxo físico do combustível: desde a bomba de pré-alimentação no tanque (4 bar) até a compressão mecânica na HPFP e pulverização supersônica na câmara (até 350+ bar Otto / 2.500 bar Diesel).
        </p>
      </div>

      {/* Interactive Circuit Schematic Diagram (SVG + Hotspots) */}
      <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="text-xs font-semibold text-slate-300 mb-4 flex items-center justify-between">
          <span>Esquema Hidráulico Interativo do Circuito</span>
          <span className="text-slate-500 text-[11px]">Clique em um componente para inspecionar</span>
        </div>

        {/* SVG Flow diagram */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="min-w-[700px] flex items-center justify-between relative py-6 px-4 bg-slate-950 rounded-lg border border-slate-800">
            {/* Hydraulic Pipe Graphic Behind Nodes */}
            <div className="absolute top-1/2 left-16 right-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-sky-400 to-rose-500 z-0 opacity-40" />

            {/* Circuit Nodes */}
            {FUEL_CIRCUIT_COMPONENTS.map((item, index) => {
              const isSelected = item.id === selectedComponentId;
              const isHighPressure = item.id === 'hpfp' || item.id === 'rail' || item.id === 'injectors';

              return (
                <div key={item.id} className="relative z-10 flex flex-col items-center">
                  <button
                    onClick={() => setSelectedComponentId(item.id)}
                    className={`group flex flex-col items-center p-3 rounded-lg border transition-all text-center max-w-[130px] ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg scale-105'
                        : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500 hover:bg-slate-850'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold mb-2 transition-colors ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950'
                          : isHighPressure
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-sky-950 text-sky-300 border border-sky-800'
                      }`}
                    >
                      0{index + 1}
                    </div>

                    <span className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-400">
                      {item.title.split('(')[0].trim()}
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono mt-1">
                      {item.pressureRange.split('|')[0].trim()}
                    </span>
                  </button>

                  {/* Flow Arrow */}
                  {index < FUEL_CIRCUIT_COMPONENTS.length - 1 && (
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 text-slate-500 hidden sm:block">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend strip */}
        <div className="flex flex-wrap items-center gap-6 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Circuito de Baixa Pressão (4 a 7 bar)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Circuito de Alta Pressão Mecânica (150 a 350+ bar)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Câmara de Combustão & Pistão Conformado</span>
          </div>
        </div>
      </div>

      {/* Selected Component Deep Dive Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Specification Column */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wide">
                {selectedComponent.subTitle}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {selectedComponent.title}
              </h3>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-right shrink-0">
              <span className="text-[10px] text-slate-500 block">Faixa de Pressão</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {selectedComponent.pressureRange}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Descrição Técnica
              </h4>
              <p className="leading-relaxed bg-slate-950/40 p-3 rounded border border-slate-800/60 text-xs">
                {selectedComponent.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Princípio Físico de Operação
              </h4>
              <p className="leading-relaxed bg-slate-950/40 p-3 rounded border border-slate-800/60 text-xs">
                {selectedComponent.operatingPrinciple}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tolerâncias Críticas de Fabricação
              </h4>
              <p className="leading-relaxed bg-slate-950/40 p-3 rounded border border-slate-800/60 text-xs font-mono text-cyan-300">
                {selectedComponent.criticalTolerances}
              </p>
            </div>
          </div>
        </div>

        {/* Right Workshop & Troubleshooting Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Failure Symptoms */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Sintomas de Falha Mecânica / Eletrônica</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-rose-950/20 border border-rose-900/30 p-3 rounded">
              {selectedComponent.failureSymptoms}
            </p>
          </div>

          {/* Maintenance & Reliability Tip */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-2">
              <Wrench className="w-4 h-4 shrink-0" />
              <span>Diretriz de Oficina & Engenharia Preventiva</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/20 border border-emerald-900/30 p-3 rounded">
              {selectedComponent.maintenanceTip}
            </p>
          </div>

          {/* Micro-Droplet Physics Highlight */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Gauge className="w-3.5 h-3.5" />
              <span>Por que pressões tão elevadas?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Quanto maior a pressão de injeção, menor o diâmetro médio de Sauter (SMD) das gotas. A 350 bar, a gasolina se desintegra em microgotas de 10 micras, aumentando a área superficial de contato em mais de 100x e permitindo queima quase instantânea antes que detonações espontâneas ocorram.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
