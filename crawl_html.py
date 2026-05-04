import os
import pandas as pd
import course_info as cc

from selenium import webdriver
from selenium.webdriver.chrome.options import Options


if __name__ == "__main__":
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=chrome_options)

    df = pd.read_csv("courses_table.csv")
    num_to_link = dict(zip(df["code"], zip(df["link"], df["subject"])))

    for i, (code, (link, subject)) in enumerate(num_to_link.items()):
        out_dir = os.path.join("data", "Course_HTML", subject)
        out_path = os.path.join(out_dir, f"{code}.html")

        if os.path.exists(out_path):
            print(f"{code} {i} (skipped)")
            continue

        print(f"{code} {i}")
        html_text = cc.extract_course(link, driver)

        os.makedirs(out_dir, exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html_text)

    driver.quit()
