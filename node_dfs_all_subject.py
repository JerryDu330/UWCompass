import json
from pathlib import Path
import re
from typing import Dict, List, Set, Optional, Union, Tuple

input_folder: Path = Path("Nodes")
output_folder: Path = Path("course-node-tree")
output_folder.mkdir(parents=True, exist_ok=True)

pattern = re.compile(r"[A-Z]{2,}\d{2,3}.*")


def iscoursecode(s: str) -> Optional[str]:
    return s if pattern.fullmatch(s) else None


def create_or_node(
    children: List[str],
    or_graph: Dict[str, List[str]],
    or_node_count: int
) -> Tuple[str, Dict[str, List[str]], int]:

    children = [c for c in children if c]
    if not children:
        return "", or_graph, or_node_count

    or_id = f"OR_NODE#{or_node_count:03d}"
    or_node_count += 1
    or_graph[or_id] = children
    return or_id, or_graph, or_node_count


def parse_node(
    node: dict,
    or_graph: Dict[str, List[str]],
    or_node_count: int,
    is_or_node: bool = False
) -> Tuple[Optional[Union[str, Set[str]]], Dict[str, List[str]], int]:
    if not isinstance(node, dict):
        return None, or_graph, or_node_count

    node_type = node.get("Type")
    if node_type in ("COURSE", "GRADE"):
        code = iscoursecode(node.get("Code"))
        return code, or_graph, or_node_count

    if node_type == "AND":
        deps: Set[str] = set()
        for child in node.get("Items", []):
            res, or_graph, or_node_count = parse_node(child, or_graph, or_node_count)
            if isinstance(res, str):
                deps.add(res)
            elif isinstance(res, set):
                deps |= res
        return deps if deps else None, or_graph, or_node_count

    if node_type == "OR":
        children: List[str] = []
        for child in node.get("Items", []):
            res, or_graph, or_node_count = parse_node(child, or_graph, or_node_count, True)
            if isinstance(res, str):
                children.append(res)
            elif isinstance(res, set):
                children.extend(list(res))

        key = tuple(sorted(children))
        if len(key) == 0:
            return None, or_graph, or_node_count
        if len(key) == 1:
            return key[0], or_graph, or_node_count

        for or_id, deps in or_graph.items():
            if tuple(sorted(deps)) == key:
                return or_id, or_graph, or_node_count

        or_id, or_graph, or_node_count = create_or_node(children, or_graph, or_node_count)
        return or_id, or_graph, or_node_count

    return None, or_graph, or_node_count


def uniquelize(graph: Dict[str, List[str]]) -> Dict[str, List[str]]:
    return {k: list(set(v)) for k, v in graph.items()}


def process_subject(subject_folder: Path) -> Dict[str, List[str]]:
    subject = subject_folder.name
    print(f"\nProcessing subject: {subject}")

    courses: Dict[str, dict] = {}
    prereq_graph: Dict[str, List[str]] = {}
    or_graph: Dict[str, List[str]] = {}
    or_node_count: int = 0

    for file in subject_folder.glob("*.json"):
        with open(file, encoding="utf-8") as f:
            courses[file.stem] = json.load(f)

    for course_code, course_data in courses.items():
        prereqs = course_data.get("Prerequisites")
        if not prereqs:
            continue
        res, or_graph, or_node_count = parse_node(prereqs, or_graph, or_node_count)
        if isinstance(res, str):
            prereq_graph[course_code] = [res]
        elif isinstance(res, set):
            prereq_graph[course_code] = list(res)

    prereq_graph.update({k: v for k, v in or_graph.items() if v})
    prereq_graph = dict(sorted(uniquelize(prereq_graph).items()))

    output_file = output_folder / f"prereq_graph_{subject}.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(prereq_graph, f, indent=4)

    print(f"Finished subject {subject}, courses: {len(courses)}")
    return prereq_graph


all_subjects_graph: Dict[str, Dict[str, List[str]]] = {}
for subject_folder in input_folder.iterdir():
    if subject_folder.is_dir():
        graph = process_subject(subject_folder)
        all_subjects_graph[subject_folder.name] = graph

print("\nAll subjects processed.")