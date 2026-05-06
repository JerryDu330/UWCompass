import { generatePrompt } from "./promptGenerator.js";

const requirementsJson = {
  "title": "Computer Science (Bachelor of Computer Science - Honours)",
  "Course Requirements": {
    "type": "AND",
    "items": [
      {
        "title": "Required Courses",
        "type": "AND",
        "items": [
          { "type": "AND", "items": [
            { "type": "COURSE", "code": "CS136L" },
            { "type": "COURSE", "code": "CS341" },
            { "type": "COURSE", "code": "CS350" }
          ]},
          { "type": "OR", "items": [{ "type": "COURSE", "code": "CS115" }, { "type": "COURSE", "code": "CS135" }, { "type": "COURSE", "code": "CS145" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "CS136" }, { "type": "COURSE", "code": "CS146" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "CS240" }, { "type": "COURSE", "code": "CS240E" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "CS241" }, { "type": "COURSE", "code": "CS241E" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "CS245" }, { "type": "COURSE", "code": "CS245E" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "CS246" }, { "type": "COURSE", "code": "CS246E" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "CS251" }, { "type": "COURSE", "code": "CS251E" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "MATH127" }, { "type": "COURSE", "code": "MATH137" }, { "type": "COURSE", "code": "MATH147" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "MATH128" }, { "type": "COURSE", "code": "MATH138" }, { "type": "COURSE", "code": "MATH148" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "MATH135" }, { "type": "COURSE", "code": "MATH145" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "MATH136" }, { "type": "COURSE", "code": "MATH146" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "MATH239" }, { "type": "COURSE", "code": "MATH249" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "STAT230" }, { "type": "COURSE", "code": "STAT240" }], "count": 1 },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "STAT231" }, { "type": "COURSE", "code": "STAT241" }], "count": 1 },
          { "type": "TEXT", "text": "Complete 3 additional CS courses chosen from CS340-CS398, CS440-CS489" },
          { "type": "TEXT", "text": "Complete 2 additional CS courses chosen from CS440-CS489" },
          { "type": "TEXT", "text": "Complete 1 course from: CS440-CS498, or any CS course at the 600- or 700-level" },
          { "type": "OR", "items": [{ "type": "COURSE", "code": "CO487" }, { "type": "COURSE", "code": "CS499T" }, { "type": "COURSE", "code": "STAT440" }], "count": 1 },
          { "type": "TEXT", "text": "Complete 1.0 unit from the Faculty of Arts or subject codes: BET, BUS, COMM, STV" },
          { "type": "TEXT", "text": "Complete 1.0 unit from the Faculties of Environment, Health, or Science" },
          { "type": "TEXT", "text": "Complete 2.0 additional units from Arts, Environment, Health, Science, or BET/BUS/COMM/STV" }
        ]
      }
    ]
  }
};

// Simulates a 2B CS student who has completed first-year + some second-year courses
const courseData = {
  completed:       ["CS135", "CS136", "CS136L", "MATH135", "MATH136", "MATH137", "MATH138"],
  inProgress:      ["CS241", "MATH239", "STAT230"],
  planned:         ["CS245", "CS246", "CS251"],
  requirementsJson,
};

const userInput = {
  program:     "Computer Science",
  standing:    "2B",
  term:        "Winter 2026",
  interests:   "systems programming, compilers",
  career:      "backend software engineer",
  constraints: "co-op in Spring 2026, want to keep workload manageable",
};

console.log(generatePrompt(courseData, userInput));
