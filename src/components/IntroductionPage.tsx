import React from 'react';
import {
  BookOpen,
  History,
  Zap,
  Gauge,
  ShieldAlert,
  Flame,
  Droplet,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface IntroductionPageProps {
  onNavigateToTab: (tabId: string) => void;
}

export const IntroductionPage: React.FC<IntroductionPageProps> = ({ onNavigateToTab }) => {
  const timelineMilestones = [
    {
      era: 'Até os anos 1980',
      title: 'Carburador Mecânico',
      pressure: '~0.2 bar (gravidade/vácuo)',
      summary: 'O fluxo de ar aspirado arrastava o combustível por efeito Venturi. Dosagem imprecisa, alto desperdício e emissões elevadas.'
    },
    {
      era: 'Anos 1990 - 2000',
      title: 'Injeção Indireta Multiponto (MPI / PFI)',
      pressure: '3 a 5 bar',
      summary: 'Um bico injetor por cilindro localizado no coletor de admissão pulveriza a gasolina antes da válvula. Boa homogeneização e válvulas sempre limpas.'
    },
    {
      era: 'Anos 2000 - Presente',
      title: 'Injeção Direta de Alta Pressão (GDI / TSI / Common Rail)',
      pressure: '150 a 350+ bar (Otto) | até 2.500 bar (Diesel)',
      summary: 'O combustível é pulverizado sob pressão extrema direto na câmara de combustão. Permite taxas de compressão altas e turbocompressão sem detonação.'
    },
    {
      era: 'Modernidade (2015+)',
      title: 'Injeção Dupla / Mista (Dual Injection: Direta + Indireta)',
      pressure: '4 bar + 250 bar comutáveis',
      summary: 'Utiliza 2 bicos por cilindro (8 bicos em 4 cilindros). Usa indireta em baixa carga para limpar válvulas e direta em alta carga para máxima potência.'
    }
  ];

  const corePillars = [
    {
      number: '01',
      title: 'Admissão Isolada de Ar Puro',
      desc: 'Pelas válvulas de admissão entra exclusivamente ar filtrado, sem combustível previamente misturado, aumentando a massa de ar aspirada (eficiência volumétrica).'
    },
    {
      number: '02',
      title: 'Atomização em Microgotículas',
      desc: 'Com pressões de 150 a mais de 2.500 bar, o combustível é pulverizado em gotas de 4 a 15 micrômetros, que vaporizam quase instantaneamente ao tocar o ar comprimido.'
    },
    {
      number: '03',
      title: 'Resfriamento Latente da Câmara',
      desc: 'A evaporação direta absorve calor latente do ar comprimido dentro do cilindro, reduzindo a temperatura em até 25°C e combatendo a autoignição prematura (batida de pino).'
    },
    {
      number: '04',
      title: 'Downsizing com Turbocompressão',
      desc: 'Por suportar taxas de compressão mais altas sem detonar, possibilitou criar motores menores (1.0 a 2.0 litros) gerando o torque e potência de motores V6 e V8 antigos com 30% menos consumo.'
    }
  ];

  const glossaryItems = [
    {
      term: 'GDI',
      meaning: 'Gasoline Direct Injection',
      desc: 'Sigla genérica para sistemas de injeção direta de combustível em motores de ciclo Otto a gasolina ou flex.'
    },
    {
      term: 'TSI / TFSI',
      meaning: 'Turbocharged Stratified Injection',
      desc: 'Nomenclatura comercial do Grupo Volkswagen/Audi para motores combinando injeção direta e turbocompressor.'
    },
    {
      term: 'HPFP',
      meaning: 'High-Pressure Fuel Pump',
      desc: 'Bomba mecânica de alta pressão acionada diretamente por um lóbulo do eixo do comando de válvulas do motor.'
    },
    {
      term: 'Common Rail',
      meaning: 'Galeria Distribuidora Única',
      desc: 'Tubo forjado que atua como reservatório acumulador sob altíssima pressão hidráulica para todos os injetores.'
    },
    {
      term: 'Carga Estratificada',
      meaning: 'Lean Burn Stratified Charge',
      desc: 'Modo onde o combustível é injetado perto da vela de ignição, deixando o restante do cilindro apenas com ar em excesso (λ > 1.8).'
    },
    {
      term: 'GPF',
      meaning: 'Gasoline Particulate Filter',
      desc: 'Filtro cerâmico no escapamento obrigatório em motores GDI modernos para reter a fuligem fina de combustão.'
    },
    {
      term: 'LSPI',
      meaning: 'Low-Speed Pre-Ignition',
      desc: 'Detonação prematura severa em baixas rotações e alta carga provocada por gotículas de óleo/combustível incandescentes.'
    },
    {
      term: 'Walnut Blasting',
      meaning: 'Jateamento de Casca de Noz',
      desc: 'Procedimento padrão homologado para descarbonizar o dorso das válvulas de admissão sem danificar o metal do motor.'
    }
  ];

  return (
    <section className="py-6 space-y-12">
      {/* Introduction Hero Section */}
      <div className="pb-8 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Fundamentos & Visão Geral de Engenharia</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-3xl">
          Introdução aos Motores de Injeção Direta de Combustão
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          A injeção direta de combustível representa o salto tecnológico mais significativo na termodinâmica dos motores de combustão interna das últimas décadas. Ao transferir a pulverização do coletor de admissão para o interior do cilindro sob pressões de até 350 bar (gasolina) ou 2.500 bar (diesel), a engenharia redefiniu os limites de potência, rendimento térmico e emissões.
        </p>

        {/* Quick Launch CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateToTab('simulator')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md active:scale-95"
          >
            <Gauge className="w-4 h-4" />
            <span>Abrir Simulador do Pistão (Velocidade 0.25x)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigateToTab('comparison')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors"
          >
            <span>Comparar Direta vs Indireta</span>
          </button>
        </div>
      </div>

      {/* Conceptual Diagram: Indirect vs Direct Fuel Path */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">
          A Diferença Fundamental de Arquitetura
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mb-6">
          Observe onde a mistura de ar e combustível ocorre em cada sistema e por que essa mudança geométrica altera toda a termodinâmica do motor:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Injeção Indireta MPI */}
          <div className="bg-slate-950 rounded-lg p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase">Sistema Convencional</span>
              <span className="text-[11px] font-mono text-slate-400">3 a 5 bar</span>
            </div>
            <h4 className="text-base font-bold text-white">Injeção Indireta no Coletor (MPI / PFI)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              O bico injetor fica no <strong>duto de admissão</strong>, antes da válvula. O combustível é borrifado contra o dorso da válvula quente, vaporizando antes de entrar no cilindro.
            </p>
            <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>O combustível líquido atua como solvente contínuo mantendo as válvulas limpas.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                <span>Sem resfriamento interno da câmara: propensão à detonação em altas taxas de compressão.</span>
              </div>
            </div>
          </div>

          {/* Card: Injeção Direta GDI */}
          <div className="bg-slate-950 rounded-lg p-5 border border-cyan-500/40 ring-1 ring-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">Injeção Direta</span>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">150 a 350+ bar</span>
            </div>
            <h4 className="text-base font-bold text-white">Injeção Direta na Câmara (GDI / Common Rail)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              O bico injetor fica <strong>dentro do cabeçote</strong>, apontando diretamente para o topo do pistão. Apenas ar puro passa pelas válvulas de admissão.
            </p>
            <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Resfriamento latente imediato por vaporização: permite turbo com compressão 11:1+.</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Como a gasolina não passa no duto, os vapores de óleo do respiro (PCV) carbonizam a válvula.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Evolution Timeline */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <History className="w-4 h-4" />
            <span>Linha do Tempo Tecnológica</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            A Evolução dos Sistemas de Alimentação
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timelineMilestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">
                  {m.era}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  {m.title}
                </h4>
                <div className="text-[11px] font-mono text-cyan-400 font-semibold mt-1">
                  {m.pressure}
                </div>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {m.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 4 Core Engineering Pillars */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Física Aplicada</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            Os 4 Pilares da Superioridade Térmica
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corePillars.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex items-start gap-4"
            >
              <span className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                {pillar.number}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {pillar.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Glossary Matrix */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            Glossário Técnico Automotivo Essencial
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Principais termos, siglas e componentes usados no diagnóstico e na engenharia de motores GDI e Common Rail:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {glossaryItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {item.term}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">
                {item.meaning}
              </span>
              <p className="text-[11px] text-slate-400 leading-snug pt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Navigation Pathways */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-2">
          Pronto para explorar o funcionamento na prática?
        </h3>
        <p className="text-xs text-slate-400 max-w-2xl mb-4 leading-relaxed">
          Navegue pelas ferramentas interativas desenvolvidas para compreender a cinemática do pistão em velocidade reduzida, simular a atomização do bico e calcular a termodinâmica da câmara:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigateToTab('simulator')}
            className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-left transition-all group"
          >
            <div>
              <span className="text-xs font-bold text-white group-hover:text-cyan-400">
                1. Simulador do Pistão 4T
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Velocidade 0.25x e indicador de fases
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => onNavigateToTab('circuit')}
            className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-left transition-all group"
          >
            <div>
              <span className="text-xs font-bold text-white group-hover:text-cyan-400">
                2. Circuito HPFP & Common Rail
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Esquema hidráulico de 4 a 2.500 bar
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => onNavigateToTab('carbon')}
            className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-left transition-all group"
          >
            <div>
              <span className="text-xs font-bold text-white group-hover:text-cyan-400">
                3. Carbonização de Válvulas
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Simulador por quilometragem e soluções
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>
    </section>
  );
};
