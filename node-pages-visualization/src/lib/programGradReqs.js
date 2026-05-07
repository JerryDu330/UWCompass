// Graduation requirement trees per program, consumed by promptGenerator / gradRequirements.
// Structure mirrors the JSON from feature/advisor_prompt.
// CS is fully specified; other programs have their core required courses only.

const COURSE = (code) => ({ type: 'COURSE', code });
const OR  = (items, count = 1) => ({ type: 'OR',  items, count });
const AND = (items, title)     => title ? { type: 'AND', items, title } : { type: 'AND', items };
const TEXT = (text) => ({ type: 'TEXT', text });

export const CS_GRAD_REQS = {
  title: 'Computer Science (BCS — Honours)',
  'Course Requirements': AND([
    AND([
      AND([COURSE('CS136L'), COURSE('CS341'), COURSE('CS350')]),
      OR([COURSE('CS115'), COURSE('CS135'), COURSE('CS145')]),
      OR([COURSE('CS136'), COURSE('CS146')]),
      OR([COURSE('CS240'), COURSE('CS240E')]),
      OR([COURSE('CS241'), COURSE('CS241E')]),
      OR([COURSE('CS245'), COURSE('CS245E')]),
      OR([COURSE('CS246'), COURSE('CS246E')]),
      OR([COURSE('CS251'), COURSE('CS251E')]),
      OR([COURSE('MATH127'), COURSE('MATH137'), COURSE('MATH147')]),
      OR([COURSE('MATH128'), COURSE('MATH138'), COURSE('MATH148')]),
      OR([COURSE('MATH135'), COURSE('MATH145')]),
      OR([COURSE('MATH136'), COURSE('MATH146')]),
      OR([COURSE('MATH239'), COURSE('MATH249')]),
      OR([COURSE('STAT230'), COURSE('STAT240')]),
      OR([COURSE('STAT231'), COURSE('STAT241')]),
      TEXT('Complete 3 additional CS courses from CS340–CS398, CS440–CS489'),
      TEXT('Complete 2 additional CS courses from CS440–CS489'),
      TEXT('Complete 1 course from CS440–CS498, or any CS 600/700-level'),
      OR([COURSE('CO487'), COURSE('CS499T'), COURSE('STAT440')]),
      TEXT('Complete 1.0 unit from the Faculty of Arts or BET/BUS/COMM/STV'),
      TEXT('Complete 1.0 unit from the Faculties of Environment, Health, or Science'),
      TEXT('Complete 2.0 additional units from Arts, Environment, Health, Science, or BET/BUS/COMM/STV'),
    ], 'Required Courses'),
  ]),
};

export const SE_GRAD_REQS = {
  title: 'Software Engineering (BSE — Honours)',
  'Course Requirements': AND([
    AND([
      COURSE('SE101'), COURSE('SE102'),
      COURSE('ECE105'), COURSE('ECE106'),
      COURSE('ECE124'), COURSE('ECE140'),
      COURSE('CS137'), COURSE('CS138'),
      COURSE('MATH115'), COURSE('MATH117'), COURSE('MATH119'),
      COURSE('SE212'),
      COURSE('CS241'), COURSE('CS247'),
      COURSE('ECE222'), COURSE('SE350'), COURSE('SE465'), COURSE('SE464'),
      COURSE('CS341'), COURSE('CS348'),
      TEXT('Complete SE 4th-year design project (SE491/SE492)'),
      TEXT('Complete 5 SE technical electives'),
      TEXT('Complete 4 non-technical electives'),
    ], 'Required Courses'),
  ]),
};

export const MATH_GRAD_REQS = {
  title: 'Pure Mathematics (BMath — Honours)',
  'Course Requirements': AND([
    AND([
      COURSE('MATH135'), COURSE('MATH136'), COURSE('MATH137'), COURSE('MATH138'),
      COURSE('MATH235'), COURSE('MATH237'), COURSE('MATH239'),
      COURSE('STAT230'),
      COURSE('PMATH333'), COURSE('PMATH334'), COURSE('PMATH336'), COURSE('PMATH345'),
      TEXT('Complete 4 PMATH courses at the 400 level'),
      TEXT('Complete 1 additional MATH/PMATH elective'),
      TEXT('Complete 1.0 unit in Communication Skills (CSK)'),
    ], 'Required Courses'),
  ]),
};

export const STAT_GRAD_REQS = {
  title: 'Statistics (BMath — Honours)',
  'Course Requirements': AND([
    AND([
      COURSE('MATH135'), COURSE('MATH136'), COURSE('MATH137'), COURSE('MATH138'),
      COURSE('MATH235'), COURSE('MATH237'), COURSE('MATH239'),
      COURSE('STAT230'), COURSE('STAT231'), COURSE('STAT232'),
      COURSE('STAT330'), COURSE('STAT331'), COURSE('STAT332'), COURSE('STAT333'),
      COURSE('STAT334'), COURSE('STAT371'),
      TEXT('Complete 2 additional STAT courses at the 400 level'),
      TEXT('Complete 1.0 unit in Communication Skills (CSK)'),
    ], 'Required Courses'),
  ]),
};

export const ECE_GRAD_REQS = {
  title: 'Electrical & Computer Engineering (BASc — Honours)',
  'Course Requirements': AND([
    AND([
      COURSE('ECE105'), COURSE('ECE106'),
      COURSE('ECE124'), COURSE('ECE140'), COURSE('ECE150'),
      COURSE('MATH115'), COURSE('MATH117'), COURSE('MATH119'), COURSE('MATH213'),
      COURSE('ECE222'), COURSE('ECE240'), COURSE('ECE250'),
      COURSE('ECE316'), COURSE('ECE318'), COURSE('ECE320'),
      COURSE('ECE342'), COURSE('ECE380'),
      TEXT('Complete ECE 4th-year design project (ECE499 or FYDP)'),
      TEXT('Complete ECE Technical Electives per chosen option'),
      TEXT('Complete 1 Complementary Studies elective'),
    ], 'Required Courses'),
  ]),
};

export const PROGRAM_GRAD_REQS = {
  cs:   CS_GRAD_REQS,
  se:   SE_GRAD_REQS,
  math: MATH_GRAD_REQS,
  stat: STAT_GRAD_REQS,
  ece:  ECE_GRAD_REQS,
};

export const PROGRAM_LABELS = {
  cs:   'Computer Science',
  se:   'Software Engineering',
  math: 'Pure Mathematics',
  stat: 'Statistics',
  ece:  'Electrical & Computer Engineering',
};
