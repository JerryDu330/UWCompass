// ─── Course type colour tokens ───────────────────────────────────────────────
export const TYPE_COLORS = {
  cs:       { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  math:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  stat:     { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  commst:   { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  breadth:  { bg: '#f9fafb', text: '#6b7280', border: '#d1d5db' },
  elective: { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  free:     { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
};

// ─── All course metadata ─────────────────────────────────────────────────────
export const COURSE_INFO = {
  // ── 1A (fixed) ──────────────────────────────────────────────────────────────
  CS135:     { name: 'Functional Programming',             type: 'cs',      note: 'Intro to programming via Racket — functions, recursion, lists' },
  MATH135:   { name: 'Algebra',                            type: 'math',    note: 'Proof techniques, number theory, modular arithmetic' },
  MATH137:   { name: 'Calculus 1',                         type: 'math',    note: 'Limits, derivatives, applications of differentiation' },
  COMMST_A:  { name: 'Communication (1)',                  type: 'commst',  note: 'First communications breadth requirement', placeholder: true },
  BREADTH_1: { name: 'Non-Math Elective',                  type: 'breadth', note: 'Any non-CS/MATH/STAT course', placeholder: true },

  // ── 1B (fixed) ──────────────────────────────────────────────────────────────
  CS136:     { name: 'Imperative Programming',             type: 'cs',      note: 'C, memory management, data structures — CS136L lab included as coreq' },
  MATH136:   { name: 'Linear Algebra 1',                   type: 'math',    note: 'Vectors, matrices, linear systems, determinants' },
  MATH138:   { name: 'Calculus 2',                         type: 'math',    note: 'Integration techniques, sequences and series' },
  COMMST_B:  { name: 'Communication (2)',                  type: 'commst',  note: 'Second communications breadth requirement', placeholder: true },
  BREADTH_2: { name: 'Non-Math Elective',                  type: 'breadth', note: 'Any non-CS/MATH/STAT course', placeholder: true },

  // ── 2A (fixed) ──────────────────────────────────────────────────────────────
  // CS240 is intentionally NOT here — it prereqs CS241, CS245, STAT230 (all 2A courses).
  // CS240 belongs in 2B.
  CS241:     { name: 'Sequential Programs',                type: 'cs',      note: 'Compilers, assembly language, formal grammars, parsing — prereq: CS136 ≥ 85%' },
  CS245:     { name: 'Logic and Computation',              type: 'cs',      note: 'Propositional/predicate logic, soundness, completeness — prereq: CS136 + MATH135' },
  STAT230:   { name: 'Probability',                        type: 'stat',    note: 'Discrete & continuous distributions, expectation, variance — prereq: MATH137' },
  MATH239:   { name: 'Intro to Combinatorics',             type: 'math',    note: 'Graphs, trees, counting, pigeonhole principle — prereq: MATH138' },
  BREADTH_3: { name: 'Non-Math Elective',                  type: 'breadth', note: 'Any non-CS/MATH/STAT course', placeholder: true },

  // ── 2B ──────────────────────────────────────────────────────────────────────
  // CS240 is now correctly in 2B — its prereqs (CS241, CS245, STAT230) are all in 2A.
  CS240:     { name: 'Data Structures',                    type: 'cs',      note: 'Heaps, tries, B-trees, hashing — prereq: CS241 + CS245 + STAT230 (all 2A)' },
  CS246:     { name: 'OOP Software Development',           type: 'cs',      note: 'C++, design patterns, UML, SOLID — prereq: CS136 ≥ 60% + CS136L' },
  CS251:     { name: 'Computer Organization',              type: 'cs',      note: 'Digital circuits, ISA, pipelining, memory hierarchy — prereq: CS136' },
  STAT231:   { name: 'Statistics',                         type: 'stat',    note: 'Estimation, hypothesis testing, confidence intervals — prereq: MATH138 + STAT230' },

  // ── 3A (core) ───────────────────────────────────────────────────────────────
  // CS341 prereqs: CS240 + CS245 + MATH239 → all satisfied after 2B ✓
  // CS350 prereqs: CS240 + CS241 → satisfied after 2B ✓
  CS341:     { name: 'Algorithms',                         type: 'cs',      note: 'Divide & conquer, dynamic programming, greedy, NP-completeness — prereq: CS240 + CS245 + MATH239' },
  CS350:     { name: 'Operating Systems',                  type: 'cs',      note: 'Processes, threads, scheduling, memory, file systems — prereq: CS240 + CS241' },

  // ── 3B (core) ───────────────────────────────────────────────────────────────
  // CS360 prereqs: CS240 + CS241 + MATH239 → all satisfied after 2B ✓
  // CS365 prereqs: CS240 + CS241 + MATH239 → same as CS360 ✓
  CS360:     { name: 'Theory of Computing',                type: 'cs',      note: 'Automata, decidability, Turing machines — prereq: CS240 + CS241 + MATH239' },
  CS365:     { name: 'Models of Computation',              type: 'cs',      note: 'Lambda calculus, type theory, computability, semantics — prereq: CS240 + CS241 + MATH239' },

  // ── Career electives — AI / ML ───────────────────────────────────────────────
  // CS479: STAT230 → available 2B+ ✓
  // CS480: Level >= 3B only → 3B ✓
  // CS486: CS341 → 3B+ ✓ (CS341 done in 3A)
  // CS485: CS341 + STAT231 → 3B+ ✓
  // CS489: CS341 + STAT231 → 3B+ ✓
  CS479:     { name: 'Random Processes in CS',             type: 'cs',      note: 'Markov chains, random walks, stochastic algorithms — prereq: STAT230' },
  CS480:     { name: 'Introduction to Machine Learning',   type: 'cs',      note: 'Supervised/unsupervised learning, model selection — prereq: Level ≥ 3B' },
  CS486:     { name: 'Introduction to AI',                 type: 'cs',      note: 'Search, CSP, Bayesian networks, planning — prereq: CS341' },
  CS485:     { name: 'Statistical Foundations of ML',      type: 'cs',      note: 'PAC learning, VC dimension, kernel methods — prereq: CS341 + STAT231' },
  CS489:     { name: 'Topics in Machine Learning',         type: 'cs',      note: 'Deep learning, transformers, RL — prereq: CS341 + STAT231' },

  // ── Career electives — Systems ───────────────────────────────────────────────
  // CS343: CS240 + CS241 + CS246 + CS251 → all ≤ 2B → available in 3A ✓
  // CS457: CS246 + STAT231 → 2B done → 3A ✓
  // CS452: CS350 → 3A done → 3B ✓
  // CS456: CS350 → 3B ✓
  // CS454: CS350 → 3B/4A ✓
  // CS436: CS241 (2A) or CS251 (2B) or CS246 (2B) → 3A/4A ✓
  // CS431: CS341 + CS251 → CS341 done 3A → 3B/4B ✓
  CS343:     { name: 'Concurrent & Parallel Programming',  type: 'cs',      note: 'Threads, synchronization, μC++ — prereq: CS240 + CS241 + CS246 + CS251' },
  CS457:     { name: 'System Performance Evaluation',      type: 'cs',      note: 'Queuing theory, simulation, benchmarking — prereq: CS246 + STAT231' },
  CS452:     { name: 'Real-time Programming',              type: 'cs',      note: 'Embedded kernel, real-time constraints — prereq: CS350' },
  CS456:     { name: 'Computer Networks',                  type: 'cs',      note: 'TCP/IP, routing, congestion control — prereq: CS350' },
  CS454:     { name: 'Distributed Systems',                type: 'cs',      note: 'Consensus (Paxos/Raft), replication, CAP theorem — prereq: CS350' },
  CS436:     { name: 'Networks & Distributed Systems',     type: 'cs',      note: 'P2P, CDNs, datacenter architectures — prereq: CS241 or CS251' },
  CS431:     { name: 'Data-Intensive Distributed Systems', type: 'cs',      note: 'MapReduce, Spark, distributed databases — prereq: CS341 + CS251' },

  // ── Career electives — Software Engineering ──────────────────────────────────
  // CS348: CS241 + MATH136 → available 2B ✓ (does NOT need CS246!)
  // CS346: CS246 → available 3A ✓
  // CS338: CS246 (or CS230/CS231/CS234) → available 3A ✓
  // CS349: CS350 → 3B ✓
  // CS446: CS350 → 3B ✓
  // CS447: CS350 → 3B ✓
  // CS445: CS341 OR CS350 → both 3A, so 3B ✓ (needs one done first)
  CS348:     { name: 'Intro to Database Management',       type: 'cs',      note: 'SQL, relational algebra, transactions — prereq: CS241 + MATH136 (no CS246 needed!)' },
  CS346:     { name: 'Application Development',            type: 'cs',      note: 'Full-stack dev, team project — prereq: CS246' },
  CS338:     { name: 'Relational Databases',               type: 'cs',      note: 'SQL, ER modeling, query optimization — prereq: CS246' },
  CS349:     { name: 'User Interfaces',                    type: 'cs',      note: 'GUI programming, event-driven, web UIs — prereq: CS350' },
  CS446:     { name: 'Software Design & Architectures',    type: 'cs',      note: 'Design patterns, architectural styles — prereq: CS350' },
  CS447:     { name: 'Software Testing & Quality',         type: 'cs',      note: 'Unit testing, coverage, CI/CD — prereq: CS350' },
  CS445:     { name: 'Software Requirements',              type: 'cs',      note: 'Requirements engineering, use cases — prereq: CS341 or CS350' },

  // ── Career electives — Theory ────────────────────────────────────────────────
  // CS330: MATH239 (2A) → available 2B ✓
  // CS462: CS240 (2B) → available 3A ✓
  // CS466: CS341 (3A) → available 3B ✓
  // CS487: CS341 + STAT231 → available 3B ✓
  // CS430: CS330 + Level ≥ 3A → CS330 from 2B, Level ≥ 3A → available 4A ✓
  CS330:     { name: 'Introduction to Graph Theory',       type: 'cs',      note: 'Trees, planar graphs, colouring, network flows — prereq: MATH239' },
  CS462:     { name: 'Formal Languages & Parsing',         type: 'cs',      note: 'Grammars, LL/LR parsers, language theory — prereq: CS240' },
  CS466:     { name: 'Algorithm Design & Analysis',        type: 'cs',      note: 'Advanced algorithms, approximation, online — prereq: CS341' },
  CS487:     { name: 'Symbolic Computation',               type: 'cs',      note: 'Computer algebra, Gröbner bases, factoring — prereq: CS341 + STAT231' },
  CS430:     { name: 'Computational Complexity',           type: 'cs',      note: 'P vs NP, circuit lower bounds, space complexity — prereq: CS330 + Level ≥ 3A' },

  // ── Career electives — Data Science ──────────────────────────────────────────
  // CS479 (also in AI), CS338 (also in SWE), CS480 (also in AI)
  // CS431 (also in Systems): CS341 + CS251 → 3B ✓
  // CS489 (also in AI)
  // CS448: CS350 → 3B/4A ✓
  CS448:     { name: 'Database Systems Implementation',    type: 'cs',      note: 'Buffer pools, query executors, transactions internals — prereq: CS350' },

  // ── Career electives — Security ──────────────────────────────────────────────
  // CS343 (also in Systems)
  // CS436 (also in Systems)
  // CS452 (also in Systems)
  // CS456 (also in Systems)
  // CS454 (also in Systems)
  // CS458: CS360 OR CS365 → both in 3B → available 4A ✓
  // CS453: CS350 → 3B/4A ✓
  CS458:     { name: 'Computer Security and Privacy',      type: 'cs',      note: 'Cryptography, access control, attacks — prereq: CS360 or CS365' },
  CS453:     { name: 'Software Fault Tolerance',           type: 'cs',      note: 'Reliability, redundancy, recovery — prereq: CS350' },

  // ── Generic plan placeholders (fixed slots, not path-specific) ───────────────
  BREADTH_4: { name: 'Non-Math Elective',    type: 'breadth',  note: 'Depth/breadth requirement', placeholder: true },
  BREADTH_5: { name: 'Non-Math Elective',    type: 'breadth',  note: 'Depth/breadth requirement', placeholder: true },
  BREADTH_6: { name: 'Non-Math Elective',    type: 'breadth',  note: 'Depth/breadth requirement', placeholder: true },
  CS_ELEC_1: { name: 'CS Elective',          type: 'elective', note: 'Any 400-level CS course', placeholder: true },
  CS_ELEC_2: { name: 'CS Elective',          type: 'elective', note: 'Any 400-level CS course', placeholder: true },
  FREE_1:    { name: 'Free Elective',        type: 'free',     note: 'Any course from any faculty', placeholder: true },
  FREE_2:    { name: 'Free Elective',        type: 'free',     note: 'Any course from any faculty', placeholder: true },
  FREE_3:    { name: 'Free Elective',        type: 'free',     note: 'Any course from any faculty', placeholder: true },

  // ── Path-specific elective placeholders (unique keys to avoid duplicate React keys) ──
  // ELEC_A → 2B slot, ELEC_B/C → 3A slots, ELEC_D/E → 3B slots,
  // ELEC_F/G → 4A slots, ELEC_H/I → 4B slots
  ELEC_A:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 2B elective that fits your interests', placeholder: true },
  ELEC_B:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 3A elective — options open after CS246 and CS251 are done', placeholder: true },
  ELEC_C:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 3A elective', placeholder: true },
  ELEC_D:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 3B elective — many 400-level courses unlock after CS341 and CS350', placeholder: true },
  ELEC_E:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 3B elective', placeholder: true },
  ELEC_F:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 4A elective', placeholder: true },
  ELEC_G:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 4A elective', placeholder: true },
  ELEC_H:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 4B elective', placeholder: true },
  ELEC_I:    { name: 'Path Elective',        type: 'elective', note: 'Choose a 4B elective', placeholder: true },
};

// ─── Career paths ────────────────────────────────────────────────────────────
// Each path supplies 9 electives: e[0..8] fill the career slots in 2B → 4B.
// Slot mapping: e[0]=2B, e[1]=3A-1, e[2]=3A-2, e[3]=3B-1, e[4]=3B-2,
//               e[5]=4A-1, e[6]=4A-2, e[7]=4B-1, e[8]=4B-2
//
// Prereq ordering enforced:
//   2B can use: anything needing ≤ 2A courses (CS241, CS245, MATH239, STAT230)
//   3A can use: anything needing ≤ 2B courses (+ CS240, CS246, CS251, STAT231)
//   3B can use: anything needing ≤ 3A courses (+ CS341, CS350)
//   4A can use: anything needing ≤ 3B courses (+ CS360, CS365)

export const CAREER_PATHS = [
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    color: '#7c3aed',
    colorLight: '#ede9fe',
    description: 'Build intelligent systems from classical ML to deep neural networks. Requires strong probability and linear algebra.',
    skills: ['Neural Networks', 'Statistical Learning', 'Probabilistic Modeling', 'Optimization'],
    icon: '🤖',
    // CS479 (STAT230→2B), ELEC_B/C (3A — most AI courses need CS341 first),
    // CS480 (Level≥3B), CS486 (CS341→3B), CS485/489 (CS341+STAT231→4A)
    electives: ['CS479', 'ELEC_B', 'ELEC_C', 'CS480', 'CS486', 'CS485', 'CS489', 'ELEC_H', 'ELEC_I'],
  },
  {
    id: 'systems',
    title: 'Systems & Infrastructure',
    color: '#dc2626',
    colorLight: '#fee2e2',
    description: 'Design operating systems, distributed systems, and high-performance infrastructure. Deep hardware-software integration.',
    skills: ['Concurrency', 'Distributed Computing', 'Networking', 'Embedded Systems'],
    icon: '⚙️',
    // ELEC_A (2B — CS343 needs CS246+CS251, both in 2B so earliest is 3A),
    // CS343+CS457 (3A), CS452+CS456 (3B), CS454+CS436 (4A), CS431 (4B)
    electives: ['ELEC_A', 'CS343', 'CS457', 'CS452', 'CS456', 'CS454', 'CS436', 'CS431', 'ELEC_I'],
  },
  {
    id: 'swe',
    title: 'Software Engineering',
    color: '#059669',
    colorLight: '#d1fae5',
    description: 'Build reliable, maintainable software at scale. Design patterns, testing, databases, and the full development lifecycle.',
    skills: ['System Design', 'Databases', 'Testing & QA', 'Software Architecture'],
    icon: '🛠️',
    // CS348 (CS241+MATH136→2B ✓, does NOT need CS246!), CS346+CS338 (CS246→3A),
    // CS349+CS446 (CS350→3B), CS447+CS445 (CS350/CS341→4A)
    electives: ['CS348', 'CS346', 'CS338', 'CS349', 'CS446', 'CS447', 'CS445', 'ELEC_H', 'ELEC_I'],
  },
  {
    id: 'theory',
    title: 'Theory & Algorithms',
    color: '#d97706',
    colorLight: '#fef3c7',
    description: 'Explore the mathematical foundations of computation. Complexity theory, advanced algorithms, and formal methods.',
    skills: ['Complexity Theory', 'Algorithm Design', 'Formal Methods', 'Graph Theory'],
    icon: 'λ',
    // CS330 (MATH239→2B ✓), CS462 (CS240→3A), ELEC_C (3A),
    // CS466+CS487 (CS341→3B), CS430 (CS330+Level≥3A→4A)
    electives: ['CS330', 'CS462', 'ELEC_C', 'CS466', 'CS487', 'CS430', 'ELEC_G', 'ELEC_H', 'ELEC_I'],
  },
  {
    id: 'data',
    title: 'Data Science & Analytics',
    color: '#0891b2',
    colorLight: '#cffafe',
    description: 'Extract insights from large datasets using statistical methods and distributed systems. Blends CS with applied statistics.',
    skills: ['Machine Learning', 'Big Data', 'Statistical Analysis', 'Database Systems'],
    icon: '📊',
    // CS479 (STAT230→2B), CS338 (CS246→3A), ELEC_C (3A),
    // CS480 (Level≥3B), CS431 (CS341+CS251→3B), CS489+CS448 (CS341/CS350→4A)
    electives: ['CS479', 'CS338', 'ELEC_C', 'CS480', 'CS431', 'CS489', 'CS448', 'ELEC_H', 'ELEC_I'],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    color: '#475569',
    colorLight: '#f1f5f9',
    description: 'Protect systems from attacks, implement cryptographic protocols, and build privacy-preserving technology.',
    skills: ['Cryptography', 'Network Security', 'Vulnerability Analysis', 'Privacy Engineering'],
    icon: '🔐',
    // ELEC_A (2B — CS343 needs CS246+CS251 from same term), CS343+CS436 (3A),
    // CS452+CS456 (CS350→3B), CS454 (CS350→4A), CS458 (CS360→4A), CS453 (CS350→4B)
    electives: ['ELEC_A', 'CS343', 'CS436', 'CS452', 'CS456', 'CS454', 'CS458', 'CS453', 'ELEC_I'],
  },
];

// ─── Plan generator ──────────────────────────────────────────────────────────
// Prereq-respecting 8-term plan.
//
// Key correction vs naïve ordering:
//   CS240 MUST be in 2B (not 2A) — it prereqs CS241, CS245, STAT230 which are all in 2A.
//   2A therefore contains CS241, CS245, STAT230, MATH239 (plus a breadth elective).
//
// Term layout:
//   1A  CS135, MATH135, MATH137, CommST, Breadth         (all fixed)
//   1B  CS136, MATH136, MATH138, CommST, Breadth         (all fixed)
//   2A  CS241, CS245, STAT230, MATH239, Breadth          (all fixed)
//   2B  CS240, CS246, CS251, STAT231, path-e[0]
//   3A  CS341, CS350, path-e[1], path-e[2], Breadth
//   3B  CS360, CS365, path-e[3], path-e[4], Breadth
//   4A  path-e[5], path-e[6], CS Elective, Breadth, Free
//   4B  path-e[7], path-e[8], CS Elective, Free, Free

export function generatePlan(path) {
  const e = path.electives; // e[0] … e[8]
  return [
    {
      term: '1A', label: 'First Year — Fall', fixed: true,
      courses: ['CS135', 'MATH135', 'MATH137', 'COMMST_A', 'BREADTH_1'],
    },
    {
      term: '1B', label: 'First Year — Winter', fixed: true,
      courses: ['CS136', 'MATH136', 'MATH138', 'COMMST_B', 'BREADTH_2'],
      note: 'CS136 includes CS136L lab as a corequisite',
    },
    {
      term: '2A', label: 'Second Year — Fall', fixed: true,
      courses: ['CS241', 'CS245', 'STAT230', 'MATH239', 'BREADTH_3'],
      note: 'CS240 is NOT in 2A — it requires CS241, CS245, and STAT230 as prerequisites',
    },
    {
      term: '2B', label: 'Second Year — Winter',
      courses: ['CS240', 'CS246', 'CS251', 'STAT231', e[0]],
    },
    {
      term: '3A', label: 'Third Year — Fall',
      courses: ['CS341', 'CS350', e[1], e[2], 'BREADTH_4'],
    },
    {
      term: '3B', label: 'Third Year — Winter',
      courses: ['CS360', 'CS365', e[3], e[4], 'BREADTH_5'],
    },
    {
      term: '4A', label: 'Fourth Year — Fall',
      courses: [e[5], e[6], 'CS_ELEC_1', 'BREADTH_6', 'FREE_1'],
    },
    {
      term: '4B', label: 'Fourth Year — Winter',
      courses: [e[7], e[8], 'CS_ELEC_2', 'FREE_2', 'FREE_3'],
    },
  ];
}
