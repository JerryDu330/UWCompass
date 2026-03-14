import json
from pathlib import Path

courses = {}
or_graph = {}
prereq_graph = {}

or_node_count = 0
subject = "CS"

for file in Path(subject).glob("*.json"):
    with open(file) as f:
        courses[file.stem] = json.load(f)
# combine enriched courses and 13(4)5(6)
def combine_enriched():
    return 

def create_or_node(children):
    global or_node_count
    children = [c for c in children if c]
    if not children:
        return None 
    
    or_id = f"OR_NODE#{or_node_count:03d}"
    or_node_count += 1

    or_graph[or_id] = children
    return or_id


def parse_node(node, is_or_node = False):
    if not isinstance(node, dict):
        return None

    node_type = node.get("Type")

    if node_type == "COURSE" or node_type == "GRADE":
        code = node.get("Code")
        return code if code else None

    if node_type == "AND":
        deps = set()
        for child in node.get("Items", []):
            res = parse_node(child)
            if isinstance(res, str):
                deps.add(res)
            elif isinstance(res, set):
                deps |= res
        return deps if deps else None

    if node_type == "OR":
        children = []

        for child in node.get("Items", []):
            res = parse_node(child, True)

            if isinstance(res, str):
                children.append(res)
            elif isinstance(res, set):
                children.extend(list(res))

        key = tuple(sorted(children))

        if len(key) == 1:
            return key[0]

        for or_id, deps in or_graph.items():
            if tuple(sorted(deps)) == key:
                return or_id
        return create_or_node(children)

    return None

for course_code, course_data in courses.items():
    prereqs = course_data.get("Prerequisites")
    if not prereqs:
        continue

    res = parse_node(prereqs)

    if isinstance(res, str):
        prereq_graph[course_code] = [res]
    elif isinstance(res, set):
        prereq_graph[course_code] = list(res)

prereq_graph = {k: v for k, v in prereq_graph.items() if v}
or_graph = {k: v for k, v in or_graph.items() if v}

prereq_graph.update(or_graph)

def uniquelize(graph):
    res = {}
    for node, deps in graph.items():
        res[node] = list(set(deps))
    return res

prereq_graph = dict(sorted(uniquelize(prereq_graph).items()))

#Print for test
for k, v in prereq_graph.items():
    print(k, "->", v)

with open(f"prereq_graph_Ver5_{subject}.json", "w") as f:
    json.dump(prereq_graph, f, indent=4)

#For test
def find_duplicate_or_nodes(graph):

    seen = {}
    duplicates = []

    for node, deps in graph.items():

        if not node.startswith("OR_NODE"):
            continue

        key = tuple(sorted(deps))

        if key in seen:
            duplicates.append((node, seen[key]))
        else:
            seen[key] = node

    return duplicates

dups = find_duplicate_or_nodes(prereq_graph)

for dup, original in dups:
    print(f"{dup} is duplicate of {original}")
print("checked")