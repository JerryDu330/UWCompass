export const STAT_TYPE_COLORS = {
  math:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  stat:     { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  cs:       { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  commst:   { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  breadth:  { bg: '#f9fafb', text: '#6b7280', border: '#d1d5db' },
  elective: { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  free:     { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
};

export const STAT_COURSE_INFO = {
  // ── 1A (fixed) ──────────────────────────────────────────────────────────────
  MATH135:     { name: 'Algebra',                          type: 'math',   note: 'Proof techniques, number theory, modular arithmetic' },
  MATH137:     { name: 'Calculus 1',                       type: 'math',   note: 'Limits, derivatives, applications of differentiation' },
  CS115:       { name: 'Introduction to CS 1',             type: 'cs',     note: 'Functional programming in Racket — for non-CS Math students' },
  S_COMMST_A:  { name: 'Communication (1)',                type: 'commst', note: 'First communications requirement', placeholder: true, infoList: { heading: 'Communication List I', note: 'At least 60% in one of:', items: ['COMMST 100', 'COMMST 223', 'EMLS 101R', 'EMLS 102R', 'EMLS/ENGL 129R', 'ENGL 109'] } },
  S_BRD_1:     { name: 'Non-Math Elective',                type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── 1B (fixed) ──────────────────────────────────────────────────────────────
  MATH136:     { name: 'Linear Algebra 1',                 type: 'math',   note: 'Vectors, matrices, linear systems — prereq: MATH135' },
  MATH138:     { name: 'Calculus 2',                       type: 'math',   note: 'Integration, sequences and series — prereq: MATH137' },
  CS116:       { name: 'Introduction to CS 2',             type: 'cs',     note: 'Python, higher-order functions, mutation — prereq: CS115' },
  S_COMMST_B:  { name: 'Communication (2)',                type: 'commst', note: 'Second communications requirement', placeholder: true, infoList: { heading: 'Communication List II', note: 'One of:', items: ['COMMST 225', 'COMMST 227', 'COMMST 228', 'EMLS 103R', 'EMLS 104R', 'EMLS 110R', 'ENGL 101B', 'ENGL 108B', 'ENGL 108D', 'ENGL 119', 'ENGL 208B', 'ENGL 209', 'ENGL 210E', 'ENGL 210F', 'ENGL 378/MTHEL 300'] } },
  S_BRD_2:     { name: 'Non-Math Elective',                type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── 2A (fixed) ──────────────────────────────────────────────────────────────
  MATH235:     { name: 'Linear Algebra 2',                 type: 'math',   note: 'Abstract vector spaces, eigenvalues — prereq: MATH136' },
  MATH237:     { name: 'Calculus 3',                       type: 'math',   note: 'Multivariable calculus, partial derivatives — prereq: MATH138' },
  STAT230:     { name: 'Probability',                      type: 'stat',   note: 'Discrete & continuous distributions, expectation, variance — prereq: MATH137' },
  S_BRD_3:     { name: 'Non-Math Elective',                type: 'breadth', note: 'Any non-Math course', placeholder: true },
  S_BRD_4:     { name: 'Non-Math Elective',                type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── 2B (semi-fixed) ─────────────────────────────────────────────────────────
  STAT231:     { name: 'Statistics',                       type: 'stat',   note: 'Estimation, hypothesis testing, confidence intervals — prereq: MATH138 + STAT230' },
  STAT333:     { name: 'Applied Probability',              type: 'stat',   note: 'Markov chains, Poisson processes, queuing — prereq: STAT230' },
  S_BRD_5:     { name: 'Non-Math Elective',                type: 'breadth', note: 'Any non-Math course', placeholder: true },
  S_BRD_6:     { name: 'Non-Math Elective',                type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── 3A (fixed core) ─────────────────────────────────────────────────────────
  STAT330:     { name: 'Mathematical Statistics',          type: 'stat',   note: 'Likelihood, sufficiency, Bayesian inference — prereq: STAT231' },
  STAT331:     { name: 'Applied Linear Models',            type: 'stat',   note: 'Regression, ANOVA, model selection — prereq: STAT231 + MATH235' },
  STAT332:     { name: 'Sampling and Experimental Design', type: 'stat',   note: 'Survey sampling, randomised experiments — prereq: STAT231' },
  S_BRD_7:     { name: 'Non-Math Elective',                type: 'breadth', note: 'Any non-Math course', placeholder: true },

  // ── Career electives — Data Science & ML ─────────────────────────────────────
  STAT435:     { name: 'Statistical Learning',             type: 'stat',   note: 'Regularisation, trees, SVMs, model evaluation — prereq: STAT331' },
  STAT440:     { name: 'Computational Statistics',         type: 'stat',   note: 'MCMC, bootstrap, EM algorithm — prereq: STAT230' },
  STAT443:     { name: 'Forecasting',                      type: 'stat',   note: 'Time series, ARIMA, exponential smoothing — prereq: STAT331' },
  STAT444:     { name: 'Statistical Learning 2',           type: 'stat',   note: 'Deep learning, neural networks, unsupervised methods — prereq: STAT435' },
  CS480:       { name: 'Introduction to Machine Learning', type: 'cs',     note: 'Supervised/unsupervised learning, model selection — prereq: Level ≥ 3B' },

  // ── Career electives — Biostatistics ─────────────────────────────────────────
  STAT430:     { name: 'Experimental Design',              type: 'stat',   note: 'Factorial designs, blocking, response surface methods — prereq: STAT331' },
  STAT431:     { name: 'Applied Biostatistics',            type: 'stat',   note: 'Clinical trials, survival analysis, epidemiology — prereq: STAT331' },
  STAT432:     { name: 'Stochastic Processes',             type: 'stat',   note: 'Renewal theory, Brownian motion, diffusion — prereq: STAT333' },
  STAT454:     { name: 'Sampling Theory',                  type: 'stat',   note: 'Design-based inference, complex surveys — prereq: STAT332' },

  // ── Career electives — Financial Statistics ──────────────────────────────────
  STAT334:     { name: 'Statistics for Finance',           type: 'stat',   note: 'Financial models, risk measures, portfolio theory — prereq: STAT231' },
  STAT450:     { name: 'Estimation and Hypothesis Testing', type: 'stat',  note: 'Advanced theory of estimation, UMP tests — prereq: STAT330' },

  // ── Career electives — Mathematical Statistics ───────────────────────────────
  STAT433:     { name: 'Advanced Probability',             type: 'stat',   note: 'Convergence of random variables, CLT, LIL — prereq: STAT333' },

  // ── Placeholders ────────────────────────────────────────────────────────────
  S_ELEC_1:    { name: 'Stats Elective',   type: 'elective', note: 'Any 400-level STAT course', placeholder: true },
  S_ELEC_2:    { name: 'Stats Elective',   type: 'elective', note: 'Any 400-level STAT course', placeholder: true },
  S_ELEC_3:    { name: 'Stats Elective',   type: 'elective', note: 'Any 400-level STAT course', placeholder: true },
  S_FREE_1:    { name: 'Free Elective',    type: 'free',     note: 'Any course from any faculty', placeholder: true },
  S_FREE_2:    { name: 'Free Elective',    type: 'free',     note: 'Any course from any faculty', placeholder: true },
  S_FREE_3:    { name: 'Free Elective',    type: 'free',     note: 'Any course from any faculty', placeholder: true },
  S_FREE_4:    { name: 'Free Elective',    type: 'free',     note: 'Any course from any faculty', placeholder: true },
  S_PATH_A:    { name: 'Path Elective',    type: 'elective', note: 'Choose an elective for your path', placeholder: true },
  S_PATH_B:    { name: 'Path Elective',    type: 'elective', note: 'Choose an elective for your path', placeholder: true },
  S_PATH_C:    { name: 'Path Elective',    type: 'elective', note: 'Choose an elective for your path', placeholder: true },
  S_PATH_D:    { name: 'Path Elective',    type: 'elective', note: 'Choose an elective for your path', placeholder: true },
};

// e[0] = 2B, e[1..2] = 3A, e[3..5] = 3B, e[6..7] = 4A, e[8] = 4B
export const STAT_CAREER_PATHS = [
  {
    id: 'datascience',
    title: 'Data Science & ML',
    color: '#0891b2',
    colorLight: '#cffafe',
    description: 'Apply statistical learning, time-series analysis, and machine learning to extract insights from data.',
    skills: ['Statistical Learning', 'Machine Learning', 'Time Series', 'Computational Stats'],
    icon: '📊',
    // e[0]=S_PATH_A(2B), e[1]=STAT435(3A prereq STAT331 3A - but STAT331 is also in 3A!)
    // Hmm, STAT435 prereq STAT331. If both are in 3A, STAT435 can't use STAT331's results.
    // Let's put STAT435 in 3B instead.
    // e[1]=S_PATH_A(3A), e[2]=STAT440(3A prereq STAT230 done 2A ✓)
    // e[3]=STAT435(3B, prereq STAT331 done 3A ✓), e[4]=STAT443(3B), e[5]=S_PATH_B
    // e[6]=STAT444(4A, prereq STAT435 done 3B ✓), e[7]=CS480(4A, Level≥3B ✓)
    // e[8]=S_PATH_C(4B)
    electives: ['S_PATH_A', 'S_PATH_B', 'STAT440', 'STAT435', 'STAT443', 'S_PATH_C', 'STAT444', 'CS480', 'S_PATH_D'],
  },
  {
    id: 'biostatistics',
    title: 'Biostatistics',
    color: '#059669',
    colorLight: '#d1fae5',
    description: 'Design clinical trials, analyse health data, and apply statistical methods to medicine and epidemiology.',
    skills: ['Clinical Trials', 'Survival Analysis', 'Sampling Theory', 'Experimental Design'],
    icon: '🧬',
    // e[0]=S_PATH_A(2B), e[1]=S_PATH_B(3A), e[2]=S_PATH_C(3A)
    // e[3]=STAT430(3B, prereq STAT331 done 3A ✓), e[4]=STAT431(3B, prereq STAT331 ✓)
    // e[5]=STAT432(3B, prereq STAT333 done 2B ✓)
    // e[6]=STAT454(4A, prereq STAT332 done 3A ✓), e[7]=S_PATH_D(4A)
    // e[8]=S_PATH_D... wait, S_PATH_D used twice!
    // Fix: e[7]=STAT450(4A), e[8]=S_PATH_D(4B)
    electives: ['S_PATH_A', 'S_PATH_B', 'S_PATH_C', 'STAT430', 'STAT431', 'STAT432', 'STAT454', 'STAT450', 'S_PATH_D'],
  },
  {
    id: 'financial',
    title: 'Financial Statistics',
    color: '#7c3aed',
    colorLight: '#ede9fe',
    description: 'Model financial risk, price derivatives, and apply statistical inference to quantitative finance.',
    skills: ['Financial Models', 'Risk Analysis', 'Time Series', 'Advanced Inference'],
    icon: '📈',
    // e[0]=STAT334(2B, prereq STAT231 done 2B - can be concurrent? prereq is just STAT231)
    // Actually STAT334 prereq is STAT231, but both are in 2B. That's a conflict.
    // Move STAT334 to 3B: e[0]=S_PATH_A(2B)
    // e[1]=STAT443(3A, prereq STAT331... wait STAT331 is also in 3A)
    // prereq STAT231 done 2B ✓ for STAT443? Let me check: STAT443 prereq is STAT331.
    // If STAT331 is core in 3A, STAT443 must be 3B or later.
    // e[1]=S_PATH_A(3A), e[2]=STAT440(3A prereq STAT230 2A ✓)
    // e[3]=STAT334(3B, prereq STAT231 done 2B ✓), e[4]=STAT443(3B, prereq STAT331 done 3A ✓)
    // e[5]=STAT432(3B, prereq STAT333 done 2B ✓)
    // e[6]=STAT450(4A, prereq STAT330 done 3A ✓), e[7]=S_PATH_B(4A)
    // e[8]=S_PATH_C(4B)
    electives: ['S_PATH_A', 'S_PATH_B', 'STAT440', 'STAT334', 'STAT443', 'STAT432', 'STAT450', 'S_PATH_C', 'S_PATH_D'],
  },
  {
    id: 'probability',
    title: 'Probability Theory',
    color: '#b45309',
    colorLight: '#fff8e1',
    description: 'Dive deep into measure-theoretic probability, stochastic processes, and the mathematical foundations of statistics.',
    skills: ['Stochastic Processes', 'Advanced Probability', 'Measure Theory', 'Mathematical Statistics'],
    icon: 'P',
    // e[0]=S_PATH_A(2B), e[1]=S_PATH_B(3A), e[2]=S_PATH_C(3A)
    // e[3]=STAT432(3B, prereq STAT333 done 2B ✓), e[4]=STAT433(3B, prereq STAT333 ✓)
    // e[5]=STAT435(3B, prereq STAT331 done 3A ✓)
    // e[6]=STAT450(4A, prereq STAT330 done 3A ✓), e[7]=STAT444(4A, prereq STAT435 done 3B ✓)
    // e[8]=S_PATH_D(4B)
    electives: ['S_PATH_A', 'S_PATH_B', 'S_PATH_C', 'STAT432', 'STAT433', 'STAT435', 'STAT450', 'STAT444', 'S_PATH_D'],
  },
];

export function generateStatPlan(path) {
  const e = path.electives;
  return [
    {
      term: '1A', label: 'First Year — Fall', fixed: true,
      courses: ['MATH135', 'MATH137', 'CS115', 'S_COMMST_A', 'S_BRD_1'],
    },
    {
      term: '1B', label: 'First Year — Winter', fixed: true,
      courses: ['MATH136', 'MATH138', 'CS116', 'S_COMMST_B', 'S_BRD_2'],
    },
    {
      term: '2A', label: 'Second Year — Fall', fixed: true,
      courses: ['MATH235', 'MATH237', 'STAT230', 'S_BRD_3', 'S_BRD_4'],
    },
    {
      term: '2B', label: 'Second Year — Winter',
      courses: ['STAT231', 'STAT333', e[0], 'S_BRD_5', 'S_BRD_6'],
    },
    {
      term: '3A', label: 'Third Year — Fall',
      courses: ['STAT330', 'STAT331', 'STAT332', e[1], e[2]],
      note: 'STAT330, 331, and 332 form the core upper-year statistics sequence',
    },
    {
      term: '3B', label: 'Third Year — Winter',
      courses: [e[3], e[4], e[5], 'S_ELEC_1', 'S_BRD_7'],
    },
    {
      term: '4A', label: 'Fourth Year — Fall',
      courses: [e[6], e[7], 'S_ELEC_2', 'S_FREE_1', 'S_FREE_2'],
    },
    {
      term: '4B', label: 'Fourth Year — Winter',
      courses: [e[8], 'S_ELEC_3', 'S_FREE_3', 'S_FREE_4'],
    },
  ];
}

export const STAT_PROGRAM_CONFIG = {
  id: 'stat',
  shortTitle: 'Statistics',
  badge: 'Statistics Honours · Degree Planner',
  heroTitle: 'Build Your Statistics Roadmap',
  heroDesc:
    'Choose a career path to generate a personalised 8-term plan built on the UW Statistics Honours degree. From data science to biostatistics and financial modelling — click any course to mark it complete.',
  calendarUrl: 'https://ugradcalendar.uwaterloo.ca/page/MATH-Statistics',
  calendarLabel: 'UW Statistics calendar',
  courseInfo: STAT_COURSE_INFO,
  typeColors: STAT_TYPE_COLORS,
  legend: [
    ['stat',     'STAT Course'],
    ['math',     'MATH Course'],
    ['cs',       'CS Course'],
    ['commst',   'Communication'],
    ['breadth',  'Non-Math Elective'],
    ['elective', 'Elective'],
    ['free',     'Free Elective'],
  ],
  paths: STAT_CAREER_PATHS,
  generatePlan: generateStatPlan,
};
