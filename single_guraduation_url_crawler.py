from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import unquote
import time
import csv


def extract_program(url, driver):
    driver.get(url)
    footer = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "footer"))
    )
    time.sleep(1)
    html_before_footer = driver.execute_script(
        """
        var footer = arguments[0];
        var html = '';
        var elem = document.body.firstChild;
        while(elem && elem !== footer){
            html += elem.outerHTML;
            elem = elem.nextSibling;
        }
        return html;
        """,
        footer,
    )
    return html_before_footer


def extract_programs_link(driver):
    browser = driver
    url = "https://uwaterloo.ca/academic-calendar/undergraduate-studies/catalog#/programs"
    browser.get(url)

    wait = WebDriverWait(browser, 10)
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.style__collapsibleBox___DBqEP")))
    time.sleep(2)

    # 展开所有模块
    print("Expanding all modules...")
    while True:
        btns = browser.find_elements(By.XPATH, "//button[starts-with(@aria-label, 'show')]")
        if not btns:
            break
        prev_count = len(btns)
        for btn in btns:
            try:
                browser.execute_script("arguments[0].scrollIntoView({block:'center'});", btn)
                time.sleep(0.2)
                browser.execute_script("arguments[0].click();", btn)
                time.sleep(0.3)
            except:
                pass
        remaining = browser.find_elements(By.XPATH, "//button[starts-with(@aria-label, 'show')]")
        if len(remaining) == 0 or len(remaining) == prev_count:
            break

    time.sleep(1)
    print("All modules expanded, extracting links...")

    # 提取所有 program 链接
    links = browser.find_elements(
        By.XPATH, '//a[contains(@href, "#/programs/") and contains(@href, "bcCurrent")]'
    )

    all_programs = []
    for link in links:
        href = link.get_attribute("href")
        text = link.text.strip()

        fragment = href.split("#")[1] if "#" in href else ""
        params = {}
        if "?" in fragment:
            query = fragment.split("?", 1)[1]
            for part in query.split("&"):
                if "=" in part:
                    k, v = part.split("=", 1)
                    params[k] = unquote(v.replace("+", " "))

        group = params.get("bcGroup", "")
        name = params.get("bcCurrent", text)
        item_type = params.get("bcItemType", "")

        all_programs.append({
            "group": group,
            "name": name,
            "type": item_type,
            "link": href,
        })
        print(f"  {group} - {name}")

    print(f"\nDone! Total programs: {len(all_programs)}")
    return all_programs


if __name__ == "__main__":
    chrome_options = Options()
    # chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=chrome_options)

    programs = extract_programs_link(driver)
    driver.quit()

    with open("programs.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, 
                                fieldnames=["group", "name", "type", "link"],
                                quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(programs)

    print("Saved to programs.csv")