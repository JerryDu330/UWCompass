export const ECE_TYPE_COLORS = {
  ece:      { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  cs:       { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  math:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  stat:     { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  elective: { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  free:     { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
};

export const ECE_COURSE_INFO = {
  // ── 1A (fixed) ──────────────────────────────────────────────────────────────
  ECE150:  { name: 'Fundamentals of Programming',       type: 'ece',  note: 'C++ fundamentals, OOP basics, problem solving — entry programming course for ECE' },
  ECE105:  { name: 'Classical Mechanics',               type: 'ece',  note: "Newton's laws, kinematics, energy — Engineering Physics 1" },
  MATH115: { name: 'Linear Algebra for Engineers',      type: 'math', note: 'Vectors, matrices, eigenvalues — Engineering-oriented linear algebra' },
  MATH117: { name: 'Calculus 1 for Engineers',          type: 'math', note: 'Limits, derivatives, integration — Engineering-track calculus' },
  ECE190:  { name: 'Engineering Profession',            type: 'ece',  note: 'Professional ethics, engineering design process, communication' },

  // ── 1B (fixed) ──────────────────────────────────────────────────────────────
  ECE106:  { name: 'Electricity & Magnetism',           type: 'ece',  note: 'Maxwell equations, Gauss/Ampere/Faraday laws — prereq: ECE105' },
  ECE124:  { name: 'Digital Circuits & Systems',        type: 'ece',  note: 'Boolean algebra, combinational/sequential logic, FSMs' },
  ECE140:  { name: 'Linear Circuits',                   type: 'ece',  note: 'Resistors, capacitors, inductors, Thevenin/Norton equivalents' },
  MATH119: { name: 'Calculus 2 for Engineers',          type: 'math', note: 'Integration techniques, series, ODEs intro — prereq: MATH117' },
  ECE192:  { name: 'Engineering Design Workshop',       type: 'ece',  note: 'Hands-on design project, teamwork, prototyping tools' },

  // ── 2A (fixed) ──────────────────────────────────────────────────────────────
  ECE222:  { name: 'Digital Computers',                 type: 'ece',  note: 'CPU architecture, instruction sets, memory hierarchy — prereq: ECE124' },
  ECE240:  { name: 'Electronic Circuits 1',             type: 'ece',  note: 'Diodes, BJT, MOSFET, amplifier biasing — prereq: ECE140' },
  ECE316:  { name: 'Probability Theory & Statistics',   type: 'ece',  note: 'Random variables, distributions, estimation — Engineering statistics' },
  MATH213: { name: 'Advanced Calculus for Engineers',   type: 'math', note: 'Multivariable calculus, ODEs, vector analysis — prereq: MATH119' },
  ECE290:  { name: 'Engineering & Society',             type: 'ece',  note: 'Societal impact, sustainability, engineering ethics and law' },

  // ── 2B (fixed) ──────────────────────────────────────────────────────────────
  ECE250:  { name: 'Algorithms & Data Structures',      type: 'ece',  note: 'Sorting, trees, graphs, complexity analysis — prereq: ECE150 + MATH119' },
  ECE318:  { name: 'Intro to Communication Systems',    type: 'ece',  note: 'Signals, modulation, noise, bandwidth — prereq: ECE316 + MATH213' },
  ECE320:  { name: 'Fields and Waves',                  type: 'ece',  note: 'Maxwell equations, wave propagation, transmission lines — prereq: ECE106 + MATH213' },
  ECE342:  { name: 'Electronic Circuits 2',             type: 'ece',  note: 'Op-amps, feedback, frequency response — prereq: ECE240' },
  ECE380:  { name: 'Analog Control Systems',            type: 'ece',  note: 'Transfer functions, stability, Bode plots, PID design — prereq: MATH213' },

  // ── Career electives — Computer Engineering ──────────────────────────────────
  ECE406:  { name: 'Algorithm Design & Analysis',       type: 'ece',  note: 'Advanced algorithms, approximation, randomised — prereq: ECE250' },
  ECE423:  { name: 'Embedded Computer Systems',         type: 'ece',  note: 'ARM, device drivers, real-time OS, I/O — prereq: ECE222' },
  ECE454:  { name: 'Computer Architecture',             type: 'ece',  note: 'Pipelines, caches, parallelism, GPUs — prereq: ECE222' },
  ECE459:  { name: 'Programming for Performance',       type: 'ece',  note: 'Parallelism, vectorisation, profiling, C++ — prereq: ECE250 or ECE150' },
  ECE413:  { name: 'Computer Networks',                 type: 'ece',  note: 'TCP/IP, routing, congestion, applications — prereq: ECE316' },
  ECE428:  { name: 'Distributed Computing',             type: 'ece',  note: 'Consistency, consensus, replication, cloud — prereq: ECE413' },

  // ── Career electives — Electrical Engineering ────────────────────────────────
  ECE405:  { name: 'Introduction to Quantum Computing', type: 'ece',  note: 'Qubits, quantum gates, Shor/Grover — prereq: ECE316 or MATH235' },
  ECE430:  { name: 'Introduction to VLSI',              type: 'ece',  note: 'CMOS logic, layout, timing, power — prereq: ECE342' },
  ECE431:  { name: 'Digital Signal Processing',         type: 'ece',  note: 'DFT, FFT, FIR/IIR filters, z-transform — prereq: ECE318' },
  ECE434:  { name: 'Model-Based Estimation',            type: 'ece',  note: 'Kalman filter, Bayesian estimation, SLAM — prereq: ECE316' },
  ECE481:  { name: 'Power Electronics',                 type: 'ece',  note: 'DC-DC converters, inverters, motor drives — prereq: ECE342' },

  // ── Career electives — Communications & Signal Processing ────────────────────
  ECE404:  { name: 'Digital Communications',            type: 'ece',  note: 'Modulation, channel coding, detection — prereq: ECE318' },
  ECE416:  { name: 'Information Theory',                type: 'ece',  note: 'Entropy, channel capacity, source coding — prereq: ECE316' },
  ECE418:  { name: 'Image Processing',                  type: 'ece',  note: '2D Fourier, filtering, compression, segmentation — prereq: ECE318' },
  ECE433:  { name: 'Adaptive Signal Processing',        type: 'ece',  note: 'LMS/RLS filters, beamforming, noise cancellation — prereq: ECE431' },
  ECE463:  { name: 'Digital Communications 2',          type: 'ece',  note: 'OFDM, MIMO, turbo codes, wireless — prereq: ECE404' },

  // ── Career electives — Power Systems ─────────────────────────────────────────
  ECE484:  { name: 'Power Systems',                     type: 'ece',  note: 'Generation, transmission, load flow, protection — prereq: ECE380' },
  ECE486:  { name: 'Control Systems',                   type: 'ece',  note: 'State-space, observers, optimal control, discrete-time — prereq: ECE380' },

  // ── Placeholders ────────────────────────────────────────────────────────────
  E_ELEC_FX1: { name: 'ECE Elective',   type: 'elective', note: 'Any approved 300/400-level ECE elective', placeholder: true },
  E_ELEC_FX2: { name: 'ECE Elective',   type: 'elective', note: 'Any approved 300/400-level ECE elective', placeholder: true },
  E_ELEC_FX3: { name: 'ECE Elective',   type: 'elective', note: 'Any approved 300/400-level ECE elective', placeholder: true },
  E_ELEC_FX4: { name: 'ECE Elective',   type: 'elective', note: 'Any approved 300/400-level ECE elective', placeholder: true },
  E_ELEC_FX5: { name: 'ECE Elective',   type: 'elective', note: 'Any approved 300/400-level ECE elective', placeholder: true },
  E_BRD_1:    { name: 'Non-Eng Elective', type: 'elective', note: 'Non-engineering elective (breadth)', placeholder: true },
  E_BRD_2:    { name: 'Non-Eng Elective', type: 'elective', note: 'Non-engineering elective (breadth)', placeholder: true },
  E_FREE_1:   { name: 'Free Elective',  type: 'free',     note: 'Any course from any faculty', placeholder: true },
  E_FREE_2:   { name: 'Free Elective',  type: 'free',     note: 'Any course from any faculty', placeholder: true },
  E_FREE_3:   { name: 'Free Elective',  type: 'free',     note: 'Any course from any faculty', placeholder: true },
  E_FREE_4:   { name: 'Free Elective',  type: 'free',     note: 'Any course from any faculty', placeholder: true },
  E_PATH_A:   { name: 'Path Elective',  type: 'elective', note: 'Choose an elective for your path', placeholder: true },
  E_PATH_B:   { name: 'Path Elective',  type: 'elective', note: 'Choose an elective for your path', placeholder: true },
  E_PATH_C:   { name: 'Path Elective',  type: 'elective', note: 'Choose an elective for your path', placeholder: true },
  E_PATH_D:   { name: 'Path Elective',  type: 'elective', note: 'Choose an elective for your path', placeholder: true },
  E_PATH_E:   { name: 'Path Elective',  type: 'elective', note: 'Choose an elective for your path', placeholder: true },
  E_PATH_F:   { name: 'Path Elective',  type: 'elective', note: 'Choose an elective for your path', placeholder: true },
};

// e[0..1]=3A, e[2..4]=3B, e[5..6]=4A, e[7..8]=4B
export const ECE_CAREER_PATHS = [
  {
    id: 'compeng',
    title: 'Computer Engineering',
    color: '#4338ca',
    colorLight: '#eef2ff',
    description: 'Build the hardware-software stack — computer architecture, embedded systems, networks, and high-performance computing.',
    skills: ['Computer Architecture', 'Embedded Systems', 'Networking', 'High-Performance Computing'],
    icon: '🖥️',
    // e[0]=ECE423(3A prereq ECE222 2A ✓), e[1]=ECE406(3A prereq ECE250 2B ✓)
    // e[2]=ECE454(3B prereq ECE222 ✓), e[3]=ECE413(3B prereq ECE316 2A ✓), e[4]=ECE459(3B prereq ECE250 ✓)
    // e[5]=ECE428(4A prereq ECE413 3B ✓), e[6]=E_PATH_A
    // e[7]=E_PATH_B, e[8]=E_PATH_C
    electives: ['ECE423', 'ECE406', 'ECE454', 'ECE413', 'ECE459', 'ECE428', 'E_PATH_A', 'E_PATH_B', 'E_PATH_C'],
  },
  {
    id: 'electrical',
    title: 'Electrical Engineering',
    color: '#c2410c',
    colorLight: '#fff7ed',
    description: 'Design analog/digital circuits, VLSI chips, and quantum hardware. From transistors to silicon.',
    skills: ['VLSI Design', 'Quantum Computing', 'Analog Circuits', 'Signal Processing'],
    icon: '⚡',
    // e[0]=ECE430(3A prereq ECE342 2B ✓), e[1]=ECE405(3A prereq ECE316 2A ✓)
    // e[2]=ECE431(3B prereq ECE318 2B ✓), e[3]=ECE434(3B prereq ECE316 ✓), e[4]=E_PATH_A
    // e[5]=ECE481(4A prereq ECE342 2B ✓), e[6]=E_PATH_B
    // e[7]=E_PATH_C, e[8]=E_PATH_D
    electives: ['ECE430', 'ECE405', 'ECE431', 'ECE434', 'E_PATH_A', 'ECE481', 'E_PATH_B', 'E_PATH_C', 'E_PATH_D'],
  },
  {
    id: 'comms',
    title: 'Communications & Signal Processing',
    color: '#0891b2',
    colorLight: '#cffafe',
    description: 'Design wireless systems, process audio and images, and build the information infrastructure of modern networks.',
    skills: ['Wireless Communications', 'Digital Signal Processing', 'Information Theory', 'Image Processing'],
    icon: '📡',
    // e[0]=ECE404(3A prereq ECE318 2B ✓), e[1]=ECE416(3A prereq ECE316 2A ✓)
    // e[2]=ECE431(3B prereq ECE318 ✓), e[3]=ECE418(3B prereq ECE318 ✓), e[4]=E_PATH_A
    // e[5]=ECE433(4A prereq ECE431 3B ✓), e[6]=ECE463(4A prereq ECE404 3A ✓)
    // e[7]=E_PATH_B, e[8]=E_PATH_C
    electives: ['ECE404', 'ECE416', 'ECE431', 'ECE418', 'E_PATH_A', 'ECE433', 'ECE463', 'E_PATH_B', 'E_PATH_C'],
  },
  {
    id: 'control',
    title: 'Control & Power Systems',
    color: '#059669',
    colorLight: '#d1fae5',
    description: 'Design control systems for robotics, vehicles, and energy grids. Power electronics and grid-scale systems.',
    skills: ['Control Theory', 'Power Electronics', 'Robotics', 'Grid Systems'],
    icon: '🔋',
    // e[0]=ECE486(3A prereq ECE380 2B ✓), e[1]=ECE434(3A prereq ECE316 2A ✓)
    // e[2]=ECE481(3B prereq ECE342 2B ✓), e[3]=ECE484(3B prereq ECE380 2B ✓), e[4]=E_PATH_A
    // e[5]=E_PATH_B(4A), e[6]=E_PATH_C(4A)
    // e[7]=E_PATH_D, e[8]=E_PATH_E
    electives: ['ECE486', 'ECE434', 'ECE481', 'ECE484', 'E_PATH_A', 'E_PATH_B', 'E_PATH_C', 'E_PATH_D', 'E_PATH_E'],
  },
];

export function generateECEPlan(path) {
  const e = path.electives;
  return [
    {
      term: '1A', label: 'First Year — Fall', fixed: true,
      courses: ['ECE150', 'ECE105', 'MATH115', 'MATH117', 'ECE190'],
    },
    {
      term: '1B', label: 'First Year — Winter', fixed: true,
      courses: ['ECE106', 'ECE124', 'ECE140', 'MATH119', 'ECE192'],
    },
    {
      term: '2A', label: 'Second Year — Fall', fixed: true,
      courses: ['ECE222', 'ECE240', 'ECE316', 'MATH213', 'ECE290'],
    },
    {
      term: '2B', label: 'Second Year — Winter', fixed: true,
      courses: ['ECE250', 'ECE318', 'ECE320', 'ECE342', 'ECE380'],
    },
    {
      term: '3A', label: 'Third Year — Fall',
      courses: [e[0], e[1], 'E_ELEC_FX1', 'E_ELEC_FX2', 'E_BRD_1'],
    },
    {
      term: '3B', label: 'Third Year — Winter',
      courses: [e[2], e[3], e[4], 'E_ELEC_FX3', 'E_BRD_2'],
    },
    {
      term: '4A', label: 'Fourth Year — Fall',
      courses: [e[5], e[6], 'E_ELEC_FX4', 'E_FREE_1', 'E_FREE_2'],
    },
    {
      term: '4B', label: 'Fourth Year — Winter',
      courses: [e[7], e[8], 'E_ELEC_FX5', 'E_FREE_3', 'E_FREE_4'],
    },
  ];
}

export const ECE_PROGRAM_CONFIG = {
  id: 'ece',
  shortTitle: 'ECE',
  badge: 'ECE Honours · Degree Planner',
  heroTitle: 'Build Your ECE Roadmap',
  heroDesc:
    'Choose a specialisation to generate a personalised 8-term plan built on the UW Electrical & Computer Engineering Honours degree. From circuits to networks to quantum — click any course to mark it complete.',
  calendarUrl: 'https://ugradcalendar.uwaterloo.ca/page/ENG-Electrical-and-Computer-Engineering',
  calendarLabel: 'UW ECE undergraduate calendar',
  courseInfo: ECE_COURSE_INFO,
  typeColors: ECE_TYPE_COLORS,
  legend: [
    ['ece',      'ECE Course'],
    ['math',     'MATH Course'],
    ['elective', 'ECE Elective'],
    ['free',     'Free Elective'],
  ],
  paths: ECE_CAREER_PATHS,
  generatePlan: generateECEPlan,
};
