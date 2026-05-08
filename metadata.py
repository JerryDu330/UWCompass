from bs4 import BeautifulSoup
import os
import pandas as pd
import json


crossListed = []

def find_metadata(html_text, class_name):
    res = {
        "Code": class_name,
        "Title": "",
        "Description": "",
        "Units": "",
        "Cross-Listed Courses": [],
        "Special Course Grading": "",
        "Total Completions Allowed (Subject to Different Content)": "",
        "Allow Multiple Enrol in a Term": "",
        "Special Consent Required to Add": "",
        "Special Consent Required to Drop": "",
        "Additional Fees": "",
        "Notes": "",
    }

    soup = BeautifulSoup(html_text, "html.parser")

    heading = soup.select_one('div[class^="course-view__itemTitleAndTranslationButton"] h2, div[class^="course-view__itemTitleAndTranslationButton"] h1')
    if heading:
        text = heading.get_text(strip=True)
        if '-' in text:
            res["Title"] = text.split('-', 1)[1].strip()

    h3_tags = soup.select('h3[class^="course-view__label"]')

    for tag in h3_tags:
        label = tag.get_text(strip=True)

        if label == "Cross-Listed Courses":
            aa = tag.parent.find_all("a")
            if aa:
                for a in aa:
                    res["Cross-Listed Courses"].append(a.get_text(strip=True))
            else:
                crossListed.append(class_name)

        elif label not in ["Prerequisites", "Antirequisites", "Corequisites"]:
            div = tag.parent.find("div")
            if div:
                res[label] = div.get_text(strip=True)

    return res


if __name__ == "__main__":
    df = pd.read_csv("courses_table.csv")
    rows = list(zip(df["code"], df["subject"]))

    for i, (code, subject) in enumerate(rows):
        html_path = os.path.join("data", "Course_HTML", subject, f"{code}.html")

        if not os.path.exists(html_path):
            print(f"{code} {i} (skipped - HTML not found)")
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
