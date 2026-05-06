"""
Check whether a user meets the course requirements for a UW program,
and show how many courses are still needed.

Usage:
    python requirements_checker.py <program_json> <course1> <course2> ...

Example:
    python requirements_checker.py "Programs/Computer Science/Computer Science (Bachelor of Computer Science - Honours).json" MATH145 MATH147 CS145
"""

import json
import sys
from dataclasses import dataclass, field
from typing import Optional

from text_rule_parser import parse_text_rule, evaluate_text_rule


@dataclass
class MissingGroup:
    needed: int
    options: list[str]


@dataclass
class CheckResult:
    satisfied: Optional[bool]       # None = indeterminate (has manual items)
    remaining: int = 0
    missing_required: list[str] = field(default_factory=list)   # must take ALL (course codes)
    missing_groups: list[MissingGroup] = field(default_factory=list)  # pick N from
    missing_rules: list[str] = field(default_factory=list)      # failed text rules
    manual_review: list[str] = field(default_factory=list)


def evaluate_node(node: dict, completed: set[str]) -> CheckResult:
    t = node.get("type")

    if t == "COURSE":
        code = node["code"]
        if code in completed:
            return CheckResult(satisfied=True)
        return CheckResult(satisfied=False, remaining=1, missing_required=[code])

    if t == "TEXT":
        raw = node.get("text", "")
        rule = parse_text_rule(raw)
        if rule is None:
            return CheckResult(satisfied=None, manual_review=[raw])
        sat, remaining, matched = evaluate_text_rule(rule, completed)
        if sat is None:  # informational
            return CheckResult(satisfied=True)
        if sat:
            return CheckResult(satisfied=True, remaining=0)
        return CheckResult(satisfied=False, remaining=remaining, missing_rules=[raw])

    if t == "PROGRAM":
        return CheckResult(satisfied=None, manual_review=[f"Program: {node.get('code', '')}"])

    if t == "AND":
        req_missing, groups, rules, manual = [], [], [], []
        has_indeterminate = False
        total_remaining = 0
        for item in node.get("items", []):
            r = evaluate_node(item, completed)
            if r.satisfied is None:
                has_indeterminate = True
                manual.extend(r.manual_review)
            elif r.satisfied is False:
                req_missing.extend(r.missing_required)
                groups.extend(r.missing_groups)
                rules.extend(r.missing_rules)
                total_remaining += r.remaining
        if req_missing or groups or rules:
            return CheckResult(
                satisfied=False,
                remaining=total_remaining,
                missing_required=req_missing,
                missing_groups=groups,
                missing_rules=rules,
                manual_review=manual,
            )
        if has_indeterminate:
            return CheckResult(satisfied=None, manual_review=manual)
        return CheckResult(satisfied=True)

    if t == "OR":
        count_needed = node.get("count", 1)
        satisfied_count = 0
        uncompleted, manual = [], []
        for item in node.get("items", []):
            r = evaluate_node(item, completed)
            if r.satisfied is True:
                satisfied_count += 1
            elif r.satisfied is False:
                # collect leaf course codes from this option
                uncompleted.extend(r.missing_required)
            manual.extend(r.manual_review)
        still_needed = max(0, count_needed - satisfied_count)
        if still_needed == 0:
            return CheckResult(satisfied=True, manual_review=manual)
        return CheckResult(
            satisfied=False,
            remaining=still_needed,
            missing_groups=[MissingGroup(needed=still_needed, options=uncompleted)],
            manual_review=manual,
        )

    return CheckResult(satisfied=None, manual_review=[f"Unknown node: {node}"])


def check_program(program_data: dict, completed_courses: list[str]) -> dict:
    completed = {c.upper().replace(" ", "") for c in completed_courses}
    course_reqs = program_data.get("Course Requirements", {})

    section_results = []
    for section in course_reqs.get("items", []):
        title = section.get("title", "Unnamed Section")
        r = evaluate_node(section, completed)
        section_results.append({
            "title": title,
            "satisfied": r.satisfied,
            "remaining": r.remaining,
            "missing_required": sorted(set(r.missing_required)),
            "missing_groups": [
                {"needed": g.needed, "options": sorted(set(g.options))}
                for g in r.missing_groups
            ],
            "missing_rules": list(dict.fromkeys(r.missing_rules)),
            "manual_review": [m for m in dict.fromkeys(r.manual_review) if m],
        })

    total_remaining = sum(s["remaining"] for s in section_results)

    if not section_results:
        overall = None
    elif any(s["satisfied"] is False for s in section_results):
        overall = False
    elif any(s["satisfied"] is None for s in section_results):
        overall = None
    else:
        overall = True

    return {
        "program": program_data.get("title", ""),
        "overall_satisfied": overall,
        "total_remaining": total_remaining,
        "sections": section_results,
        "graduation_requirements_note": program_data.get("Graduation Requirements", ""),
        "additional_constraints_note": program_data.get("Additional Constraints", ""),
    }


def print_report(result: dict) -> None:
    status_label = {True: "DONE", False: "INCOMPLETE", None: "NEEDS REVIEW"}
    print(f"\n{'='*60}")
    print(f"Program  : {result['program']}")
    overall = result["overall_satisfied"]
    print(f"Status   : {status_label.get(overall, '?')}")
    if result["total_remaining"] > 0:
        print(f"Remaining: {result['total_remaining']} more course(s) needed")
    else:
        print(f"Remaining: 0 courses (check manual items below if any)")
    print(f"{'='*60}")

    for s in result["sections"]:
        sat = s["satisfied"]
        label = status_label.get(sat, "?")
        remaining_str = f"  ({s['remaining']} needed)" if s["remaining"] > 0 else ""
        print(f"\n[{label}] {s['title']}{remaining_str}")

        if s["missing_required"]:
            print(f"  Required : {', '.join(s['missing_required'])}")

        for g in s["missing_groups"]:
            opts = g["options"]
            n = g["needed"]
            if n == 1 and len(opts) <= 5:
                print(f"  Pick 1 of : {' / '.join(opts)}")
            else:
                print(f"  Pick {n} of : {', '.join(opts)}")

        if s.get("missing_rules"):
            print("  Unsatisfied rules :")
            for rule in s["missing_rules"]:
                print(f"    - {rule}")

        if s["manual_review"]:
            print("  Manual review :")
            for item in s["manual_review"]:
                print(f"    - {item}")

    if result["graduation_requirements_note"]:
        print(f"\nGraduation note :\n  {result['graduation_requirements_note'].replace(chr(10), chr(10)+'  ')}")
    if result["additional_constraints_note"]:
        print(f"\nConstraints :\n  {result['additional_constraints_note']}")
    print()


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = [a for a in sys.argv[1:] if a.startswith("--")]

    if len(args) < 1:
        print(__doc__)
        sys.exit(1)

    program_path = args[0]
    courses = args[1:]

    with open(program_path, encoding="utf-8") as f:
        program_data = json.load(f)

    result = check_program(program_data, courses)

    if "--json" in flags:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print_report(result)
