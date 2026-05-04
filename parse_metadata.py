import os
import pandas as pd
import json
from metadata import find_metadata, crossListed

if __name__ == "__main__":
    df = pd.read_csv("courses_table.csv")
    rows = list(zip(df["code"], df["subject"]))

    for i, (code, subject) in enumerate(rows):
        html_path = os.path.join("data", "Course_HTML", subject, f"{code}.html")

        if not os.path.exists(html_path):
            print(f"{code} {i} (skipped — HTML not found)")
            continue

        print(f"{code} {i}")
        with open(html_path, "r", encoding="utf-8") as f:
            html_text = f.read()

        data = find_metadata(html_text, code)

        out_dir = os.path.join("data", "MetaData", subject)
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, f"{code}.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

    print("Cross-listed courses missing links:", crossListed)
