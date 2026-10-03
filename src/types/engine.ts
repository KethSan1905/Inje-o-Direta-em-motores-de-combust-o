/**
 * Types and definitions for Direct Fuel Injection Combustion Engines (GDI, Common Rail, Dual Injection)
 */

export type EngineSystem = 'gdi' | 'diesel' | 'dual' | 'mpi';

export type CombustionMode = 'homogeneous' | 'stratified';

export type StrokePhase = 'intake' | 'compression' | 'combustion' | 'exhaust';

export interface SystemSpec {
  id: EngineSystem;
  name: string;
  fullName: string;
  cycle: 'Otto' | 'Diesel';
  fuelType: string;
  railPressureRange: [number, number]; // bar
  railPressureUnit: 'bar';
  compressionRatio: string;
  dropletSizeSMD: string; // Sauter Mean Diameter
  valveCleanlinessMechanism: string;
  emissionsTrait: string;
  typicalApplications: string[];
  summary: string;
}

export interface EngineTelemetry {
  crankAngle: number; // 0 to 720 degrees
  stroke: StrokePhase;
  strokeProgress: number; // 0 to 1 inside current stroke
  rpm: number;
  engineLoad: number; // 0 to 100%
  chamberPressure: number; // bar (instantaneous)
  chamberTemperature: number; // Celsius (instantaneous)
  railPressure: number; // bar
  injectionPulseActive: boolean;
  sparkActive: boolean;
  intakeValveLift: number; // 0 to 1
  exhaustValveLift: number; // 0 to 1
  pistonPosition: number; // 0 (TDC) to 1 (BDC)
  combustionMode: CombustionMode;
}

export interface FuelCircuitComponent {
  id: string;
  title: string;
  subTitle: string;
  pressureRange: string;
  description: string;
  operatingPrinciple: string;
  criticalTolerances: string;
  failureSymptoms: string;
  maintenanceTip: string;
}

export interface DiagnosticCase {
  dtcCode: string;
  title: string;
  systemAffected: string;
  primarySymptoms: string[];
  rootCauses: string[];
  diagnosticSteps: string[];
  solution: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
