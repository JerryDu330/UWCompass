"""
Parse and evaluate free-text requirement rules like:
  "Complete 3 additional CS courses chosen from CS340-CS398, CS440-CS489"
  "Complete 1 additional AMATH course at the 300- or 400-level"
  "Complete at least 1 course from: BIOL, CHEM, EARTH"
"""

import re
import math
from dataclasses import dataclass, field
from typing import Optional

UNITS_PER_COURSE = 0.5  # standard UW course weight


# ── course code helpers ──────────────────────────────────────────

def parse_course_code(code: str) -> tuple[Optional[str], Optional[int]]:
    """'CS341' -> ('CS', 341),  'AMATH351' -> ('AMATH', 351)"""
    m = re.match(r'^([A-Z]+)\s*(\d+)', code.upper().replace(" ", ""))
    if m:
        return m.group(1), int(m.group(2))
    return None, None


def course_level(number: int) -> int:
    return (number // 100) * 100


# ── rule parsing ─────────────────────────────────────────────────

# Text that is purely informational — no requirement to evaluate
_INFORMATIONAL = re.compile(
    r'^(the following are|note:|if |directed studies|honours (thesis|seminar)|'
    r'complete associated|complete the list|complete the equivalent)',
    re.IGNORECASE,
)

# References to named external lists we can't resolve
_NAMED_LIST = re.compile(
    r'\bfrom (?:the )?(?:approved courses? )?list\b|\blist \d\b|\blist [12]\b',
    re.IGNORECASE,
)

# References to faculties — we don't have a course→faculty map
_FACULTY_REF = re.compile(
    r'\b(?:facult(?:y|ies) of|from the following facult)',
    re.IGNORECASE,
)


def _extract_count(text: str) -> Optional[int]:
    """Return course count, converting units to courses if needed."""
    # unit-based: "0.5 unit", "1.5 units", "2.0 additional units"
    m = re.search(r'(\d+(?:\.\d+)?)\s+(?:additional\s+)?unit', text, re.IGNORECASE)
    if m:
        units = float(m.group(1))
        return max(1, math.ceil(units / UNITS_PER_COURSE))

    # fractional course count meaning units: "0.5 additional BIOL courses"
    m = re.search(r'(\d+\.\d+)\s+(?:additional\s+)?(?:[A-Z]+\s+)?course', text, re.IGNORECASE)
    if m:
        units = float(m.group(1))
        return max(1, math.ceil(units / UNITS_PER_COURSE))

    # "at least N"
    m = re.search(r'at least\s+(\d+)', text, re.IGNORECASE)
    if m:
        return int(m.group(1))

    # "choose any" / "any additional" → 1
    if re.search(r'choose\s+any|any additional', text, re.IGNORECASE):
        return 1

    # plain integer after complete/choose/select/a total of
    m = re.search(
        r'(?:complete|choose|select)\s+(?:a total of\s+)?(\d+)', text, re.IGNORECASE
    )
    if m:
        return int(m.group(1))

    return None


def _extract_levels(text: str) -> tuple[Optional[list[int]], bool]:
    """
    Returns (levels, is_minimum).
    levels=None  → no level filter (any level)
    is_minimum   → levels[0] or above
    """
    # "X-level or above/higher"
    m = re.search(r'(\d)00-level or (?:above|higher)', text, re.IGNORECASE)
    if m:
        return [int(m.group(1)) * 100], True

    # "at the X-, Y-, Z-level"
    levels = sorted(set(int(d) * 100 for d in re.findall(r'(\d)00-', text)))
    if levels:
        return levels, False

    return None, False


def _extract_subjects(text: str) -> list[str]:
    """
    Extract subject codes from patterns like:
      "subject codes: AMATH, CO, MATH"
      "from: BIOL, CHEM, EARTH"
      "Complete N SUBJ courses"  (inline single subject)
    """
    # Explicit list after colon
    m = re.search(
        r'(?:subject codes?|from)\s*:\s*([A-Z][A-Z0-9,/\s]+)',
        text, re.IGNORECASE,
    )
    if m:
        raw = m.group(1)
        codes = re.split(r'[,/\s]+', raw.strip())
        result = [c.strip() for c in codes if re.match(r'^[A-Z]{2,8}$', c.strip())]
        if result:
            return result

    # Inline: "N additional SUBJ courses" or "N SUBJ courses"
    m = re.search(
        r'(?:complete|choose)\s+\S+\s+(?:additional\s+)?([A-Z]{2,8})\s+(?:course|unit)',
        text, re.IGNORECASE,
    )
    if m:
        return [m.group(1).upper()]

    # "unit of SUBJ courses"
    m = re.search(r'unit(?:s)?\s+of\s+([A-Z]{2,8})\s+course', text, re.IGNORECASE)
    if m:
        return [m.group(1).upper()]

    return []


def _extract_code_ranges(text: str) -> list[tuple[str, int, int]]:
    """
    Extract course number ranges like "CS340-CS398, CS440-CS489".
    Returns list of (subject, low, high).
    """
    ranges = []
    for m in re.finditer(
        r'([A-Z]{2,8})\s*(\d{3,4})\s*[-–]\s*(?:[A-Z]{2,8}\s*)?(\d{3,4})',
        text,
    ):
        ranges.append((m.group(1), int(m.group(2)), int(m.group(3))))
    return ranges


def parse_text_rule(text: str) -> Optional[dict]:
    """
    Parse a TEXT requirement node into a structured rule dict.
    Returns None if the rule can't be auto-evaluated.

    Rule types:
      {"type": "CODE_RANGE",    "count": N, "ranges": [(subj, lo, hi), ...]}
      {"type": "SUBJECT_LEVEL", "count": N, "subjects": [...], "levels": [...] or None, "level_min": bool}
      {"type": "INFORMATIONAL"}
    """
    t = text.strip()
    tl = t.lower()

    if _INFORMATIONAL.match(tl):
        return {"type": "INFORMATIONAL"}

    if _NAMED_LIST.search(tl) or _FACULTY_REF.search(tl):
        return None  # can't resolve

    count = _extract_count(t)
    if count is None:
        return None

    # Code-range rules take priority
    ranges = _extract_code_ranges(t)
    if ranges:
        return {"type": "CODE_RANGE", "count": count, "ranges": ranges}

    subjects = _extract_subjects(t)
    levels, level_min = _extract_levels(t)

    if subjects or levels is not None:
        return {
            "type": "SUBJECT_LEVEL",
            "count": count,
            "subjects": subjects,
            "levels": levels,
            "level_min": level_min,
        }

    return None  # couldn't extract enough info


# ── rule evaluation ──────────────────────────────────────────────

def evaluate_text_rule(
    rule: dict, completed: set[str]
) -> tuple[Optional[bool], int, list[str]]:
    """
    Evaluate a parsed rule against a set of completed course codes.
    Returns (satisfied, remaining, matched_courses).
    satisfied=None means informational (no requirement).
    """
    if rule["type"] == "INFORMATIONAL":
        return None, 0, []

    if rule["type"] == "CODE_RANGE":
        matched = []
        for code in completed:
            subj, num = parse_course_code(code)
            if subj is None:
                continue
            for r_subj, lo, hi in rule["ranges"]:
                if subj == r_subj and lo <= num <= hi:
                    matched.append(code)
                    break
        remaining = max(0, rule["count"] - len(matched))
        return remaining == 0, remaining, matched

    if rule["type"] == "SUBJECT_LEVEL":
        subjects = rule.get("subjects", [])
        levels = rule.get("levels")
        level_min = rule.get("level_min", False)

        matched = []
        for code in completed:
            subj, num = parse_course_code(code)
            if subj is None:
                continue
            if subjects and subj not in subjects:
                continue
            if levels is not None:
                lvl = course_level(num)
                if level_min:
                    if lvl < levels[0]:
                        continue
                else:
                    if lvl not in levels:
                        continue
            matched.append(code)

        remaining = max(0, rule["count"] - len(matched))
        return remaining == 0, remaining, matched

    return None, 0, []
