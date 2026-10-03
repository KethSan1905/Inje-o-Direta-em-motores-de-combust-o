import React, { useState } from 'react';
import { Flame, ShieldAlert, Sparkles, AlertCircle, Wrench, CheckCircle2, ChevronRight } from 'lucide-react';

export const CarbonBuildupGuide: React.FC = () => {
  const [mileageKm, setMileageKm] = useState<number>(75000);

  // Derive severity based on km
  const getCarbonSeverity = (km: number) => {
    if (km < 25000) {
      return {
        stage: 'Estágio 1: Película Inicial',
        color: 'text-emerald-400',
        flowLoss: '2% a 5%',
        symptoms: 'Sem sintomas perceptíveis. Motor opera com desempenho nominal de fábrica.',
        recommendation: 'Troca rigorosa de óleo lubrificante de baixa volatilidade Noack e especificação API SP.'
      };
    } else if (km < 60000) {
      return {
        stage: 'Estágio 2: Incrustação Moderada',
        color: 'text-amber-400',
        flowLoss: '10% a 15%',
        symptoms: 'Leve hesitação na primeira partida a frio; resposta do acelerador sutilmente menos afiada.',
        recommendation: 'Inspeção boroscópica nos dutos de admissão; uso de combustível com aditivação de alta qualidade.'
      };
    } else {
      return {
        stage: 'Estágio 3: Carbonização Severa',
        color: 'text-rose-400',
        flowLoss: '20% a 32%',
        symptoms: 'Marcha lenta irregular, estalos na admissão a frio, falhas de combustão (Misfires P0300), perda sensível de potência sob carga.',
        recommendation: 'Descarbonização mecânica das válvulas via Jateamento com Casca de Noz (Walnut Blasting).'
      };
    }
  };

  const severity = getCarbonSeverity(mileageKm);
  const carbonOpacity = Math.min(0.95, (mileageKm / 120000) * 0.95);
  const carbonThickness = Math.min(18, (mileageKm / 120000) * 18);

  return (
    <section className="py-6">
      {/* Title */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Fisiologia da Falha Mecânica</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          O Calcanhar de Aquiles: Carbonização de Válvulas
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Como a injeção direta pulveriza o combustível direto no cilindro, a gasolina não passa pelo coletor nem atua como detergente. Os vapores de óleo do cárter (PCV) cozinham no dorso das válvulas superaquecidas.
        </p>
      </div>

      {/* Interactive Mileage Slider & Visual Valve Cutaway */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left: Interactive Valve Cross-Section SVG Diagram */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-semibold text-slate-300">
              Corte Seccional do Duto de Admissão
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {mileageKm.toLocaleString('pt-BR')} km rodados
            </span>
          </div>

          {/* SVG Visual of Intake Valve with Carbon Deposit */}
          <div className="my-4 relative w-full max-w-[340px] h-[240px] flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800 p-2">
            <svg viewBox="0 0 300 220" className="w-full h-full">
              {/* Intake Runner (Port) Aluminium Wall */}
              <path
                d="M 20 50 Q 150 45 200 130 L 220 180 L 170 180 L 150 140 Q 110 90 20 85 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Airflow Flow Lines (CFM) */}
              <path
                d="M 30 68 Q 120 68 180 160"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                opacity={Math.max(0.2, 1 - (mileageKm / 120000) * 0.7)}
              />
              <path
                d="M 30 78 Q 100 80 160 170"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity={Math.max(0.2, 1 - (mileageKm / 120000) * 0.7)}
              />

              {/* Valve Guide in Head */}
              <rect x="180" y="10" width="16" height="70" fill="#475569" stroke="#64748b" strokeWidth="1" />

              {/* Valve Stem (Haste) */}
              <rect x="185" y="10" width="6" height="135" fill="#cbd5e1" />

              {/* Valve Head & Tulip (Tulipa da Válvula) */}
              <path
                d="M 185 135 C 185 160 150 165 140 175 L 235 175 C 225 165 191 160 191 135 Z"
                fill="#94a3b8"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Dynamic Carbon Crust Deposition Overlay on Valve Back */}
              {carbonThickness > 0 && (
                <path
                  d={`M 182 135 Q 165 155 ${145 + carbonThickness * 0.5} ${173 - carbonThickness * 0.4} Q 185 ${162 - carbonThickness * 0.8} 185 135 Z`}
                  fill="#000000"
                  opacity={carbonOpacity}
                  stroke="#27272a"
                  strokeWidth="1.5"
                />
              )}
              {carbonThickness > 0 && (
                <path
                  d={`M 194 135 Q 212 155 ${230 - carbonThickness * 0.5} ${173 - carbonThickness * 0.4} Q 192 ${162 - carbonThickness * 0.8} 192 135 Z`}
                  fill="#000000"
                  opacity={carbonOpacity}
                  stroke="#27272a"
                  strokeWidth="1.5"
                />
              )}

              {/* Cylinder Valve Seat (Sede da Válvula) */}
              <rect x="130" y="175" width="12" height="6" fill="#f59e0b" />
              <rect x="235" y="175" width="12" height="6" fill="#f59e0b" />
            </svg>

            {/* Visual Callout */}
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500">
              Restrição de fluxo: <span className="text-rose-400 font-bold">{severity.flowLoss}</span>
            </div>
          </div>

          {/* Interactive KM Slider */}
          <div className="w-full mt-2 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Quilometragem do Veículo:</span>
              <span className="font-mono text-cyan-400 font-bold">{mileageKm.toLocaleString('pt-BR')} km</span>
            </div>
            <input
              type="range"
              min="0"
              max="150000"
              step="5000"
              value={mileageKm}
              onChange={(e) => setMileageKm(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 km (Novo)</span>
              <span>60.000 km</span>
              <span>150.000 km (Severo)</span>
            </div>
          </div>
        </div>

        {/* Right: Technical Diagnosis & Root Causes */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Diagnostic Status Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                Diagnóstico de Degradação
              </span>
              <span className={`text-xs font-bold font-mono ${severity.color}`}>
                {severity.stage}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                <span className="text-slate-400 block font-semibold mb-0.5">Sintomas Práticos:</span>
                <p className="text-slate-200 leading-relaxed">{severity.symptoms}</p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                <span className="text-slate-400 block font-semibold mb-0.5">Ação Recomendada:</span>
                <p className="text-slate-200 leading-relaxed">{severity.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Triad of Root Causes */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-white text-xs">Por que ocorre? A Tríade da Carbonização:</h4>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-white">1. Vapores de Óleo PCV:</strong> A ventilação do cárter joga vapores de óleo condensados de volta no duto de admissão para serem queimados.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-white">2. Recirculação EGR:</strong> Gases de escape com microfuligem são reinjetados no ar de admissão para conter óxidos de nitrogênio (NOx).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-white">3. Falta do Efeito Detergente:</strong> Sem spray de combustível no duto para lavar a válvula quente (&gt; 250°C), os óleos cozinham e formam carbono puro petrificado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions & Walnut Blasting Procedure */}
      <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-3">
          O Padrão Ouro de Recuperação: Walnut Blasting (Casca de Noz)
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Como os solventes em spray tradicionais aplicados via TBI não conseguem dissolver o carvão petrificado (e correm risco de calço hidráulico ou degradação do catalisador), as montadoras homologam o <strong>jateamento sob pressão de micropartículas de casca de noz moída</strong>. A casca de noz possui dureza ideal na escala Mohs: remove o carbono sem arranhar ou deformar o alumínio do cabeçote e a haste de aço da válvula vedada.
        </p>
      </div>
    </section>
  );
};
