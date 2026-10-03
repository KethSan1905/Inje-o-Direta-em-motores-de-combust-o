import { SystemSpec, FuelCircuitComponent, DiagnosticCase, QuizQuestion } from '../types/engine';

export const SYSTEM_SPECS: Record<string, SystemSpec> = {
  gdi: {
    id: 'gdi',
    name: 'GDI / TSI / EcoBoost',
    fullName: 'Gasoline Direct Injection (Ciclo Otto)',
    cycle: 'Otto',
    fuelType: 'Gasolina E0-E27 / Etanol E100',
    railPressureRange: [150, 350],
    railPressureUnit: 'bar',
    compressionRatio: '10.5:1 a 13.0:1',
    dropletSizeSMD: '10 a 20 µm (microgotículas)',
    valveCleanlinessMechanism: 'Sem contato com combustível (vulnerável a carbonização)',
    emissionsTrait: 'Menor CO₂, propensão a particulados finos (requer filtro GPF)',
    typicalApplications: ['VW TSI / TFSI (EA211/EA888)', 'Ford EcoBoost', 'Mazda Skyactiv-G', 'BMW TwinPower B48/B58'],
    summary: 'O combustível é pulverizado diretamente na câmara sob pressões de até 350 bar. O resfriamento latente da mistura diminui a detonação (knock), permitindo alta taxa de compressão e turbocompressão agressiva em cilindradas reduzidas (downsizing).'
  },
  diesel: {
    id: 'diesel',
    name: 'Common Rail Diesel',
    fullName: 'Injeção Direta de Alta Pressão Common Rail (Ciclo Diesel)',
    cycle: 'Diesel',
    fuelType: 'Diesel S10 / S500 / Biodiesel',
    railPressureRange: [1600, 2500],
    railPressureUnit: 'bar',
    compressionRatio: '15.5:1 a 18.5:1',
    dropletSizeSMD: '4 a 8 µm (atomização extrema)',
    valveCleanlinessMechanism: 'Sem combustível nas válvulas (respiro e EGR recirculam fuligem/óleo)',
    emissionsTrait: 'Altas emissões de NOx e fuligem (exige DPF + catalisador SCR Arla 32)',
    typicalApplications: ['Toyota Hilux D-4D', 'Ford Ranger 3.2/V6', 'RAM Cummins 6.7', 'Mercedes BlueTEC'],
    summary: 'Opera com pressões massivas de até 2.500 bar acumuladas em tubo comum forjado. Injetores piezoelétricos executam até 7 injeções por ciclo (piloto, pré, principal, pós), garantindo queima uniforme do diesel por autoignição adiabática.'
  },
  dual: {
    id: 'dual',
    name: 'Dupla Injeção (D-4S / EA888 Gen 3)',
    fullName: 'Sistema Misto: Injeção Direta + Indireta Combinadas',
    cycle: 'Otto',
    fuelType: 'Gasolina / Flex',
    railPressureRange: [4, 250],
    railPressureUnit: 'bar',
    compressionRatio: '11.0:1 a 12.5:1',
    dropletSizeSMD: 'Variável: 15 µm (alta carga) / 80 µm (baixa carga)',
    valveCleanlinessMechanism: 'Excelente autolimpeza das válvulas via injeção indireta em baixa carga',
    emissionsTrait: 'Emissões mínimas de particulados sem comprometer alta potência',
    typicalApplications: ['Toyota D-4S (Corolla, GR Yaris, Supra)', 'VW/Audi EA888 Gen 3 europeu', 'Ford 5.0 Coyote Gen 3'],
    summary: 'Utiliza 2 injetores por cilindro (8 bicos em um motor de 4 cilindros). Em baixa rotação e marcha lenta, a injeção indireta (MPI) lava as válvulas e evita fuligem; em plena aceleração, a injeção direta (GDI) entra em ação para extrair torque e evitar detonação.'
  },
  mpi: {
    id: 'mpi',
    name: 'MPI / PFI Convencional',
    fullName: 'Multi-Point Fuel Injection (Injeção Indireta no Coletor)',
    cycle: 'Otto',
    fuelType: 'Gasolina / Etanol',
    railPressureRange: [3, 5],
    railPressureUnit: 'bar',
    compressionRatio: '9.0:1 a 10.5:1',
    dropletSizeSMD: '80 a 140 µm (gotas maiores)',
    valveCleanlinessMechanism: 'O combustível pulverizado atua continuamente como solvente lavador',
    emissionsTrait: 'Sem partículas sólidas de fuligem; maior perda por película molhada',
    typicalApplications: ['Motores populares 1.0 aspirados', 'Projetos convencionais anteriores a 2012'],
    summary: 'O combustível é injetado no duto de admissão logo antes da válvula aberta a apenas 3 a 5 bar. O combustível líquido limpa o dorso da válvula, mas forma película nas paredes do coletor e não proporciona o resfriamento interno direto do cilindro.'
  }
};

