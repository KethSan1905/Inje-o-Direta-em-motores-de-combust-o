import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, FastForward, RotateCcw, Flame, Wind, Gauge, Droplets, Zap, ShieldAlert, Sliders, ChevronRight } from 'lucide-react';
import { EngineSystem, CombustionMode, StrokePhase } from '../types/engine';
import { SYSTEM_SPECS } from '../data/engineData';

export const CylinderSimulator: React.FC = () => {
  // Engine states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playSpeed, setPlaySpeed] = useState<number>(0.25); // speed factor (default 0.25x for phase comprehension)
  const [rpm, setRpm] = useState<number>(1800); // 800 to 6500
  const [engineLoad, setEngineLoad] = useState<number>(65); // 10% to 100%
  const [engineSystem, setEngineSystem] = useState<EngineSystem>('gdi');
  const [combustionMode, setCombustionMode] = useState<CombustionMode>('homogeneous');
  const [crankAngle, setCrankAngle] = useState<number>(45); // 0 to 720

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pvCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Determine current stroke
  const strokePhase: StrokePhase = useMemo(() => {
    const angle = crankAngle % 720;
    if (angle < 180) return 'intake';
    if (angle < 360) return 'compression';
    if (angle < 540) return 'combustion';
    return 'exhaust';
  }, [crankAngle]);

  const strokeLabels: Record<StrokePhase, { title: string; color: string; desc: string }> = {
    intake: {
      title: '1º Tempo: Admissão (0° a 180°)',
      color: 'text-cyan-400',
      desc: engineSystem === 'mpi'
        ? 'Válvula de admissão aberta. O ar entra já misturado com combustível pulverizado no coletor.'
        : 'Válvula de admissão aberta. Entra EXCLUSIVAMENTE ar puro no cilindro. Em modo homogêneo, a injeção direta de alta pressão começa a pulverizar o combustível.'
    },
    compression: {
      title: '2º Tempo: Compressão (180° a 360°)',
      color: 'text-amber-400',
      desc: combustionMode === 'stratified' && engineSystem === 'gdi'
        ? 'Válvulas fechadas. O pistão sobe comprimindo o ar. No final da subida (300°-340°), o bico injeta sobre a cavidade do pistão (carga estratificada).'
        : 'Ambas as válvulas vedadas. O pistão sobe até o PMS comprimindo o ar/mistura, elevando pressão e temperatura.'
    },
    combustion: {
      title: '3º Tempo: Combustão & Expansão (360° a 540°)',
      color: 'text-rose-500',
      desc: engineSystem === 'diesel'
        ? 'Injeção sob 2.000+ bar no ar superaquecido provoca autoignição instantânea sem vela, gerando força de expansão.'
        : 'Centelha de alta energia na vela de ignição (a ~350°) inicia a frente de chama. A pressão do gás atinge pico de 80-120 bar empurrando o pistão.'
    },
    exhaust: {
      title: '4º Tempo: Escape (540° a 720°)',
      color: 'text-slate-400',
      desc: 'Válvula de escape abre. O pistão sobe expulsando os gases queimados em direção ao catalisador e turbocompressor.'
    }
  };

  // Instantaneous Physics Calculations
  const telemetry = useMemo(() => {
    const angle = crankAngle % 720;
    const rad = (angle % 360) * (Math.PI / 180);
    
    // Piston kinematic normalized position (0 at TDC, 1 at BDC)
    // Using crank-rod ratio lambda_cr = r/L ≈ 0.28
    const lambda_cr = 0.28;
    const s_norm = 0.5 * ((1 - Math.cos(rad)) + (lambda_cr / 4) * (1 - Math.cos(2 * rad)));
    const pistonPos = Math.max(0, Math.min(1, s_norm));

    // Valve lifts
    let intakeLift = 0;
    if (angle >= 0 && angle <= 200) {
      const a = (angle / 200) * Math.PI;
      intakeLift = Math.sin(a);
    }

    let exhaustLift = 0;
    if (angle >= 520 && angle <= 720) {
      const a = ((angle - 520) / 200) * Math.PI;
      exhaustLift = Math.sin(a);
    }

    // Injection timing
    let directInjectionActive = false;
    let indirectInjectionActive = false;

    if (engineSystem === 'gdi') {
      if (combustionMode === 'homogeneous') {
        // Injects during intake stroke (60° to 140°)
        directInjectionActive = angle >= 50 && angle <= 130;
      } else {
        // Stratified: injects late in compression (290° to 345°)
        directInjectionActive = angle >= 295 && angle <= 340;
      }
    } else if (engineSystem === 'diesel') {
      // Injects near TDC (345° to 375°)
      directInjectionActive = angle >= 345 && angle <= 380;
    } else if (engineSystem === 'dual') {
      if (engineLoad > 50) {
        directInjectionActive = angle >= 60 && angle <= 130;
      }
      if (engineLoad <= 60) {
        indirectInjectionActive = angle >= 10 && angle <= 160;
      }
    } else if (engineSystem === 'mpi') {
      // MPI injects into runner
      indirectInjectionActive = angle >= 10 && angle <= 160;
    }

    // Spark active (for Otto)
    const sparkActive = engineSystem !== 'diesel' && angle >= 345 && angle <= 365;

    // Cylinder pressure calculation
    const baseP = 1.0; // 1 bar ambient
    let cylPressure = baseP;
    let cylTemp = 35; // °C ambient

    if (angle < 180) {
      // Intake
      cylPressure = 0.95 + (engineLoad / 100) * 0.5; // slight boost if loaded
      cylTemp = 40 + (engineLoad * 0.2);
    } else if (angle < 360) {
      // Compression
      const compRatio = engineSystem === 'diesel' ? 16.5 : 10.5;
      const effectiveVol = 1 + (1 - pistonPos) * (compRatio - 1);
      const ratio = effectiveVol / 1;
      cylPressure = baseP * Math.pow(ratio, 1.35) * (0.8 + 0.4 * (engineLoad / 100));
      cylTemp = 50 + (cylPressure * 14);
    } else if (angle < 540) {
      // Combustion & Expansion
      const progress = (angle - 360) / 180;
      const peakP = (engineSystem === 'diesel' ? 140 : 85) * (0.4 + 0.6 * (engineLoad / 100));
      const peakT = 2100 * (0.5 + 0.5 * (engineLoad / 100));
      
      if (progress < 0.15) {
        cylPressure = 30 + (peakP - 30) * (progress / 0.15);
        cylTemp = 600 + (peakT - 600) * (progress / 0.15);
      } else {
        const decay = Math.pow(1 - (progress - 0.15) / 0.85, 2.2);
        cylPressure = 5 + (peakP - 5) * decay;
        cylTemp = 450 + (peakT - 450) * decay;
      }
    } else {
      // Exhaust
      cylPressure = 1.8 * (0.8 + 0.3 * (engineLoad / 100));
      cylTemp = 380 - ((angle - 540) / 180) * 150;
    }

    // Rail Pressure
    let railP = 200;
    if (engineSystem === 'gdi') {
      railP = 150 + (engineLoad / 100) * 200; // 150 to 350 bar
    } else if (engineSystem === 'diesel') {
      railP = 1200 + (engineLoad / 100) * 1200; // 1200 to 2400 bar
    } else if (engineSystem === 'dual') {
      railP = engineLoad > 50 ? 150 + (engineLoad / 100) * 100 : 5;
    } else {
      railP = 4.2; // MPI standard
    }

    // Piston Direction and Phase Tracking for educational comprehension
    const pistonDirection = (angle < 180 || (angle >= 360 && angle < 540)) ? 'down' : 'up';
    const isNearTDC = angle <= 12 || angle >= 708 || (angle >= 348 && angle <= 372);
    const isNearBDC = (angle >= 168 && angle <= 192) || (angle >= 528 && angle <= 552);
    const pistonMotionLabel = isNearTDC
      ? 'PMS (Ponto Morto Superior)'
      : isNearBDC
      ? 'PMI (Ponto Morto Inferior)'
      : pistonDirection === 'down'
      ? 'Descendo ↓ (PMS → PMI)'
      : 'Subindo ↑ (PMI → PMS)';

    return {
      angle,
      pistonPos,
      pistonDirection,
      pistonMotionLabel,
      intakeLift,
      exhaustLift,
      directInjectionActive,
      indirectInjectionActive,
      sparkActive,
      cylPressure: Math.round(cylPressure * 10) / 10,
      cylTemp: Math.round(cylTemp),
      railPressure: Math.round(railP)
    };
  }, [crankAngle, engineSystem, combustionMode, engineLoad]);

  // Main animation loop
  useEffect(() => {
    let active = true;

    const animate = (time: number) => {
      if (!active) return;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        // Crank angle rotation based on RPM:
        // Degrees per second = (RPM / 60) * 360
        // Scaled by playSpeed for visual tracking
        const speedMultiplier = playSpeed;
        const deltaAngle = (rpm / 60) * 360 * dt * speedMultiplier;
        setCrankAngle((prev) => (prev + deltaAngle) % 720);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playSpeed, rpm]);

  // Canvas renderer for the mechanical cylinder
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 420;
    const height = 520;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Mechanical layout coordinates
    const cylCenterX = width / 2;
    const cylTopY = 130;
    const cylWidth = 170;
    const cylHeight = 220;
    const strokeLength = 110;
    const crankRadius = strokeLength / 2;
    const rodLength = 150;
    const crankCenterX = cylCenterX;
    const crankCenterY = cylTopY + cylHeight + crankRadius + 20;

    const pistonHeight = 55;
    const pistonY = cylTopY + 25 + telemetry.pistonPos * strokeLength;

    // Crankshaft pin position
    const crankAngleRad = ((crankAngle % 360) - 90) * (Math.PI / 180);
    const pinX = crankCenterX + crankRadius * Math.cos(crankAngleRad);
    const pinY = crankCenterY + crankRadius * Math.sin(crankAngleRad);

    const wristPinX = cylCenterX;
    const wristPinY = pistonY + 25;

    // 1. Draw Cylinder Walls & Water Jackets
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cylCenterX - cylWidth / 2 - 25, cylTopY - 10, cylWidth + 50, cylHeight + 40);

    // Engine block cutaway metal
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cylCenterX - cylWidth / 2 - 24, cylTopY, 20, cylHeight);
    ctx.fillRect(cylCenterX + cylWidth / 2 + 4, cylTopY, 20, cylHeight);

    // Cooling jackets (Blue coolant channels)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(cylCenterX - cylWidth / 2 - 18, cylTopY + 30, 8, 40);
    ctx.fillRect(cylCenterX - cylWidth / 2 - 18, cylTopY + 90, 8, 40);
    ctx.fillRect(cylCenterX + cylWidth / 2 + 10, cylTopY + 30, 8, 40);
    ctx.fillRect(cylCenterX + cylWidth / 2 + 10, cylTopY + 90, 8, 40);

    // Cylinder bore (internal chamber background)
    const chamberGradient = ctx.createLinearGradient(0, cylTopY, 0, pistonY);
    if (telemetry.sparkActive || (strokePhase === 'combustion' && telemetry.angle < 450)) {
      chamberGradient.addColorStop(0, '#f97316');
      chamberGradient.addColorStop(0.5, '#ea580c');
      chamberGradient.addColorStop(1, '#7c2d12');
    } else {
      chamberGradient.addColorStop(0, '#090d16');
      chamberGradient.addColorStop(1, '#020617');
    }
    ctx.fillStyle = chamberGradient;
    ctx.fillRect(cylCenterX - cylWidth / 2, cylTopY, cylWidth, pistonY - cylTopY);

    // Air flow or fuel mixture mist in chamber
    if (strokePhase === 'intake' && telemetry.intakeLift > 0.1) {
      // Inflow particles / air vortex (tumble)
      ctx.fillStyle = engineSystem === 'mpi' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(148, 163, 184, 0.2)';
      ctx.beginPath();
      ctx.ellipse(cylCenterX, (cylTopY + pistonY) / 2, cylWidth * 0.35, (pistonY - cylTopY) * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw Cylinder Head, Ports & Valves
    // Cylinder head base
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(cylCenterX - cylWidth / 2 - 24, cylTopY);
    ctx.lineTo(cylCenterX + cylWidth / 2 + 24, cylTopY);
    ctx.lineTo(cylCenterX + cylWidth / 2 + 24, cylTopY - 60);
    ctx.lineTo(cylCenterX - cylWidth / 2 - 24, cylTopY - 60);
    ctx.closePath();
    ctx.fill();

    // Intake Port (Left - Cyan tone)
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(cylCenterX - cylWidth / 2 - 35, cylTopY - 45);
    ctx.quadraticCurveTo(cylCenterX - 45, cylTopY - 45, cylCenterX - 35, cylTopY);
    ctx.stroke();

    // Exhaust Port (Right - Orange/Slate tone)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(cylCenterX + cylWidth / 2 + 35, cylTopY - 45);
    ctx.quadraticCurveTo(cylCenterX + 45, cylTopY - 45, cylCenterX + 35, cylTopY);
    ctx.stroke();

    // Intake Valve (Left)
    const intakeValveY = cylTopY + telemetry.intakeLift * 12;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    // Valve stem
    ctx.beginPath();
    ctx.moveTo(cylCenterX - 35, intakeValveY);
    ctx.lineTo(cylCenterX - 45, cylTopY - 55);
    ctx.stroke();
    // Valve head disk
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(cylCenterX - 35, intakeValveY, 18, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Exhaust Valve (Right)
    const exhaustValveY = cylTopY + telemetry.exhaustLift * 12;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    // Valve stem
    ctx.beginPath();
    ctx.moveTo(cylCenterX + 35, exhaustValveY);
    ctx.lineTo(cylCenterX + 45, cylTopY - 55);
    ctx.stroke();
    // Valve head disk
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(cylCenterX + 35, exhaustValveY, 18, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // MPI Injector (if MPI or Dual Injection)
    if (engineSystem === 'mpi' || engineSystem === 'dual') {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cylCenterX - cylWidth / 2 - 12, cylTopY - 60, 10, 20);

      // MPI Spray
      if (telemetry.indirectInjectionActive) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.beginPath();
        ctx.moveTo(cylCenterX - cylWidth / 2 - 7, cylTopY - 40);
        ctx.lineTo(cylCenterX - 35, cylTopY - 5);
        ctx.lineTo(cylCenterX - 55, cylTopY - 5);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Direct High-Pressure Injector (Center or slightly angled)
    if (engineSystem !== 'mpi') {
      // Injector body in cylinder head
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(cylCenterX - 22, cylTopY - 50, 10, 50);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cylCenterX - 20, cylTopY - 2, 6, 4);

      // Direct High Pressure Atomized Spray
      if (telemetry.directInjectionActive) {
        ctx.save();
        // High pressure fine mist cone
        const sprayGradient = ctx.createRadialGradient(
          cylCenterX - 17, cylTopY, 2,
          cylCenterX, cylTopY + 60, 60
        );
        sprayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        sprayGradient.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
        sprayGradient.addColorStop(0.8, 'rgba(14, 165, 233, 0.3)');
        sprayGradient.addColorStop(1, 'rgba(14, 165, 233, 0)');

        ctx.fillStyle = sprayGradient;
        ctx.beginPath();
        ctx.moveTo(cylCenterX - 17, cylTopY);
        // Multi-plume spray divergence targeting piston bowl
        ctx.lineTo(cylCenterX - 55, pistonY - 5);
        ctx.lineTo(cylCenterX + 45, pistonY - 5);
        ctx.closePath();
        ctx.fill();

        // Micro-droplet particle points
        ctx.fillStyle = '#e0f2fe';
        for (let i = 0; i < 16; i++) {
          const px = cylCenterX - 17 + (Math.random() - 0.3) * 60;
          const py = cylTopY + Math.random() * (pistonY - cylTopY);
          ctx.beginPath();
          ctx.arc(px, py, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Spark Plug (Otto) or Glow Plug (Diesel)
    if (engineSystem !== 'diesel') {
      // Spark plug body
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(cylCenterX + 10, cylTopY - 45, 8, 44);
      // Spark electrode
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cylCenterX + 12, cylTopY - 2, 4, 6);

      // Plasma Arc / Spark
      if (telemetry.sparkActive) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cylCenterX + 14, cylTopY + 4);
        ctx.lineTo(cylCenterX + 10, cylTopY + 7);
        ctx.lineTo(cylCenterX + 16, cylTopY + 9);
        ctx.stroke();

        // Spark glow
        const glow = ctx.createRadialGradient(cylCenterX + 14, cylTopY + 6, 2, cylCenterX + 14, cylTopY + 6, 25);
        glow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        glow.addColorStop(0.4, 'rgba(56, 189, 248, 0.8)');
        glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cylCenterX + 14, cylTopY + 6, 25, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Draw Piston
    ctx.save();
    // Piston body
    ctx.fillStyle = '#475569';
    ctx.fillRect(cylCenterX - cylWidth / 2 + 2, pistonY, cylWidth - 4, pistonHeight);

    // Piston crown (metallic gradient)
    const crownGrad = ctx.createLinearGradient(0, pistonY, 0, pistonY + 12);
    crownGrad.addColorStop(0, '#94a3b8');
    crownGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = crownGrad;
    ctx.fillRect(cylCenterX - cylWidth / 2 + 2, pistonY, cylWidth - 4, 14);

    // Contoured Piston Bowl Cavity (Crucial for GDI tumble & stratified charge)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    // Sculpted bowl cavity in piston top
    ctx.ellipse(cylCenterX - 5, pistonY + 5, 42, 10, 0, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Piston Compression Rings
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cylCenterX - cylWidth / 2 + 1, pistonY + 16, cylWidth - 2, 2.5);
    ctx.fillRect(cylCenterX - cylWidth / 2 + 1, pistonY + 22, cylWidth - 2, 2.5);
    ctx.fillRect(cylCenterX - cylWidth / 2 + 1, pistonY + 28, cylWidth - 2, 2.5);

    // Wrist pin (pino do pistão)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(wristPinX, wristPinY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(wristPinX, wristPinY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Connecting Rod (Biela)
    ctx.save();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(wristPinX, wristPinY);
    ctx.lineTo(pinX, pinY);
    ctx.stroke();

    // Inner structural groove of the I-beam rod
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(wristPinX, wristPinY + 5);
    ctx.lineTo(pinX, pinY - 5);
    ctx.stroke();

    // Rod big end journal
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(pinX, pinY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(pinX, pinY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Crankshaft Counterweight (Virabrequim)
    ctx.save();
    ctx.translate(crankCenterX, crankCenterY);
    ctx.rotate(crankAngleRad + Math.PI); // Counterweight sits opposite to the pin

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(0, 0, crankRadius + 22, -0.8, 0.8);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Center crank journal
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Crankcase boundary
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(crankCenterX, crankCenterY, crankRadius + 32, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    ctx.restore();
  }, [crankAngle, engineSystem, combustionMode, strokePhase, telemetry]);

  // Canvas renderer for the live P-V Indicator Diagram
  useEffect(() => {
    const canvas = pvCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 280;
    const height = 190;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const padL = 38;
    const padR = 15;
    const padT = 20;
    const padB = 30;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    // Background & Axes
    ctx.fillStyle = '#090d16';
    ctx.fillRect(padL, padT, plotW, plotH);

    // Subtle grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();

      const x = padL + (plotW / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();
    }

    // Axes lines
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('P (bar)', 4, padT + 8);
    ctx.fillText('Volume (cm³)', padL + plotW - 65, height - 8);

    // Max pressure scale on Y axis
    const maxP = engineSystem === 'diesel' ? 140 : 90;
    ctx.fillText(`${maxP}`, 8, padT + 10);
    ctx.fillText(`${Math.round(maxP / 2)}`, 8, padT + plotH / 2 + 4);
    ctx.fillText('0', 18, padT + plotH);

    // Theoretical 4-Stroke PV Loop path
    // Volume: V_min (TDC) to V_max (BDC)
    // Points:
    // 1 -> BDC at P_atm (Admissão)
    // 2 -> TDC at P_comp (Compressão)
    // 3 -> TDC at P_peak (Combustão isocórica / isobárica)
    // 4 -> BDC at P_exp (Fim de expansão)
    const xMin = padL + 25; // V_c (volume morto TDC)
    const xMax = padL + plotW - 15; // V_total (BDC)
    const yAtm = padT + plotH - (1.0 / maxP) * plotH;
    const yComp = padT + plotH - (engineSystem === 'diesel' ? 45 / maxP : 25 / maxP) * plotH;
    const yPeak = padT + plotH - ((engineSystem === 'diesel' ? 120 : 80) / maxP) * plotH;
    const yExp = padT + plotH - (4.5 / maxP) * plotH;

    // Draw static PV theoretical curve
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // 1 -> 2: Compression (isentropic V_max to V_min)
    ctx.moveTo(xMax, yAtm);
    ctx.quadraticCurveTo(xMin + 35, yAtm + 15, xMin, yComp);
    // 2 -> 3: Heat Addition (pressure jump at TDC)
    ctx.lineTo(xMin, yPeak);
    // 3 -> 4: Expansion (isentropic power stroke V_min to V_max)
    ctx.quadraticCurveTo(xMin + 45, yPeak + 15, xMax, yExp);
    // 4 -> 1: Blowdown & Exhaust/Intake
    ctx.lineTo(xMax, yAtm);
    ctx.stroke();

    // Current Operating Point on the PV plot
    // Volume position:
    const curX = xMin + telemetry.pistonPos * (xMax - xMin);
    const clampedP = Math.min(maxP, Math.max(0, telemetry.cylPressure));
    const curY = padT + plotH - (clampedP / maxP) * plotH;

    // Glowing current point
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(curX, curY, 7, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }, [telemetry, engineSystem]);

  const handleStepStroke = (direction: 'next' | 'prev') => {
    setIsPlaying(false);
    setCrankAngle((prev) => {
      const step = 180;
      let next = direction === 'next' ? prev + step : prev - step;
      if (next < 0) next += 720;
      return next % 720;
    });
  };

  return (
    <section className="py-6">
      {/* Simulation Master Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Gauge className="w-4 h-4" />
            <span>Dinâmica Termodinâmica em Tempo Real</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Simulador do Ciclo de Injeção Direta
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Visualize a movimentação cinemática de bielas e pistões, a atomização ultra-pressurizada do combustível, tempos de válvula e o diagrama P-V sincronizado.
          </p>
        </div>

        {/* Engine System Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setEngineSystem('gdi')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              engineSystem === 'gdi' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            GDI (Gasolina/Otto)
          </button>
          <button
            onClick={() => setEngineSystem('diesel')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              engineSystem === 'diesel' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Diesel Common Rail
          </button>
          <button
            onClick={() => setEngineSystem('dual')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              engineSystem === 'dual' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Injeção Dupla (Mista)
          </button>
          <button
            onClick={() => setEngineSystem('mpi')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              engineSystem === 'mpi' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Indireta (MPI)
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid: Left Stage (Canvas & P-V) | Right Deck (Controls & Data) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left Stage: Cylinder Cross Section + Live P-V Diagram */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col items-center relative overflow-hidden">
          {/* Active Stroke Banner */}
          <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2 text-xs">
            <span className={`font-bold ${strokeLabels[strokePhase].color}`}>
              {strokeLabels[strokePhase].title}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Pistão: {telemetry.pistonMotionLabel}
              </span>
              <span className="font-mono text-slate-400">
                {Math.round(crankAngle)}° / 720°
              </span>
            </div>
          </div>

          {/* 4-Phase Stage Progress Track for Pistom Movement Comprehension */}
          <div className="w-full grid grid-cols-4 gap-1 mb-3 text-[11px]">
            {[
              { id: 'intake', label: '1. Admissão', range: '0° - 180°', dir: 'Descendo ↓' },
              { id: 'compression', label: '2. Compressão', range: '180° - 360°', dir: 'Subindo ↑' },
              { id: 'combustion', label: '3. Expansão', range: '360° - 540°', dir: 'Descendo ↓' },
              { id: 'exhaust', label: '4. Escape', range: '540° - 720°', dir: 'Subindo ↑' },
            ].map((p) => {
              const isCurrent = strokePhase === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-1.5 rounded text-center border transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/60 border-cyan-400 text-white font-bold ring-1 ring-cyan-500/40 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className={`text-[10px] leading-tight ${isCurrent ? 'text-cyan-300' : 'text-slate-400'}`}>
                    {p.label}
                  </div>
                  <div className="text-[9px] font-mono opacity-80 mt-0.5">
                    {p.dir}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Visual Canvas Area */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Cylinder Anatomy Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-[280px] h-[345px] sm:w-[320px] sm:h-[395px] rounded bg-slate-950 border border-slate-800 shadow-inner"
              />
              {/* Overlay Indicator Pins */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 space-y-0.5 pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${telemetry.directInjectionActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`} />
                  <span>Bico Alta Pressão</span>
                </div>
                {engineSystem !== 'diesel' && (
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${telemetry.sparkActive ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`} />
                    <span>Centelha da Vela</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Indicator Diagram P-V */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 self-start">
                <span>Diagrama P-V Indicador</span>
                <span className="text-[10px] text-slate-500 font-mono">(Tempo Real)</span>
              </div>
              <canvas
                ref={pvCanvasRef}
                className="w-[240px] h-[165px] rounded bg-slate-950 border border-slate-800 shadow-inner"
              />
              <div className="w-full bg-slate-950/80 border border-slate-800 rounded p-2.5 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between font-mono">
                  <span>Pressão instantânea:</span>
                  <span className="text-white font-bold">{telemetry.cylPressure} bar</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Temperatura estimada:</span>
                  <span className="text-amber-400 font-bold">{telemetry.cylTemp} °C</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Pressão no Rail:</span>
                  <span className="text-cyan-400 font-bold">{telemetry.railPressure} bar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stroke Explanation Callout */}
          <div className="w-full mt-4 p-3 bg-slate-950/60 border-l-2 border-cyan-500 rounded-r text-xs text-slate-300 leading-relaxed">
            {strokeLabels[strokePhase].desc}
          </div>

          {/* Transport Controls Bar */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  isPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pausar' : 'Iniciar'}</span>
              </button>

              <button
                onClick={() => handleStepStroke('prev')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                title="Voltar 1 tempo (180°)"
              >
                -1 Tempo
              </button>
              <button
                onClick={() => handleStepStroke('next')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                title="Avançar 1 tempo (180°)"
              >
                +1 Tempo
              </button>
            </div>

            {/* Playback Speed Selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 mr-1">Velocidade:</span>
              {[
                { val: 0.1, label: '0.1x' },
                { val: 0.25, label: '0.25x (Fases)' },
                { val: 0.5, label: '0.5x' },
                { val: 1.0, label: '1x (Real)' }
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setPlaySpeed(s.val)}
                  className={`px-2 py-1 rounded font-mono text-[11px] transition-colors ${
                    playSpeed === s.val
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700'
                  }`}
                  title={s.val === 0.25 ? 'Velocidade recomendada para acompanhar detalhadamente o movimento do pistão e das válvulas' : undefined}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Deck: Controls, Mode Toggles & Telemetry Parameters */}
        <div className="lg:col-span-5 space-y-5">
          {/* Combustion Strategy Card (GDI only) */}
          {engineSystem === 'gdi' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center justify-between">
                <span>Estratégia de Injeção & Mistura</span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {combustionMode === 'homogeneous' ? 'Lambda λ = 1.0' : 'Lambda λ = 1.8 a 2.5'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCombustionMode('homogeneous')}
                  className={`p-2.5 rounded text-left border transition-all ${
                    combustionMode === 'homogeneous'
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-cyan-400">Homogênea</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Injeta na admissão. Distribuição uniforme para alta aceleração e WOT.
                  </div>
                </button>

                <button
                  onClick={() => setCombustionMode('stratified')}
                  className={`p-2.5 rounded text-left border transition-all ${
                    combustionMode === 'stratified'
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-amber-400">Estratificada (Lean)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Injeta no fim da compressão. Nuvem rica só perto da vela. Máxima economia.
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Engine Parameters Controls (Sliders) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Parâmetros Dinâmicos do Motor</span>
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* RPM Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Rotação do Motor (RPM):</span>
                <span className="font-mono font-bold text-cyan-400">{rpm} RPM</span>
              </div>
              <input
                type="range"
                min="800"
                max="6500"
                step="100"
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>800 (Marcha Lenta)</span>
                <span>3.500 (Cruzeiro)</span>
                <span>6.500 (Corte)</span>
              </div>
            </div>

            {/* Engine Load Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Carga do Motor (Acelerador):</span>
                <span className="font-mono font-bold text-amber-400">{engineLoad}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={engineLoad}
                onChange={(e) => setEngineLoad(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>10% (Desaceleração)</span>
                <span>50% (Médio)</span>
                <span>100% (WOT Pé no Fundo)</span>
              </div>
            </div>

            {/* Manual Crank Angle Scrubber */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Ângulo do Virabrequim (θ):</span>
                <span className="font-mono text-white font-bold">{Math.round(crankAngle)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="720"
                step="2"
                value={Math.round(crankAngle)}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCrankAngle(Number(e.target.value));
                }}
                className="w-full accent-slate-300 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Real-time Technical Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Pressão de Injeção</span>
              <span className="text-lg font-bold font-mono text-cyan-400 block mt-0.5">
                {telemetry.railPressure} <span className="text-xs text-slate-500">bar</span>
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {engineSystem === 'diesel' ? 'Common Rail Diesel' : engineSystem === 'mpi' ? 'Indireta PFI' : 'Bomba HPFP'}
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Pico de Pressão Cilindro</span>
              <span className="text-lg font-bold font-mono text-rose-400 block mt-0.5">
                {telemetry.cylPressure} <span className="text-xs text-slate-500">bar</span>
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Força exercida na biela
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Temperatura de Câmara</span>
              <span className="text-lg font-bold font-mono text-amber-400 block mt-0.5">
                {telemetry.cylTemp} <span className="text-xs text-slate-500">°C</span>
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Gás expandido em queima
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Janela de Injeção</span>
              <span className="text-lg font-bold font-mono text-emerald-400 block mt-0.5">
                {((60 / rpm) * (35 / 360) * 1000).toFixed(2)} <span className="text-xs text-slate-500">ms</span>
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Duração do pulso do bico
              </span>
            </div>
          </div>

          {/* System Spec Overview Card */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
            <div className="font-semibold text-slate-200">
              {SYSTEM_SPECS[engineSystem].fullName}
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {SYSTEM_SPECS[engineSystem].summary}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-slate-300">
              <span className="font-mono text-cyan-400">Aplicações comuns:</span>
              {SYSTEM_SPECS[engineSystem].typicalApplications.join(' · ')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
