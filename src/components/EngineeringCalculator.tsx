import React, { useState } from 'react';
import { Calculator, Gauge, Thermometer, Clock, Droplets, Info } from 'lucide-react';

export const EngineeringCalculator: React.FC = () => {
  // Calculator 1: Latent Heat Cooling Calculator
  const [fuelType, setFuelType] = useState<'gasoline' | 'e27' | 'ethanol'>('gasoline');
  const [airTemp, setAirTemp] = useState<number>(45); // Air temp after intercooler °C

  // Calculator 2: Injector Window Calculator
  const [calcRpm, setCalcRpm] = useState<number>(5500);
  const [injAngleWindow, setInjAngleWindow] = useState<number>(90); // degrees of crank available for injection

  // Calculator 3: Droplet SMD Calculator
  const [injPressureBar, setInjPressureBar] = useState<number>(250);

  // Math for Calculator 1 (Latent Heat of Vaporization):
  // Delta T = (H_vap * (F/A)) / (c_p_air)
  // Gas: H_vap ~350 kJ/kg, AFR ~14.7, c_p ~1.005 kJ/kg.K -> Delta T ~ 350 / (14.7 * 1.005) ~ 23.7 K
  // Ethanol: H_vap ~850 kJ/kg, AFR ~9.0, c_p ~1.005 -> Delta T ~ 850 / (9.0 * 1.005) ~ 94 K
  // E27: weighted average
  const getLatentCooling = () => {
    let hVap = 350; // kJ/kg
    let afr = 14.7;
    let label = 'Gasolina Pura (E0)';

    if (fuelType === 'ethanol') {
      hVap = 840;
      afr = 9.0;
      label = 'Etanol Hidratado (E100)';
    } else if (fuelType === 'e27') {
      hVap = 480;
      afr = 13.1;
      label = 'Gasolina Brasileira (E27)';
    }

    const cpAir = 1.005; // kJ/kg*K
    const theoreticalDeltaT = hVap / (afr * cpAir);
    const realisticDeltaT = theoreticalDeltaT * 0.78; // accounting for cylinder wall heat transfer

    return {
      deltaT: Math.round(realisticDeltaT),
      finalTemp: Math.round(airTemp - realisticDeltaT),
      label
    };
  };

  const latentResult = getLatentCooling();

  // Math for Calculator 2:
  // Cycle time = 120 / RPM (for 720° 4-stroke)
  // Window time (ms) = (injAngleWindow / 720) * (120 / RPM) * 1000
  const cycleTimeMs = (120 / calcRpm) * 1000;
  const windowTimeMs = ((injAngleWindow / 720) * cycleTimeMs).toFixed(2);

  // Math for Calculator 3 (Droplet SMD):
  // SMD approx = 200 * (P_inj / 3)^(-0.35)
  const smdMicrons = Math.max(
    3.5,
    Math.round(180 * Math.pow(Math.max(1, injPressureBar) / 4, -0.36) * 10) / 10
  );

  return (
    <section className="py-6">
      {/* Title */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
          <Calculator className="w-4 h-4" />
          <span>Física & Modelagem Matemática</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Calculadora de Engenharia Automotiva
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Simule as grandezas termodinâmicas que justificam a superioridade da injeção direta: resfriamento latente por evaporação, restrição de tempo em milissegundos e atomização de microgotículas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Module 1: Latent Heat Cooling */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wide mb-2">
              <Thermometer className="w-4 h-4" />
              <span>Resfriamento Latente da Câmara</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Calcule a queda real de temperatura ($\Delta T$) provocada pela evaporação direta do combustível dentro do cilindro.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tipo de Combustível:</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setFuelType('gasoline')}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors text-[11px] ${
                      fuelType === 'gasoline'
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Gasolina E0
                  </button>
                  <button
                    onClick={() => setFuelType('e27')}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors text-[11px] ${
                      fuelType === 'e27'
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Gasolina E27
                  </button>
                  <button
                    onClick={() => setFuelType('ethanol')}
                    className={`py-1.5 px-2 rounded font-medium border text-center transition-colors text-[11px] ${
                      fuelType === 'ethanol'
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Etanol E100
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Temperatura do Ar Admitido:</span>
                  <span className="font-mono text-white font-bold">{airTemp} °C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={airTemp}
                  onChange={(e) => setAirTemp(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Redução de Temperatura (ΔT):</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                -{latentResult.deltaT} °C
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Temp. Efetiva Pós-Injeção:</span>
              <span className="text-sm font-bold font-mono text-white">
                {latentResult.finalTemp} °C
              </span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              {fuelType === 'ethanol'
                ? 'O etanol possui calor latente 2,4x maior que a gasolina, permitindo taxas de compressão altíssimas sem risco de detonação.'
                : 'O resfriamento latente da gasolina equivale a um ganho de aproximadamente 2 a 3 pontos de octanagem RON.'}
            </p>
          </div>
        </div>

        {/* Module 2: Injection Window vs RPM */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">
              <Clock className="w-4 h-4" />
              <span>Janela Crítica de Tempo (ms)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Por que a injeção direta precisa de tanta pressão? Em alta rotação, o bico só tem uma fração de milissegundo para injetar todo o combustível!
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Rotação do Motor (RPM):</span>
                  <span className="font-mono text-amber-400 font-bold">{calcRpm} RPM</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="7500"
                  step="250"
                  value={calcRpm}
                  onChange={(e) => setCalcRpm(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Ângulo da Janela de Injeção:</span>
                  <span className="font-mono text-white font-bold">{injAngleWindow}° virabrequim</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  step="5"
                  value={injAngleWindow}
                  onChange={(e) => setInjAngleWindow(Number(e.target.value))}
                  className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Tempo Total do Ciclo 720°:</span>
              <span className="text-xs font-mono text-slate-300">
                {cycleTimeMs.toFixed(1)} ms
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Tempo Útil de Injeção:</span>
              <span className="text-lg font-bold font-mono text-amber-400">
                {windowTimeMs} ms
              </span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              Em {calcRpm} RPM, todo o combustível para alimentar a aceleração precisa ser dosado em meros {windowTimeMs} milissegundos.
            </p>
          </div>
        </div>

        {/* Module 3: Droplet SMD vs Injection Pressure */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wide mb-2">
              <Droplets className="w-4 h-4" />
              <span>Atomização & Diâmetro SMD (µm)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Relação física entre a pressão hidrostática do rail e o Diâmetro Médio de Sauter (SMD) das microgotas formadas.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Pressão de Injeção:</span>
                  <span className="font-mono text-rose-400 font-bold">{injPressureBar} bar</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="2500"
                  step="10"
                  value={injPressureBar}
                  onChange={(e) => setInjPressureBar(Number(e.target.value))}
                  className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>4 bar (MPI)</span>
                  <span>350 bar (GDI)</span>
                  <span>2500 bar (Diesel)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Diâmetro Médio da Gota (SMD):</span>
              <span className="text-lg font-bold font-mono text-rose-400">
                {smdMicrons} µm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Área de Contato Líquido/Ar:</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {injPressureBar < 10 ? 'Linha Base (1x)' : `${Math.round(Math.pow(120 / smdMicrons, 2))}x maior`}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              Gotas menores vaporizam em menos de 0,5 ms, permitindo queima limpa e completa antes de tocarem a parede fria do cilindro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