export const FUEL_CIRCUIT_COMPONENTS: FuelCircuitComponent[] = [
  {
    id: 'lpfp',
    title: 'Bomba de Baixa Pressão (LPFP)',
    subTitle: 'Circuito Primário de Alimentação',
    pressureRange: '4 a 7 bar (58 a 100 PSI)',
    description: 'Bomba elétrica imersa no tanque de combustível com motor sem escovas (brushless) ou comutador com controle PWM de rotação variável.',
    operatingPrinciple: 'Garante fluxo contínuo e sem bolhas de vapor (vapor lock) até a entrada da bomba de alta pressão no cofre do motor.',
    criticalTolerances: 'Filtro preliminar de 10 a 20 micras; vazão mínima de 120 a 180 litros/hora sob pressão.',
    failureSymptoms: 'Corte de aceleração em altas rotações, dificuldade de partida a frio, ruído agudo zumbindo sob o banco traseiro.',
    maintenanceTip: 'Nunca rodar com o tanque na reserva crônica (o combustível refrigera o motor elétrico da bomba).'
  },
  {
    id: 'hpfp',
    title: 'Bomba Mecânica de Alta Pressão (HPFP)',
    subTitle: 'Coração Mecânico do Sistema',
    pressureRange: '150 a 350 bar (Otto) | até 2.500 bar (Diesel)',
    description: 'Bomba de pistão axial ou êmbolo único de curso curto em aço cementado acionada por um ressalto excêntrico (de 3 ou 4 lóbulos) no comando de válvulas.',
    operatingPrinciple: 'Possui uma válvula solenoide dosadora eletrônica integrada regulada pela ECU que controla com precisão cirúrgica a quantidade de combustível comprimida a cada ciclo de rotação.',
    criticalTolerances: 'Folga êmbolo-cilindro de apenas 2 a 3 micrômetros (µm). Tucho de acionamento (roller ou flat cam follower) com revestimento de carbono diamantado (DLC).',
    failureSymptoms: 'Perda brusca de potência acima de 3.000 RPM (modo de emergência / limp mode), código P0087 (Rail Pressure Too Low), ruído de batida metálica no cabeçote.',
    maintenanceTip: 'Inspeção preventiva do tucho de bomba (cam follower) a cada 40.000 km, especialmente em motores TSI/TFSI EA113 e EA888 antigos.'
  },
  {
    id: 'rail',
    title: 'Galeria Distribuidora (Common Rail)',
    subTitle: 'Acumulador Hidráulico de Aço Forjado',
    pressureRange: 'Até 400 bar (Otto) | Até 3.000 bar (Diesel)',
    description: 'Tubo de aço de alta resistência mecânica usinado com espessura reforçada que atua como reservatório de pressão amortecendo as pulsações hidráulicas dos injetores.',
    operatingPrinciple: 'Alimenta todos os injetores mantendo pressão hidrostática rigorosamente idêntica para que cada cilindro receba dosagem de miligramas exatamente idêntica.',
    criticalTolerances: 'Equipado com sensor piezoresistivo de pressão com resposta em < 1 milissegundo e válvula mecânica de alívio contra sobrepressão catastrófica.',
    failureSymptoms: 'Variação descontrolada de pressão, vazamento de alta pressão nas conexões cônicas (risco severo de incêndio), código P0191.',
    maintenanceTip: 'Canos de alta pressão que ligam a bomba ao rail e o rail aos bicos NUNCA devem ser reapertados fora do torque especificado ou dobrados.'
  },
  {
    id: 'injectors',
    title: 'Injetores de Alta Pressão (Piezoelétricos / Solenoides)',
    subTitle: 'Atuadores Microscópicos Sub-milissegundo',
    pressureRange: '150 a 2.500 bar',
    description: 'Bicos com agulha balanceada acionada por bobina magnética de alta energia ou pilhas de cristais piezoelétricos cerâmicos que se expandem com tensão elétrica.',
    operatingPrinciple: 'Abertura em fração de milissegundo (0,15 a 0,4 ms), permitindo dividir uma única combustão em até 5 a 7 micro-injeções sincronizadas.',
    criticalTolerances: '6 a 8 micro-orifícios usinados por feixe laser com diâmetros entre 80 e 120 micras com ângulos divergentes direcionados à cavidade do pistão.',
    failureSymptoms: 'Bico travado aberto (diluição de óleo no cárter, cheiro de gasolina na vareta, risco de calço hidráulico), bico gotejando (fumaça preta e perda de pressão residual).',
    maintenanceTip: 'Nunca submeter bicos de injeção direta a banhos químicos abrasivos não certificados para alta pressão.'
  },
  {
    id: 'piston_bowl',
    title: 'Pistão com Câmara Conformada (Piston Bowl)',
    subTitle: 'Guia Físico de Turbilhonamento (Tumble / Swirl)',
    pressureRange: 'Pressão de queima até 120 bar no cilindro',
    description: 'Topo do pistão usinado em liga forjada de alumínio com uma cavidade esculpida especificamente para guiar o jato de combustível em direção à vela de ignição.',
    operatingPrinciple: 'Em modo de mistura estratificada (lean burn), a cavidade retém o combustível e o direciona em forma de turbilhão diretamente ao eletrodo da vela.',
    criticalTolerances: 'Geometria calculada por fluidodinâmica computacional (CFD) com tolerância de peso entre pistões < 1 grama.',
    failureSymptoms: 'Depósitos de carvão na bacia do pistão geram pontos quentes pré-ignitivos (detonação destrutiva por autoignição prematura).',
    maintenanceTip: 'Utilizar óleos lubrificantes com especificação API SP ou ILSAC GF-6 (desenvolvidos com baixo cálcio para mitigar LSPI - Low Speed Pre-Ignition).'
  }
];

