// ─── Course type colour tokens ───────────────────────────────────────────────
export const SE_TYPE_COLORS = {
  cs:       { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  ece:      { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  se:       { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
  math:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  stat:     { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  elective: { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  free:     { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
};

// ─── All course metadata ─────────────────────────────────────────────────────
export const SE_COURSE_INFO = {
  // ── 1A (fixed) ──────────────────────────────────────────────────────────────
  CS137:   { name: 'Programming Principles',        type: 'cs',   note: 'C programming, recursion, basic data structures — SE entry point to CS' },
  ECE105:  { name: 'Classical Mechanics',           type: 'ece',  note: 'Newton\'s laws, kinematics, energy, momentum — Engineering physics 1' },
  MATH115: { name: 'Linear Algebra for Engineers',  type: 'math', note: 'Vectors, matrices, eigenvalues — Engineering-oriented linear algebra' },
  MATH135: { name: 'Algebra',                       type: 'math', note: 'Proof techniques, number theory, modular arithmetic' },
  SE101:   { name: 'Introduction to SE',            type: 'se',   note: 'Overview of software engineering discipline, team work, and design process' },

  // ── 1B (fixed) ──────────────────────────────────────────────────────────────
  CS138:   { name: 'Data Abstraction & Impl.',      type: 'cs',   note: 'C++, STL, linked lists, OOP basics — prereq: CS137' },
  ECE106:  { name: 'Electricity & Magnetism',       type: 'ece',  note: 'Maxwell equations, circuits intro, Gauss/Ampere/Faraday laws — prereq: ECE105' },
  ECE140:  { name: 'Linear Circuits',               type: 'ece',  note: 'Resistors, capacitors, inductors, Thevenin/Norton, AC analysis' },
  MATH117: { name: 'Calculus 1 for Engineers',      type: 'math', note: 'Limits, derivatives, integration — Engineering-track calculus' },
  SE102:   { name: 'SE Seminar',                    type: 'se',   note: 'Professional development, ethics overview, SE career paths' },

  // ── 2A (fixed) ──────────────────────────────────────────────────────────────
  CS241:   { name: 'Sequential Programs',           type: 'cs',   note: 'Compilers, assembly language, formal grammars, parsing — prereq: CS138' },
  CS247:   { name: 'Software Engineering Principles', type: 'cs', note: 'Design patterns, abstraction, modularity, software quality — prereq: CS138' },
  ECE222:  { name: 'Digital Computers',             type: 'ece',  note: 'CPU architecture, instruction sets, memory hierarchy — prereq: ECE140' },
  MATH213: { name: 'Advanced Math for SE',          type: 'math', note: 'Multivariable calculus, ODEs, Fourier series — prereq: MATH117' },
  SE212:   { name: 'Logic & Computation',           type: 'se',   note: 'Propositional/predicate logic, formal verification — SE version of CS245' },

  // ── 2B (fixed) ──────────────────────────────────────────────────────────────
  CS240:   { name: 'Data Structures',               type: 'cs',   note: 'Heaps, tries, B-trees, hashing — prereq: CS241 + SE212' },
  CS246:   { name: 'OOP Software Development',      type: 'cs',   note: 'C++, design patterns, UML, SOLID — prereq: CS138' },
  ECE240:  { name: 'Electronic Circuits',           type: 'ece',  note: 'Transistors, amplifiers, op-amps — prereq: ECE140' },
  STAT206: { name: 'Statistics for SE',             type: 'stat', note: 'Probability, estimation, hypothesis testing — Engineering-track statistics' },
  SE265:   { name: 'SE Methods & Tools',            type: 'se',   note: 'Software processes, version control, project planning, agile methods' },

  // ── 3A (core) ───────────────────────────────────────────────────────────────
  CS341:   { name: 'Algorithms',                    type: 'cs',   note: 'Divide & conquer, DP, greedy, NP-completeness — prereq: CS240' },
  CS350:   { name: 'Operating Systems',             type: 'cs',   note: 'Processes, threads, scheduling, memory, file systems — prereq: CS240 + CS241' },
  SE380:   { name: 'Introduction to Control Theory', type: 'se',  note: 'Feedback systems, transfer functions, stability, PID — prereq: MATH213' },
  SE464:   { name: 'Software Design & Architectures', type: 'se', note: 'Architectural patterns, quality attributes, design tradeoffs — prereq: CS247' },

  // ── 3B (core) ───────────────────────────────────────────────────────────────
  CS343:   { name: 'Concurrent & Parallel Programming', type: 'cs', note: 'Threads, synchronization, μC++ — prereq: CS241 + CS246 + CS350' },
  SE463:   { name: 'Software Requirements',         type: 'se',   note: 'Requirements elicitation, specification, validation techniques' },
  SE465:   { name: 'Software Testing & QA',         type: 'se',   note: 'Testing techniques, coverage metrics, CI/CD, automated testing — prereq: CS246' },
  SE490:   { name: 'SE Design Project Proposal',    type: 'se',   note: 'Project definition, planning, team formation for the capstone' },

  // ── 4A / 4B (core) ──────────────────────────────────────────────────────────
  SE491:   { name: 'SE Design Project 1',           type: 'se',   note: 'First half of the major capstone design project — design, implementation' },
  SE492:   { name: 'SE Design Project 2',           type: 'se',   note: 'Capstone project completion — demo, final report, and presentation' },

  // ── Career electives — Full-Stack & Product ──────────────────────────────────
  CS346:   { name: 'Application Development',       type: 'cs',   note: 'Full-stack web dev, team project — prereq: CS246' },
  CS349:   { name: 'User Interfaces',               type: 'cs',   note: 'GUI programming, web UIs, event-driven design — prereq: CS350' },
  CS446:   { name: 'Software Design & Architectures', type: 'cs', note: 'Design patterns, architectural styles — prereq: CS350' },
  CS447:   { name: 'Software Testing',              type: 'cs',   note: 'Unit testing, coverage, CI/CD methods — prereq: CS350' },

  // ── Career electives — Embedded Systems ─────────────────────────────────────
  ECE224:  { name: 'Embedded Microprocessor Systems', type: 'ece', note: 'ARM architecture, device drivers, embedded C — prereq: ECE222' },
  CS452:   { name: 'Real-time Programming',         type: 'cs',   note: 'Embedded kernel, real-time constraints — prereq: CS350' },
  ECE429:  { name: 'Embedded & Real-Time Systems',  type: 'ece',  note: 'RTOS concepts, scheduling, embedded applications — prereq: ECE222' },

  // ── Career electives — AI / Machine Learning ─────────────────────────────────
  CS480:   { name: 'Introduction to Machine Learning', type: 'cs', note: 'Supervised/unsupervised learning, model selection — prereq: Level ≥ 3B' },
  CS486:   { name: 'Introduction to AI',            type: 'cs',   note: 'Search, CSP, Bayesian networks, planning — prereq: CS341' },
  CS489:   { name: 'Topics in Machine Learning',    type: 'cs',   note: 'Deep learning, transformers, RL — prereq: CS341' },

  // ── Career electives — Cloud & Distributed Systems ──────────────────────────
  CS456:   { name: 'Computer Networks',             type: 'cs',   note: 'TCP/IP, routing, congestion control — prereq: CS350' },
  CS454:   { name: 'Distributed Systems',           type: 'cs',   note: 'Consensus (Paxos/Raft), replication, CAP theorem — prereq: CS350' },
  CS448:   { name: 'Database Systems Implementation', type: 'cs', note: 'Buffer pools, query executors, transactions internals — prereq: CS350' },

  // ── Career electives — Security ──────────────────────────────────────────────
  CS453:   { name: 'Software Fault Tolerance',      type: 'cs',   note: 'Reliability, redundancy, fault recovery — prereq: CS350' },
  ECE458:  { name: 'Computer Security',             type: 'ece',  note: 'Security principles, cryptographic protocols, malware analysis' },

  // ── Placeholders ────────────────────────────────────────────────────────────
  SE_TECH_ELEC_1: { name: 'Technical Elective',    type: 'elective', note: 'Any approved CS or ECE elective', placeholder: true },
  SE_FREE_1:      { name: 'Free Elective',         type: 'free',     note: 'Any course from any faculty', placeholder: true },
  SE_FREE_2:      { name: 'Free Elective',         type: 'free',     note: 'Any course from any faculty', placeholder: true },
  SE_FREE_3:      { name: 'Free Elective',         type: 'free',     note: 'Any course from any faculty', placeholder: true },
  SE_ELEC_A:      { name: 'Path Elective',         type: 'elective', note: 'Choose an elective for your chosen path', placeholder: true },
  SE_ELEC_B:      { name: 'Path Elective',         type: 'elective', note: 'Choose an elective for your chosen path', placeholder: true },
  SE_ELEC_C:      { name: 'Path Elective',         type: 'elective', note: 'Choose an elective for your chosen path', placeholder: true },
};

// ─── Career paths ─────────────────────────────────────────────────────────────
// Plan: 1A–2B fully fixed (20 courses), 3A–3B core + 2 path electives,
// 4A–4B has SE491/SE492 plus 4 path electives over two terms.
// Elective slots: e[0]=3A, e[1]=3B, e[2..3]=4A, e[4..5]=4B
export const SE_CAREER_PATHS = [
  {
    id: 'fullstack',
    title: 'Full-Stack & Product',
    color: '#059669',
    colorLight: '#d1fae5',
    description: 'Build complete web applications end-to-end. Application dev, UI design, database systems, and software architecture.',
    skills: ['React / Web', 'Databases', 'UI Design', 'System Architecture'],
    icon: '🌐',
    // CS346 (CS246→3A ✓), CS349 (CS350→3B ✓),
    // CS446 (CS350→4A ✓), CS447 (CS350→4A ✓)
    electives: ['CS346', 'CS349', 'CS446', 'CS447', 'SE_ELEC_A', 'SE_ELEC_B'],
  },
  {
    id: 'embedded',
    title: 'Embedded Systems',
    color: '#dc2626',
    colorLight: '#fee2e2',
    description: 'Program hardware directly — microprocessors, device drivers, real-time kernels, and embedded applications.',
    skills: ['ARM / Embedded C', 'Device Drivers', 'Real-Time OS', 'Hardware Interface'],
    icon: '🔌',
    // ECE224 (ECE222→3A ✓), CS452 (CS350→3B ✓),
    // ECE429 (ECE222→4A ✓)
    electives: ['ECE224', 'CS452', 'ECE429', 'SE_ELEC_A', 'SE_ELEC_B', 'SE_ELEC_C'],
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    color: '#7c3aed',
    colorLight: '#ede9fe',
    description: 'Apply machine learning to real products — from classical models to deep neural networks and intelligent agents.',
    skills: ['Machine Learning', 'Neural Networks', 'AI Planning', 'Deep Learning'],
    icon: '🤖',
    // SE_ELEC_A (3A — placeholder until CS341 unlocks things),
    // CS480 (Level≥3B ✓), CS486 (CS341→4A ✓), CS489 (CS341→4A ✓)
    electives: ['SE_ELEC_A', 'CS480', 'CS486', 'CS489', 'SE_ELEC_B', 'SE_ELEC_C'],
  },
  {
    id: 'cloud',
    title: 'Cloud & Distributed Systems',
    color: '#0891b2',
    colorLight: '#cffafe',
    description: 'Design resilient, scalable systems across networks and cloud infrastructure. Databases, distributed consensus, and networking.',
    skills: ['Distributed Computing', 'Networking', 'Database Internals', 'Cloud Architecture'],
    icon: '☁️',
    // SE_ELEC_A (3A — placeholder), CS456 (CS350→3B ✓),
    // CS454 (CS350→4A ✓), CS448 (CS350→4A ✓)
    electives: ['SE_ELEC_A', 'CS456', 'CS454', 'CS448', 'SE_ELEC_B', 'SE_ELEC_C'],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    color: '#475569',
    colorLight: '#f1f5f9',
    description: 'Protect systems and data — software fault tolerance, cryptographic protocols, and security analysis.',
    skills: ['Cryptography', 'Fault Tolerance', 'Network Security', 'Secure Design'],
    icon: '🔐',
    // SE_ELEC_A (3A — placeholder), CS453 (CS350→3B ✓),
    // ECE458 (4A), CS454 (CS350→4A ✓)
    electives: ['SE_ELEC_A', 'CS453', 'ECE458', 'CS454', 'SE_ELEC_B', 'SE_ELEC_C'],
  },
];

// ─── Plan generator ──────────────────────────────────────────────────────────
// 1A–2B: fully fixed core (SE, CS, ECE, Math)
// 3A: CS341, CS350, SE380, SE464 + e[0]
// 3B: CS343, SE463, SE465, SE490 + e[1]
// 4A: SE491, e[2], e[3], Tech Elec, Free
// 4B: SE492, e[4], e[5], Free, Free
export function generateSEPlan(path) {
  const e = path.electives;
  return [
    {
      term: '1A', label: 'First Year — Fall', fixed: true,
      courses: ['CS137', 'ECE105', 'MATH115', 'MATH135', 'SE101'],
    },
    {
      term: '1B', label: 'First Year — Winter', fixed: true,
      courses: ['CS138', 'ECE106', 'ECE140', 'MATH117', 'SE102'],
    },
    {
      term: '2A', label: 'Second Year — Fall', fixed: true,
      courses: ['CS241', 'CS247', 'ECE222', 'MATH213', 'SE212'],
    },
    {
      term: '2B', label: 'Second Year — Winter', fixed: true,
      courses: ['CS240', 'CS246', 'ECE240', 'STAT206', 'SE265'],
    },
    {
      term: '3A', label: 'Third Year — Fall',
      courses: ['CS341', 'CS350', 'SE380', 'SE464', e[0]],
    },
    {
      term: '3B', label: 'Third Year — Winter',
      courses: ['CS343', 'SE463', 'SE465', 'SE490', e[1]],
    },
    {
      term: '4A', label: 'Fourth Year — Fall',
      courses: ['SE491', e[2], e[3], 'SE_TECH_ELEC_1', 'SE_FREE_1'],
    },
    {
      term: '4B', label: 'Fourth Year — Winter',
      courses: ['SE492', e[4], e[5], 'SE_FREE_2', 'SE_FREE_3'],
    },
  ];
}

// ─── Program config (consumed by ProgramPlanner) ─────────────────────────────
export const SE_PROGRAM_CONFIG = {
  id: 'se',
  shortTitle: 'SE',
  badge: 'SE Honours · Degree Planner',
  heroTitle: 'Build Your SE Roadmap',
  heroDesc:
    'Choose a career path to generate a personalised 8-term plan built on the UW Software Engineering Honours program. The SE program blends CS and ECE — click any course to mark it complete.',
  calendarUrl: 'https://ugradcalendar.uwaterloo.ca/page/ENG-Software-Engineering',
  calendarLabel: 'UW SE undergraduate calendar',
  courseInfo: SE_COURSE_INFO,
  typeColors: SE_TYPE_COLORS,
  legend: [
    ['cs',       'CS Course'],
    ['ece',      'ECE Course'],
    ['se',       'SE Course'],
    ['math',     'MATH Course'],
    ['stat',     'STAT Course'],
    ['elective', 'Technical Elective'],
    ['free',     'Free Elective'],
  ],
  paths: SE_CAREER_PATHS,
  generatePlan: generateSEPlan,
};
