import { formatGradRequirements } from "./gradRequirements.js";

/**
 * Generates a course planning prompt to copy into an AI chatbot.
 *
 * @param {Object}   courseData - Populated by the UWCompass frontend
 * @param {string[]} courseData.completed           - Courses already taken
 * @param {string[]} courseData.inProgress          - Courses currently enrolled in
 * @param {string[]} courseData.planned             - Courses the student is considering next
 * @param {Object}   [courseData.requirementsJson]  - Full program requirements JSON
 *
 * @param {Object} userInput - Filled in by the user on the form
 * @param {string} userInput.program       - e.g. "Computer Science"
 * @param {string} userInput.standing      - e.g. "2A"
 * @param {string} userInput.term          - e.g. "Fall 2025"
 * @param {string} [userInput.interests]   - e.g. "machine learning, systems"
 * @param {string} [userInput.career]      - e.g. "software engineer at a startup"
 * @param {string} [userInput.constraints] - e.g. "co-op next term, max 5 courses"
 * @param {string} [userInput.extra]       - Any other context
 *
 * @returns {string} The generated prompt
 */
export function generatePrompt(courseData, userInput) {
  const { completed = [], inProgress = [], planned = [], requirementsJson } = courseData;
  const { program, standing, term, interests, career, constraints, extra } = userInput;

  const lines = [
    "I am a University of Waterloo student and I need help planning my full degree path.",
    "",
    `Program: ${program}`,
    `Current academic standing: ${standing}`,
    `Upcoming term: ${term}`,
  ];

  if (completed.length)  lines.push(`Courses completed: ${completed.join(", ")}`);
  if (inProgress.length) lines.push(`Currently enrolled in: ${inProgress.join(", ")}`);
  if (planned.length)    lines.push(`Courses I am considering taking (not term-specific): ${planned.join(", ")}`);

  if (requirementsJson) {
    const unmet = formatGradRequirements(requirementsJson, completed, inProgress);
    if (unmet) {
      lines.push("", "Graduation requirements I still need to fulfill:");
      lines.push(unmet);
    }
  }

  if (interests)   lines.push("", `Academic interests: ${interests}`);
  if (career)      lines.push(`Career goal: ${career}`);
  if (constraints) lines.push(`Constraints: ${constraints}`);
  if (extra)       lines.push(`Additional context: ${extra}`);

  lines.push(
    "",
    "Based on this, please:",
    "1. Build a term-by-term course plan from my current standing through graduation.",
    "2. Respect prerequisite and antirequisite rules when scheduling courses.",
    "3. Fulfill all remaining graduation requirements as efficiently as possible.",
    "4. Balance workload across terms and account for any constraints I listed.",
    "5. Align elective and upper-year course choices with my career goal and interests.",
  );

  return lines.join("\n");
}
