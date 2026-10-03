import React, { useState } from 'react';
import { DIAGNOSTIC_CASES, QUIZ_QUESTIONS } from '../data/engineData';
import { DiagnosticCase, QuizQuestion } from '../types/engine';
import { Stethoscope, HelpCircle, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export const TroubleshootingQuiz: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'quiz'>('diagnostics');
  const [selectedCaseCode, setSelectedCaseCode] = useState<string>('P0087');

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const selectedCase: DiagnosticCase =
    DIAGNOSTIC_CASES.find((c) => c.dtcCode === selectedCaseCode) || DIAGNOSTIC_CASES[0];

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowExplanation({});
  };

  // Score calculation
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <section className="py-6">
      {/* Title */}
      <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Validação Técnica & Oficina</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Guia de Diagnóstico & Quiz de Engenharia
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Solucione falhas do mundo real (DTC P0087, misfires, desgaste de tucho de bomba HPFP) e teste seus conhecimentos com o quiz de engenharia automotiva.
          </p>
        </div>

        {/* Tab switch between Diagnostics and Quiz */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Casos de Diagnóstico (DTC)
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quiz de Engenharia ({correctCount}/{totalQuestions})
          </button>
        </div>
      </div>

      {/* Mode 1: Diagnostic Cases */}
      {activeTab === 'diagnostics' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* DTC Code List Left */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Falhas Comuns em Injeção Direta:
            </span>
            {DIAGNOSTIC_CASES.map((item) => {
              const isSelected = item.dtcCode === selectedCaseCode;
              return (
                <button
                  key={item.dtcCode}
                  onClick={() => setSelectedCaseCode(item.dtcCode)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-400">
                      {item.dtcCode}
                    </span>
                    <span className="text-[10px] text-slate-500">OBD-II / EOBD</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {item.systemAffected}
                  </p>
                </button>
              );
            })}
          </div>

          {/* DTC Detail Sheet Right */}
          <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400">
                  Código: {selectedCase.dtcCode}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedCase.title}
                </h3>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Sistema Afetado: {selectedCase.systemAffected}
                </span>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Sintomas Clínicos no Veículo:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedCase.primarySymptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Root Causes */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                Causas Raízes Mais Frequentes:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedCase.rootCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step by step diagnostic protocol */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Procedimento de Teste com Scanner & Manômetro:
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                {selectedCase.diagnosticSteps.map((step, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-[11px] leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Final Solution */}
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-lg">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block mb-1">
                Solução Definitiva Recomendada:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedCase.solution}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Automotive Engineering Quiz */}
      {activeTab === 'quiz' && (
        <div className="mt-6 space-y-6">
          {/* Quiz Scoreboard Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400">Progresso do Teste:</span>
              <div className="text-sm font-bold text-white mt-0.5">
                {answeredCount} de {totalQuestions} respondidas · Acertos: <span className="text-emerald-400 font-mono">{correctCount}</span>
              </div>
            </div>

            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Quiz</span>
            </button>
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-white leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1 pl-9">
                    {q.options.map((option, optIdx) => {
                      let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600';

                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-white font-medium ring-1 ring-emerald-500/30';
                        } else if (selectedOpt === optIdx) {
                          btnStyle = 'bg-rose-950/40 border-rose-500 text-white';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={isAnswered}
                          className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="font-mono text-slate-500 shrink-0">
                            {String.fromCharCode(65 + optIdx)})
                          </span>
                          <span className="flex-1">{option}</span>

                          {isAnswered && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isAnswered && selectedOpt === optIdx && optIdx !== q.correctIndex && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation drawer when answered */}
                  {isAnswered && (
                    <div
                      className={`ml-9 p-3 rounded text-xs leading-relaxed border ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-900/40 text-slate-300'
                      }`}
                    >
                      <span className="font-bold block mb-1">
                        {isCorrect ? 'Correto!' : 'Explicação de Engenharia:'}
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
