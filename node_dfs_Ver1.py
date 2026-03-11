import json
from pathlib import Path

courses = {}

for file in Path("CS").glob("*.json"):
    with open(file) as f:
        courses[file.stem] = json.load(f)

def extract_and_prereqs(node):
    codes = set()
    if not isinstance(node, dict):
        return codes

    node_type = node.get("type")

    if node_type == "AND" or node_type == "OR":
        for child in node.get("items", []):
            if child.get("type") != "NOT": 
                codes.update(extract_and_prereqs(child))

    elif node_type == "COURSE":
        codes.add(node["code"])

    return codes

and_prereq_graph = {}

for course_code, course_data in courses.items():
    prereqs = course_data.get("Prerequisites", {})
    and_prereq_graph[course_code] = extract_and_prereqs(prereqs)

for course, prereq_set in and_prereq_graph.items():
    print(f"{course}: {prereq_set}")


prereq_graph_json = {k: list(v) for k, v in and_prereq_graph.items()}

with open("prereq_graph.json", "w") as f:
    json.dump(prereq_graph_json, f, indent=4)