function normalize(code) {
  return code.replace(/\s+/g, "").toUpperCase();
}

function isFulfilled(node, takenSet) {
  if (node.type === "COURSE") return takenSet.has(normalize(node.code));
  if (node.type === "TEXT")   return false; // always surface text requirements
  if (node.type === "AND")    return node.items.every(item => isFulfilled(item, takenSet));
  if (node.type === "OR") {
    const count = node.count ?? 1;
    return node.items.filter(item => isFulfilled(item, takenSet)).length >= count;
  }
  return false;
}

function describeNode(node, takenSet) {
  if (isFulfilled(node, takenSet)) return null;

  if (node.type === "COURSE") return node.code;

  if (node.type === "TEXT") return node.text;

  if (node.type === "OR") {
    const count = node.count ?? 1;
    const fulfilledCount = node.items.filter(item => isFulfilled(item, takenSet)).length;
    const remaining = count - fulfilledCount;
    const options = node.items.map(item => item.code ?? item.text).join(" / ");
    return `Complete ${remaining} of: ${options}`;
  }

  if (node.type === "AND") {
    // Flat AND of only COURSE nodes — group into one "Required" line
    if (node.items.every(item => item.type === "COURSE")) {
      const unfulfilled = node.items
        .filter(item => !isFulfilled(item, takenSet))
        .map(item => item.code);
      return unfulfilled.length ? `Required: ${unfulfilled.join(", ")}` : null;
    }

    const lines = node.items
      .map(item => describeNode(item, takenSet))
      .filter(Boolean);

    if (!lines.length) return null;
    return node.title
      ? `${node.title}:\n${lines.map(l => `  - ${l}`).join("\n")}`
      : lines.join("\n");
  }

  return null;
}

/**
 * Returns a human-readable string of unfulfilled graduation requirements.
 *
 * @param {Object}   requirementsJson - The full program JSON (with "Course Requirements")
 * @param {string[]} completed        - Courses already taken
 * @param {string[]} inProgress       - Courses currently enrolled in
 * @returns {string}
 */
export function formatGradRequirements(requirementsJson, completed, inProgress) {
  const takenSet = new Set([...completed, ...inProgress].map(normalize));
  const req = requirementsJson["Course Requirements"];
  if (!req) return "";

  const desc = describeNode(req, takenSet);
  return desc ?? "";
}
