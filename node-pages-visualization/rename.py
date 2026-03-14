import os
import json

folder_path = "./public/data" 
folder_path2 = "./public"

prefix = "prereq_graph_"

for filename in os.listdir(folder_path):
    if filename.endswith(".json") and filename.startswith(prefix):
        
        subject = filename[len(prefix):]   # remove prefix
        
        old_path = os.path.join(folder_path, filename)
        new_path = os.path.join(folder_path, subject)

        os.rename(old_path, new_path)

        print(f"{filename} -> {subject}")

print("Renaming complete.")

lst = []
for filename in os.listdir(folder_path):
    subject = filename[:-5]
    lst.append(subject)

lst.sort()
print(lst)

with open(os.path.join(folder_path2, "subjects.json"), "w") as f:
    json.dump(lst, f)

print("subjects.json created")