export const DIAGNOSTIC_CASES: DiagnosticCase[] = [
  {
    dtcCode: 'P0087',
    title: 'Pressão no Rail do Sistema de Combustível Muito Baixa',
    systemAffected: 'Circuito de Alta Pressão (HPFP / Sensor de Rail / LPFP)',
    primarySymptoms: [
      'Veículo entra em modo de emergência (Limp Home) acima de 3.000 RPM',
      'Hesitação severa e corte de aceleração em aclives ou ultrapassagens',
      'Luz de injeção (MIL / EPC) acesa no painel'
    ],
    rootCauses: [
      'Desgaste severo do tucho da bomba de alta pressão (cam follower furado ou desgastado)',
      'Bomba mecânica de alta pressão (HPFP) com vazamento interno ou válvula de dosagem travada',
      'Bomba de baixa pressão (LPFP) no tanque fornecendo menos de 4 bar de pressão de alimentação',
      'Filtro de combustível entupido por impurezas no combustível'
    ],
    diagnosticSteps: [
      '1. Conectar scanner automotivo e monitorar "Pressão do Rail Especificada" vs "Pressão do Rail Real".',
      '2. Medir a pressão primária da bomba elétrica de baixa pressão (deve cravar entre 4,5 e 6,5 bar em carga).',
      '3. Remover a bomba mecânica de alta pressão e inspecionar visualmente o tucho roletado/copinho e o lóbulo do comando de válvulas.',
      '4. Testar a corrente e o sinal PWM da válvula reguladora de pressão da HPFP.'
    ],
    solution: 'Substituição do tucho de acionamento e/ou da bomba mecânica HPFP. Em caso de desgaste do comando, retífica ou substituição do eixo do comando de válvulas.'
  },
  {
    dtcCode: 'P0300 / P0301 a P0304',
    title: 'Falha de Ignição / Misfire Múltiplo ou em Cilindro Específico',
    systemAffected: 'Câmara de Combustão / Válvulas de Admissão Carbonizadas',
    primarySymptoms: [
      'Motor trepida intensamente na partida a frio nos primeiros 2 minutos',
      'Marcha lenta oscilante com estalos na admissão',
      'Consumo elevado de combustível e perda gradual de torque em baixa rotação'
    ],
    rootCauses: [
      'Incrustação severa de carvão no dorso e na haste das válvulas de admissão (restringindo o fluxo de ar CFM)',
      'Eletrodo da vela de ignição desgastado ou contaminado por óleo do respiro',
      'Injetor de alta pressão com leque de pulverização obstruído por verniz'
    ],
    diagnosticSteps: [
      '1. Remover o coletor de admissão e inspecionar os dutos e válvulas com câmera boroscópica.',
      '2. Medir a compressão dos cilindros e a estanqueidade das sedes de válvulas.',
      '3. Trocar bobinas e velas de posição entre cilindros para verificar se o misfire se desloca.'
    ],
    solution: 'Descarbonização física das válvulas de admissão com jateamento de casca de noz (Walnut Blasting) e substituição preventiva das velas.'
  },
  {
    dtcCode: 'P0299',
    title: 'Subpressão do Turbocompressor associada a Injeção Direta',
    systemAffected: 'Gestão de Sobrealimentação / Ciclo Térmico',
    primarySymptoms: [
      'Motor parece "aspirado fraco", sem resposta de turbo',
      'Gráfico de pressão do turbo não atinge o valor nominal especificado'
    ],
    rootCauses: [
      'A ECU corta propositalmente o boost do turbo para proteger o motor devido a desvios na dosagem de alta pressão',
      'Válvula wastegate com folga no atuador ou membrana da válvula desviadora (diverter) rasgada'
    ],
    diagnosticSteps: [
      '1. Verificar se há códigos pendentes de combustível no circuito de alta pressão.',
      '2. Testar estanqueidade do diafragma da válvula de alívio do turbo.',
      '3. Fazer log simultâneo de Pressão de Turbo e Pressão de Rail durante aceleração em terceira marcha.'
    ],
    solution: 'Corrigir a alimentação de combustível primeiro; substituir válvula diverter com diafragma reforçado.'
  },
  {
    dtcCode: 'DILUIÇÃO-ÓLEO',
    title: 'Contaminação e Diluição de Óleo Lubrificante por Combustível',
    systemAffected: 'Cárter do Motor / Injetores de Alta Pressão / Bomba HPFP',
    primarySymptoms: [
      'Nível de óleo na vareta sobe acima do limite máximo (aparenta estar produzindo óleo)',
      'Forte odor de gasolina ou álcool na tampa de óleo do motor',
      'Viscosidade do óleo extremamente fina, fumaça azulada/preta no escapamento'
    ],
    rootCauses: [
      'Vedação interna (retentor de êmbolo) da bomba HPFP rompida, vazando combustível sob pressão para dentro do cabeçote',
      'Injetor de alta pressão travado parcialmente aberto ou com gotejamento após o desligamento do motor',
      'Uso estrito do veículo em trajetos urbanos ultracurtos (< 3 km) sem que o motor atinja temperatura ideal de queima'
    ],
    diagnosticSteps: [
      '1. Desligar o motor e monitorar com scanner se a pressão do rail se mantém por pelo menos 15 minutos (se cair rapidamente a zero, há vazamento por bico ou bomba).',
      '2. Retirar as velas após repouso e verificar se algum pistão está úmido de combustível.',
      '3. Desmontar a HPFP e testar estanqueidade do selo do êmbolo.'
    ],
    solution: 'Substituição imediata do injetor com fuga ou da HPFP com selo rompido; troca urgente de óleo e filtro para prevenir fusão de bronzinas por perda de lubricidade.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Por que os motores de injeção direta (GDI) conseguem operar com taxas de compressão mais altas que os indiretos (MPI) sem detonar (bater pino)?',
    options: [
      'Porque a gasolina queima mais lentamente sob pressão atmosférica comum.',
      'Devido ao efeito de resfriamento latente: a vaporização do combustível diretamente no cilindro absorve calor do ar comprimido.',
      'Porque o turbo é desligado durante o início da compressão para manter a câmara fria.',
      'Porque as válvulas de admissão permanecem abertas durante a queima da faísca.'
    ],
    correctIndex: 1,
    explanation: 'Ao injetar sob altíssima pressão diretamente no ar comprimido, a rápida mudança de fase líquido-vapor do combustível absorve calor sensível do ar (calor latente de vaporização), reduzindo a temperatura final da câmara em até 20°C a 30°C. Isso suprime a autoignição prematura (batida de pino).'
  },
  {
    id: 2,
    question: 'Qual é a principal razão mecânica para o acúmulo de carvão (carbonização) nas válvulas de admissão de motores exclusivamente GDI?',
    options: [
      'O combustível é pulverizado diretamente sobre as válvulas com muita força.',
      'O combustível não passa pelo coletor de admissão, eliminando o "efeito detergente" sobre os vapores de óleo reciclados pelo PCV.',
      'A temperatura das válvulas é muito baixa para permitir queima de qualquer substância.',
      'A pressão da bomba elétrica do tanque é excessivamente alta para o circuito de ar.'
    ],
    correctIndex: 1,
    explanation: 'Nos motores MPI indiretos, o combustível borrifado no duto lava constantemente a haste e o dorso da válvula quente. No GDI, como o bico fica dentro da câmara, os vapores de óleo do cárter (PCV) e gases da EGR fixam-se nas válvulas quentes e carbonizam sem nenhuma lavagem química.'
  },
  {
    id: 3,
    question: 'O que diferencia a estratégia de combustão em "Carga Estratificada" da "Mistura Homogênea"?',
    options: [
      'A carga estratificada só é utilizada em motores elétricos híbridos sem comando de válvulas.',
      'Na carga estratificada, a mistura é estequiométrica em todo o cilindro com lambda = 1.0 rigorosamente.',
      'Na carga estratificada, o combustível é injetado no final da compressão formando uma pequena bolsa rica perto da vela, enquanto o restante do cilindro tem apenas ar.',
      'Na carga estratificada, a injeção ocorre no coletor e o combustível queima antes de entrar no cilindro.'
    ],
    correctIndex: 2,
    explanation: 'A carga estratificada (lean burn) injeta combustível no final da compressão, aproveitando a cavidade desenhada na cabeça do pistão para conduzir uma nuvem inflamável estequiométrica exatamente até a vela. O restante da câmara contém apenas ar em excesso, permitindo relações ar/combustível de até 40:1 ou 60:1.'
  },
  {
    id: 4,
    question: 'Por que montadoras como Toyota (D-4S) e Volkswagen (EA888 Gen 3) adotaram o sistema de Injeção Dupla (Dual Injection com 8 bicos)?',
    options: [
      'Para gastar o dobro de combustível e garantir rotações acima de 10.000 RPM.',
      'Para eliminar o filtro de ar do motor e substituir a bomba mecânica de alta pressão.',
      'Para aliar a limpeza das válvulas e baixa emissão de fuligem da injeção indireta em baixas cargas com a potência e resistência à detonação da direta em altas cargas.',
      'Apenas como redundância de segurança caso 4 bicos falhem simultaneamente.'
    ],
    correctIndex: 2,
    explanation: 'A injeção mista usa os bicos indiretos (MPI) em marcha lenta e baixas cargas para limpar as válvulas de admissão e reduzir material particulado (fuligem). Em alta carga e acelerações fortes, aciona os bicos de injeção direta (GDI) para extrair o máximo de torque e controlar a temperatura.'
  },
  {
    id: 5,
    question: 'Em que faixa de pressão trabalha tipicamente o circuito de alta pressão (Common Rail) de um motor Diesel moderno em comparação a um motor a gasolina GDI?',
    options: [
      'Diesel: 10 a 20 bar | Gasolina GDI: 500 a 800 bar',
      'Diesel: 1.600 a mais de 2.500 bar | Gasolina GDI: 150 a 350 bar',
      'Diesel: 4 a 6 bar | Gasolina GDI: 4 a 6 bar',
      'Diesel opera com vácuo absoluto (-1 bar) e Gasolina com 100 bar'
    ],
    correctIndex: 1,
    explanation: 'O ciclo Diesel não tem vela de ignição e depende do calor extremo do ar hipercomprimido para queimar o óleo pulverizado por autoignição. Para atomizar o diesel em microgotículas quase gasosas de 4 a 8 micras em frações de milissegundo, o sistema Common Rail moderno atinge de 1.600 a mais de 2.500 bar, enquanto o GDI a gasolina opera tipicamente entre 150 e 350 bar.'
  },
  {
    id: 6,
    question: 'O que é o fenômeno LSPI (Low-Speed Pre-Ignition) comum em motores turbo downsizing com injeção direta e como evitá-lo?',
    options: [
      'É a queima tardia no escapamento que danifica o silencioso traseiro.',
      'É uma pré-ignição violenta em baixas rotações e alta carga causada por gotículas de óleo/combustível incandescentes; evita-se com óleo API SP/ILSAC GF-6.',
      'É o congelamento dos bicos injetores no inverno devido ao uso de etanol.',
      'É a parada do motor quando o start-stop é desativado manualmente.'
    ],
    correctIndex: 1,
    explanation: 'O LSPI (pré-ignição em baixa rotação) ocorre quando misturas de vapores de óleo rico em cálcio e combustível condensado autoignitam antes da centelha da vela sob alta pressão de turbo. A onda de choque resultante quebra canaletas de pistão e bielas. Óleos modernos com classificação API SP / ILSAC GF-6 utilizam magnésio em vez de cálcio para prevenir esse efeito.'
  }
];
