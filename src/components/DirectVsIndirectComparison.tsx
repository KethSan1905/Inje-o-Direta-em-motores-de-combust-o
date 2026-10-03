import React, { useState } from 'react';
import { ArrowLeftRight, Check, X, ShieldAlert, Sparkles, Droplet, Flame, Zap } from 'lucide-react';

interface ComparisonFeature {
  metric: string;
  mpi: string;
  gdi: string;
  dual: string;
  winner: 'gdi' | 'mpi' | 'dual' | 'tie';
  explanation: string;
}

const COMPARISON_DATA: ComparisonFeature[] = [
  {
    metric: 'Local da Injeção',
    mpi: 'Coletor / Duto de admissão (fora da câmara)',
    gdi: 'Diretamente dentro do cilindro',
    dual: 'Ambos: 1 no duto + 1 na câmara por cilindro',
    winner: 'dual',
    explanation: 'A injeção direta ganha em controle de combustão; a indireta ganha em homogeneização em baixa carga. O sistema duplo combina ambas.'
  },
  {
    metric: 'Pressão de Trabalho',
    mpi: '3 a 5 bar (baixa pressão)',
    gdi: '150 a 350+ bar (alta pressão mecânica)',
    dual: '4 bar (baixa) + 200 bar (alta) comutáveis',
    winner: 'gdi',
    explanation: 'Pressões elevadas pulverizam o combustível em microgotículas ultrafinas que vaporizam e queimam em milissegundos.'
  },
  {
    metric: 'Resfriamento Latente da Câmara',
    mpi: 'Inexistente (combustível vaporiza no coletor)',
    gdi: 'Alto (absorve calor direto do ar comprimido)',
    dual: 'Ativado em regimes de média e alta carga',
    winner: 'gdi',
    explanation: 'Ao vaporizar dentro do cilindro, o combustível absorve calor latente, reduzindo a temperatura do ar em até 25°C e combatendo a detonação (batida de pino).'
  },
  {
    metric: 'Taxa de Compressão & Turbo',
    mpi: 'Limitada a 9.5:1 a 10.5:1 em turbos',
    gdi: 'Permite 10.5:1 até 13.0:1 mesmo com turbo',
    dual: 'Otimizada até 12.0:1 a 13.0:1',
    winner: 'gdi',
    explanation: 'Maior taxa de compressão resulta diretamente em maior rendimento térmico e mais torque com menor consumo de combustível.'
  },
  {
    metric: 'Limpeza das Válvulas de Admissão',
    mpi: 'Excelente (gasolina atua como solvente contínuo)',
    gdi: 'Nula (propensa a carbonização severa por PCV/EGR)',
    dual: 'Excelente (bico indireto limpa em baixa carga)',
    winner: 'dual',
    explanation: 'No GDI puro, o combustível nunca toca as válvulas de admissão, permitindo que resíduos de vapor de óleo do cárter formem crostas de carvão no dorso da válvula.'
  },
  {
    metric: 'Emissão de Particulados (Fuligem / PM)',
    mpi: 'Muito baixa (mistura tem tempo hábil para homogeneizar)',
    gdi: 'Elevada (tempo curto de mistura gera microbolsas ricas)',
    dual: 'Baixa (usa indireta na cidade/baixa rotação)',
    winner: 'dual',
    explanation: 'Motores GDI puros exigem o filtro GPF (Gasoline Particulate Filter) no escapamento para reter a fuligem gerada pela queima rápida.'
  },
  {
    metric: 'Resposta Dinâmica de Aceleração',
    mpi: 'Atraso perceptível (película líquida na parede do duto)',
    gdi: 'Instantânea (combustível entra pronto no cilindro)',
    dual: 'Instantânea quando a direta atua',
    winner: 'gdi',
    explanation: 'Em motores indiretos, acelerações bruscas exigem enriquecimento transitório porque parte da gasolina molha as paredes do coletor antes de chegar ao cilindro.'
  },
  {
    metric: 'Custo & Sensibilidade a Combustível',
    mpi: 'Baixo custo de peças; alta tolerância a impurezas',
    gdi: 'Alto custo de bicos/bomba; sensível a solvente/água',
    dual: 'Custo mais alto (8 bicos + 2 galerias)',
    winner: 'mpi',
    explanation: 'Bicos de alta precisão com orifícios microscópicos a laser e bombas HPFP com folgas de 2 micras desgastam rapidamente com combustível adulterado.'
  }
];

export const DirectVsIndirectComparison: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<'mpi' | 'gdi' | 'dual'>('gdi');

  return (
    <section className="py-6">
      {/* Title */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
          <ArrowLeftRight className="w-4 h-4" />
          <span>Engenharia Comparada</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Injeção Direta (GDI) vs Indireta (MPI) vs Dupla Injeção
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Compare lado a lado as vantagens de rendimento térmico, as limitações de carbonização e por que sistemas modernos como Toyota D-4S e VW EA888 adotam 8 injetores.
        </p>
      </div>

      {/* Visual Architectural Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Card 1: MPI */}
        <div
          onClick={() => setSelectedSystem('mpi')}
          className={`cursor-pointer rounded-xl p-5 border transition-all ${
            selectedSystem === 'mpi'
              ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Sistema 01</span>
            <span className="text-[11px] font-mono text-slate-400">3 a 5 bar</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Injeção Indireta (MPI)</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            O bico pulveriza no duto antes da válvula de admissão. Mantém as válvulas limpas como solvente, mas tem menor rendimento térmico.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>Autolimpeza constante das válvulas</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Sem resfriamento de câmara (risco de knock)</span>
            </div>
          </div>
        </div>

        {/* Card 2: GDI */}
        <div
          onClick={() => setSelectedSystem('gdi')}
          className={`cursor-pointer rounded-xl p-5 border transition-all ${
            selectedSystem === 'gdi'
              ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-semibold">Sistema 02 (Puro)</span>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">150 a 350+ bar</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Injeção Direta (GDI)</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Pulverização supersônica na câmara. Resfriamento latente permite taxas de compressão agressivas e downsizing extremo com turbo.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>+15% a 20% de torque e eficiência térmica</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Carbonização de válvulas & fuligem (GPF)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Dual Injection */}
        <div
          onClick={() => setSelectedSystem('dual')}
          className={`cursor-pointer rounded-xl p-5 border transition-all ${
            selectedSystem === 'dual'
              ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-semibold">Sistema 03 (Misto)</span>
            <span className="text-[11px] font-mono text-amber-400 font-semibold">Dupla Galeria</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Injeção Dupla (D-4S / Mista)</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            8 injetores em 4 cilindros. Utiliza o bico indireto na cidade para limpar válvulas e o bico direto na estrada para força máxima.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>O melhor dos dois mundos (potência + válvulas limpas)</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Maior complexidade e custo de manufatura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Parameter Comparison Table */}
      <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">
            Matriz de Especificações & Parâmetros Físicos
          </h4>
          <span className="text-xs text-slate-400 font-mono">Normas SAE J1930 / ISO 27145</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Parâmetro de Engenharia</th>
                <th className="py-3 px-4">Injeção Indireta (MPI)</th>
                <th className="py-3 px-4 text-cyan-400">Injeção Direta (GDI)</th>
                <th className="py-3 px-4 text-amber-400">Injeção Dupla (Mista)</th>
                <th className="py-3 px-4">Análise Técnica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                    {row.metric}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {row.mpi}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300 font-medium">
                    {row.gdi}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-300">
                    {row.dual}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 leading-snug min-w-[240px]">
                    {row.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
