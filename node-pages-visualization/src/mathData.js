// ─── Course type colour tokens ───────────────────────────────────────────────
export const MATH_TYPE_COLORS = {
  math:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  pmath:    { bg: '#f5f3ff', text: '#5b21b6', border: '#ddd6fe' },
  co:       { bg: '#fff8e1', text: '#92400e', border: '#fcd34d' },
  amath:    { bg: '#ecfdf5', text: '#065f46', border: '#6ee7b7' },
  cs:       { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  stat:     { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  commst:   { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  breadth:  { bg: '#f9fafb', text: '#6b7280', border: '#d1d5db' },
  elective: { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  free:     { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
};

// ─── All course metadata ─────────────────────────────────────────────────────
export const MATH_COURSE_INFO = {
  // ── 1A (fixed) ──────────────────────────────────────────────────────────────
  MATH135:    { name: 'Algebra',                           type: 'math',   note: 'Proof techniques, number theory, modular arithmetic, complex numbers' },
  MATH137:    { name: 'Calculus 1',                        type: 'math',   note: 'Limits, derivatives, applications of differentiation — prereq: high-school calc' },
  CS115:      { name: 'Introduction to CS 1',              type: 'cs',     note: 'Functional programming in Racket — for non-CS Math students' },
  COMMST_A:   { name: 'Communication (1)',                 type: 'commst', note: 'First communications requirement', placeholder: true, infoList: { heading: 'Communication List I', note: 'At least 60% in one of:', items: ['COMMST 100', 'COMMST 223', 'EMLS 101R', 'EMLS 102R', 'EMLS/ENGL 129R', 'ENGL 109'] } },
  MATH_BRD_1: { name: 'Non-Math Elective',                 type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── 1B (fixed) ──────────────────────────────────────────────────────────────
  MATH136:    { name: 'Linear Algebra 1',                  type: 'math',   note: 'Vectors, matrices, linear systems, determinants — prereq: MATH135' },
  MATH138:    { name: 'Calculus 2',                        type: 'math',   note: 'Integration techniques, sequences and series — prereq: MATH137' },
  CS116:      { name: 'Introduction to CS 2',              type: 'cs',     note: 'Python, higher-order functions, mutation, classes — prereq: CS115' },
  COMMST_B:   { name: 'Communication (2)',                 type: 'commst', note: 'Second communications requirement', placeholder: true, infoList: { heading: 'Communication List II', note: 'One of:', items: ['COMMST 225', 'COMMST 227', 'COMMST 228', 'EMLS 103R', 'EMLS 104R', 'EMLS 110R', 'ENGL 101B', 'ENGL 108B', 'ENGL 108D', 'ENGL 119', 'ENGL 208B', 'ENGL 209', 'ENGL 210E', 'ENGL 210F', 'ENGL 378/MTHEL 300'] } },
  MATH_BRD_2: { name: 'Non-Math Elective',                 type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── 2A (fixed) ──────────────────────────────────────────────────────────────
  MATH235:    { name: 'Linear Algebra 2',                  type: 'math',   note: 'Abstract vector spaces, eigenvalues, diagonalisation — prereq: MATH136' },
  MATH237:    { name: 'Calculus 3',                        type: 'math',   note: 'Multivariable calc, partial derivatives, double/triple integrals — prereq: MATH138' },
  MATH239:    { name: 'Intro to Combinatorics',            type: 'math',   note: 'Graphs, trees, counting, pigeonhole principle — prereq: MATH138' },
  STAT230:    { name: 'Probability',                       type: 'stat',   note: 'Discrete & continuous distributions, expectation, variance — prereq: MATH137' },
  MATH_BRD_3: { name: 'Non-Math Elective',                 type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── 2B (semi-fixed) ─────────────────────────────────────────────────────────
  PMATH333:   { name: 'Intro to Real Analysis 1',          type: 'pmath',  note: 'Sequences, series, continuity, differentiability, Riemann integral — prereq: MATH138' },
  MATH245:    { name: 'Linear Algebra 3',                  type: 'math',   note: 'Spectral theory, Jordan form, inner product spaces — prereq: MATH235' },
  MATH_BRD_4: { name: 'Non-Math Elective',                 type: 'breadth', note: 'Any non-Math course', placeholder: true },
  MATH_BRD_5: { name: 'Non-Math Elective',                 type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── 3A (core) ───────────────────────────────────────────────────────────────
  PMATH334:   { name: 'Intro to Real Analysis 2',          type: 'pmath',  note: 'Uniform convergence, metric spaces, topology of ℝⁿ — prereq: PMATH333' },
  MATH_ELEC_1: { name: 'Math Elective',                    type: 'elective', note: 'Any 300-level PMATH, CO, or AMATH course', placeholder: true },
  MATH_BRD_6: { name: 'Non-Math Elective',                 type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── Path elective courses ────────────────────────────────────────────────────

  // Pure Analysis
  PMATH330:   { name: 'Introduction to Number Theory',     type: 'pmath',  note: 'Primes, congruences, Diophantine equations — prereq: MATH135' },
  PMATH340:   { name: 'Algebra 1',                         type: 'pmath',  note: 'Groups, rings, homomorphisms, quotient structures — prereq: MATH136 + MATH239' },
  PMATH365:   { name: 'Differential Geometry',             type: 'pmath',  note: 'Curves and surfaces in ℝ³, curvature, geodesics — prereq: MATH237' },
  PMATH347:   { name: 'Groups and Rings',                  type: 'pmath',  note: 'Advanced group theory, ring theory, module theory — prereq: PMATH340' },
  PMATH348:   { name: 'Fields and Galois Theory',          type: 'pmath',  note: 'Field extensions, Galois correspondence, solvability — prereq: PMATH347' },
  PMATH440:   { name: 'Analytic Number Theory',            type: 'pmath',  note: 'Riemann zeta function, prime number theorem — prereq: PMATH333' },
  PMATH450:   { name: 'Lebesgue Integration',              type: 'pmath',  note: 'Measure theory, Lebesgue integral, Lᵖ spaces — prereq: PMATH334' },
  PMATH451:   { name: 'Measure Theory',                    type: 'pmath',  note: 'Abstract measures, integration, convergence theorems — prereq: PMATH450' },
  PMATH453:   { name: 'Functional Analysis',               type: 'pmath',  note: 'Banach/Hilbert spaces, bounded operators, spectral theory — prereq: PMATH451' },

  // Combinatorics & Optimization
  CO330:      { name: 'Combinatorial Enumeration',         type: 'co',     note: 'Generating functions, formal power series, counting — prereq: MATH239' },
  CO342:      { name: 'Introduction to Graph Theory',      type: 'co',     note: 'Trees, planarity, colouring, network flows — prereq: MATH239' },
  CO430:      { name: 'Algebraic Combinatorics',           type: 'co',     note: 'Symmetry, posets, Young tableaux — prereq: CO330' },
  CO450:      { name: 'Combinatorial Optimization',        type: 'co',     note: 'Matchings, flows, network algorithms — prereq: MATH239 + MATH235' },
  CO452:      { name: 'Integer Programming',               type: 'co',     note: 'Branch-and-bound, cutting planes, LP relaxations — prereq: CO450' },
  CO454:      { name: 'Scheduling',                        type: 'co',     note: 'Scheduling theory, complexity, approximation algorithms — prereq: CO450' },
  CO487:      { name: 'Applied Cryptography',              type: 'co',     note: 'RSA, elliptic curves, protocols — prereq: MATH135 + MATH235' },

  // Applied Mathematics
  AMATH231:   { name: 'Calculus 4',                        type: 'amath',  note: 'Vector calculus, line/surface integrals, Stokes & Green theorems — prereq: MATH237' },
  AMATH250:   { name: 'Intro to Differential Equations',   type: 'amath',  note: 'First and second order ODEs, systems, Laplace transforms — prereq: MATH138' },
  AMATH351:   { name: 'Ordinary Differential Equations 2', type: 'amath',  note: 'Series solutions, Sturm-Liouville, stability — prereq: AMATH250' },
  AMATH353:   { name: 'Partial Differential Equations 1',  type: 'amath',  note: 'Heat, wave, and Laplace equations; separation of variables — prereq: AMATH250' },
  AMATH455:   { name: 'Control Theory',                    type: 'amath',  note: 'Optimal control, Pontryagin maximum principle, dynamic programming — prereq: AMATH351' },

  // Placeholders
  MATH_ELEC_2: { name: 'Math Elective',                    type: 'elective', note: 'Any 300–400-level PMATH, CO, AMATH, or related course', placeholder: true },
  MATH_ELEC_3: { name: 'Math Elective',                    type: 'elective', note: 'Any 300–400-level PMATH, CO, AMATH, or related course', placeholder: true },
  MATH_ELEC_4: { name: 'Math Elective',                    type: 'elective', note: 'Any 300–400-level PMATH, CO, AMATH, or related course', placeholder: true },
  MATH_ELEC_5: { name: 'Math Elective',                    type: 'elective', note: 'Any 300–400-level PMATH, CO, AMATH, or related course', placeholder: true },
  PMATH_ELEC_A: { name: 'PMATH Elective',                  type: 'elective', note: 'Any 400-level PMATH course', placeholder: true },
  PMATH_ELEC_B: { name: 'PMATH Elective',                  type: 'elective', note: 'Any 400-level PMATH course', placeholder: true },
  PMATH_ELEC_C: { name: 'PMATH Elective',                  type: 'elective', note: 'Any 400-level PMATH course', placeholder: true },
  AMATH_ELEC_A: { name: 'AMATH Elective',                  type: 'elective', note: 'Any 400-level AMATH course', placeholder: true },
  AMATH_ELEC_B: { name: 'AMATH Elective',                  type: 'elective', note: 'Any 400-level AMATH course', placeholder: true },
  CO_ELEC_1:    { name: 'CO Elective',                     type: 'elective', note: 'Any 400-level CO course', placeholder: true },
  MATH_FREE_1:  { name: 'Free Elective',                   type: 'free',     note: 'Any course from any faculty', placeholder: true },
  MATH_FREE_2:  { name: 'Free Elective',                   type: 'free',     note: 'Any course from any faculty', placeholder: true },
  MATH_FREE_3:  { name: 'Free Elective',                   type: 'free',     note: 'Any course from any faculty', placeholder: true },
  MATH_FREE_4:  { name: 'Free Elective',                   type: 'free',     note: 'Any course from any faculty', placeholder: true },
  MATH_FREE_5:  { name: 'Free Elective',                   type: 'free',     note: 'Any course from any faculty', placeholder: true },

  // Cross-path path-specific placeholders (unique keys within each path)
  PATH_ELEC_A:  { name: 'Path Elective',                   type: 'elective', note: 'Choose any appropriate elective for this path', placeholder: true },
  PATH_ELEC_B:  { name: 'Path Elective',                   type: 'elective', note: 'Choose any appropriate elective for this path', placeholder: true },
  PATH_ELEC_C:  { name: 'Path Elective',                   type: 'elective', note: 'Choose any appropriate elective for this path', placeholder: true },
};

// ─── Career paths ─────────────────────────────────────────────────────────────
// Plan: 1A–2A fixed, 2B has 2 fixed + e[0] + 2 breadth,
// 3A: PMATH334 + e[1] + e[2] + Math Elec + Breadth,
// 3B: e[3] + e[4] + e[5] + Math Elec + Free,
// 4A: e[6] + e[7] + Math Elec + Free + Free,
// 4B: e[8] + Math Elec + Math Elec + Free + Free
// Elective slots: e[0]=2B, e[1..2]=3A, e[3..5]=3B, e[6..7]=4A, e[8]=4B
export const MATH_CAREER_PATHS = [
  {
    id: 'analysis',
    title: 'Pure Analysis',
    color: '#5b21b6',
    colorLight: '#f5f3ff',
    description: 'Explore rigorous mathematical analysis — convergence, measure theory, Banach & Hilbert spaces, and the foundations of calculus.',
    skills: ['Real Analysis', 'Measure Theory', 'Functional Analysis', 'Number Theory'],
    icon: 'ε',
    // e[0]=PMATH330 (2B, prereq MATH135 ✓)
    // e[1]=PMATH340 (3A, prereq MATH136+MATH239 ✓), e[2]=PMATH365 (3A, prereq MATH237 ✓)
    // e[3]=PMATH347 (3B, prereq PMATH340 done 3A ✓), e[4]=PMATH440 (3B, prereq PMATH333 done 2B ✓), e[5]=PMATH_ELEC_A
    // e[6]=PMATH450 (4A, prereq PMATH334 done 3A ✓), e[7]=PMATH_ELEC_B
    // e[8]=PMATH451 (4B, prereq PMATH450 done 4A ✓)
    electives: ['PMATH330', 'PMATH340', 'PMATH365', 'PMATH347', 'PMATH440', 'PMATH_ELEC_A', 'PMATH450', 'PMATH_ELEC_B', 'PMATH451'],
  },
  {
    id: 'algebra',
    title: 'Abstract Algebra',
    color: '#be123c',
    colorLight: '#fff1f2',
    description: 'Delve into the structure of mathematical objects — groups, rings, fields, and Galois theory.',
    skills: ['Group Theory', 'Ring Theory', 'Galois Theory', 'Algebraic Structures'],
    icon: 'G',
    // e[0]=PMATH330 (2B ✓)
    // e[1]=PMATH340 (3A ✓), e[2]=PATH_ELEC_A
    // e[3]=PMATH347 (3B, prereq PMATH340 ✓), e[4]=PMATH440 (3B, prereq PMATH333 ✓), e[5]=PMATH_ELEC_A
    // e[6]=PMATH348 (4A, prereq PMATH347 done 3B ✓), e[7]=PMATH_ELEC_B
    // e[8]=PMATH_ELEC_C
    electives: ['PMATH330', 'PMATH340', 'PATH_ELEC_A', 'PMATH347', 'PMATH440', 'PMATH_ELEC_A', 'PMATH348', 'PMATH_ELEC_B', 'PMATH_ELEC_C'],
  },
  {
    id: 'co',
    title: 'Combinatorics & Optimization',
    color: '#b45309',
    colorLight: '#fff8e1',
    description: 'Count structures, optimise over graphs and networks, and study the mathematics behind algorithms and scheduling.',
    skills: ['Graph Theory', 'Combinatorial Optimization', 'Integer Programming', 'Algebraic Combinatorics'],
    icon: '⬡',
    // e[0]=CO330 (2B, prereq MATH239 done 2A ✓)
    // e[1]=CO342 (3A, prereq MATH239 ✓), e[2]=PATH_ELEC_A
    // e[3]=CO430 (3B, prereq CO330 done 2B ✓), e[4]=CO450 (3B, prereq MATH239+MATH235 ✓), e[5]=PATH_ELEC_B
    // e[6]=CO452 (4A, prereq CO450 done 3B ✓), e[7]=CO454 (4A, prereq CO450 ✓)
    // e[8]=CO487 (4B)
    electives: ['CO330', 'CO342', 'PATH_ELEC_A', 'CO430', 'CO450', 'PATH_ELEC_B', 'CO452', 'CO454', 'CO487'],
  },
  {
    id: 'applied',
    title: 'Applied Mathematics',
    color: '#0891b2',
    colorLight: '#cffafe',
    description: 'Model the physical world with differential equations, vector calculus, and control theory.',
    skills: ['ODEs & PDEs', 'Vector Calculus', 'Mathematical Modelling', 'Control Theory'],
    icon: '∇',
    // e[0]=AMATH231 (2B, prereq MATH237 done 2A ✓)
    // e[1]=AMATH250 (3A, prereq MATH138 done 1B ✓), e[2]=PATH_ELEC_A
    // e[3]=AMATH351 (3B, prereq AMATH250 done 3A ✓), e[4]=AMATH353 (3B, prereq AMATH250 ✓), e[5]=PATH_ELEC_B
    // e[6]=AMATH455 (4A, prereq AMATH351 done 3B ✓), e[7]=AMATH_ELEC_A
    // e[8]=AMATH_ELEC_B
    electives: ['AMATH231', 'AMATH250', 'PATH_ELEC_A', 'AMATH351', 'AMATH353', 'PATH_ELEC_B', 'AMATH455', 'AMATH_ELEC_A', 'AMATH_ELEC_B'],
  },
];

// ─── Plan generator ──────────────────────────────────────────────────────────
// 1A–2A: fixed
// 2B: PMATH333 + MATH245 + e[0] + 2 breadth (5 courses)
// 3A: PMATH334 + e[1] + e[2] + Math Elec + Breadth (5 courses)
// 3B: e[3] + e[4] + e[5] + Math Elec + Free (5 courses)
// 4A: e[6] + e[7] + Math Elec + Free + Free (5 courses)
// 4B: e[8] + Math Elec + Math Elec + Free + Free (5 courses)
export function generateMathPlan(path) {
  const e = path.electives;
  return [
    {
      term: '1A', label: 'First Year — Fall', fixed: true,
      courses: ['MATH135', 'MATH137', 'CS115', 'COMMST_A', 'MATH_BRD_1'],
    },
    {
      term: '1B', label: 'First Year — Winter', fixed: true,
      courses: ['MATH136', 'MATH138', 'CS116', 'COMMST_B', 'MATH_BRD_2'],
    },
    {
      term: '2A', label: 'Second Year — Fall', fixed: true,
      courses: ['MATH235', 'MATH237', 'MATH239', 'STAT230', 'MATH_BRD_3'],
    },
    {
      term: '2B', label: 'Second Year — Winter',
      courses: ['PMATH333', 'MATH245', e[0], 'MATH_BRD_4', 'MATH_BRD_5'],
    },
    {
      term: '3A', label: 'Third Year — Fall',
      courses: ['PMATH334', e[1], e[2], 'MATH_ELEC_1', 'MATH_BRD_6'],
    },
    {
      term: '3B', label: 'Third Year — Winter',
      courses: [e[3], e[4], e[5], 'MATH_ELEC_2', 'MATH_FREE_1'],
    },
    {
      term: '4A', label: 'Fourth Year — Fall',
      courses: [e[6], e[7], 'MATH_ELEC_3', 'MATH_FREE_2', 'MATH_FREE_3'],
    },
    {
      term: '4B', label: 'Fourth Year — Winter',
      courses: [e[8], 'MATH_ELEC_4', 'MATH_ELEC_5', 'MATH_FREE_4', 'MATH_FREE_5'],
    },
  ];
}

// ─── Program config (consumed by ProgramPlanner) ─────────────────────────────
export const MATH_PROGRAM_CONFIG = {
  id: 'math',
  shortTitle: 'Pure Mathematics',
  badge: 'Pure Math Honours · Degree Planner',
  heroTitle: 'Build Your Pure Math Roadmap',
  heroDesc:
    'Choose a specialisation to generate a personalised 8-term plan built on the UW Pure Mathematics Honours degree. Analysis, algebra, combinatorics, or applied mathematics — click any course chip to mark it complete.',
  calendarUrl: 'https://ugradcalendar.uwaterloo.ca/page/MATH-Pure-Mathematics',
  calendarLabel: 'UW Pure Mathematics calendar',
  courseInfo: MATH_COURSE_INFO,
  typeColors: MATH_TYPE_COLORS,
  legend: [
    ['math',     'MATH Course'],
    ['pmath',    'PMATH Course'],
    ['co',       'CO Course'],
    ['amath',    'AMATH Course'],
    ['cs',       'CS Course'],
    ['stat',     'STAT Course'],
    ['commst',   'Communication'],
    ['breadth',  'Non-Math Elective'],
    ['elective', 'Math Elective'],
    ['free',     'Free Elective'],
  ],
  paths: MATH_CAREER_PATHS,
  generatePlan: generateMathPlan,
};
