from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import unquote
import time
import csv
import json
import os
import re


# ── 1. Fetch program list ───────────────────────────────────────

def extract_programs_link(driver):
    browser = driver
    url = "https://uwaterloo.ca/academic-calendar/undergraduate-studies/catalog#/programs"
    browser.get(url)

    wait = WebDriverWait(browser, 10)
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.style__collapsibleBox___DBqEP")))
    time.sleep(2)

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
    print("Extracting links...")

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

        all_programs.append({
            "group": params.get("bcGroup", "").replace("/", "-"),
            "name": params.get("bcCurrent", text).replace("/", "-"),
            "type": params.get("bcItemType", ""),
            "link": href,
        })

    all_programs.sort(key=lambda p: (p["group"].lower(), p["name"].lower()))
    print(f"Total programs: {len(all_programs)}")
    return all_programs


# ── 2. Fetch single program detail page HTML ────────────────────

def extract_program_html(url, driver, expected_title=None):
    driver.get(url)
    # Wait for the title element to appear with the correct program name,
    # not just any leftover title from the previously loaded page.
    if expected_title:
        WebDriverWait(driver, 15).until(
            lambda d: (
                (el := d.find_elements(By.CSS_SELECTOR, "h2.program-view__title___x6bi1"))
                and el[0].text.strip().replace("/", "-") == expected_title
            )
        )
    else:
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "h2.program-view__title___x6bi1"))
        )
    time.sleep(0.5)
    footer = driver.find_elements(By.CSS_SELECTOR, "footer")
    if footer:
        return driver.execute_script("""
            var footer = arguments[0];
            var html = '';
            var elem = document.body.firstChild;
            while(elem && elem !== footer){
                html += elem.outerHTML;
                elem = elem.nextSibling;
            }
            return html;
        """, footer[0])
    return driver.find_element(By.ID, "kuali-catalog-main").get_attribute("innerHTML")


# ── 3. Parsing logic ────────────────────────────────────────────

def parse_rule_node(div):
    """Parse a single ruleView-X-result div."""
    text = div.get_text(separator=" ", strip=True)
    text_lower = text.lower()
    links = div.select("a[href]")

    # Text-only rule (no links)
    if not links:
        return {"type": "TEXT", "text": text}

    # Determine logic type
    count = None
    if re.search(r'complete all|all of the following|each of the following', text_lower):
        logic = "AND"
    elif re.search(r'complete (\d+) of|choose (\d+)', text_lower):
        match = re.search(r'complete (\d+)|choose (\d+)', text_lower)
        count = int(match.group(1) or match.group(2))
        logic = "OR"
    elif "any of the following" in text_lower or "choose any" in text_lower:
        logic = "OR"
    elif "one of the following" in text_lower or "1 of the following" in text_lower:
        logic = "OR"
        count = 1
    else:
        logic = "OR"

    items = []
    for a in links:
        href = a.get("href", "")
        code = a.get_text(strip=True)
        if "/courses/view/" in href:
            items.append({"type": "COURSE", "code": code})
        elif "/programs/view/" in href:
            items.append({"type": "PROGRAM", "code": code})

    if not items:
        return {"type": "TEXT", "text": text}

    node = {"type": logic, "items": items}
    if count is not None:
        node["count"] = count
    return node


def parse_section(section_tag):
    """Parse a <section>, corresponding to one grouping (e.g. Required Courses)."""
    header = section_tag.select_one("header div span")
    title = header.get_text(strip=True) if header else "Unknown"

    items = []
    rule_divs = section_tag.select("div[data-test$='-result']")
    for div in rule_divs:
        node = parse_rule_node(div)
        if node:
            items.append(node)

    return {
        "title": title,
        "type": "AND",
        "items": items
    }


def parse_course_requirements(html_text):
    soup = BeautifulSoup(html_text, "html.parser")

    label = None
    for h3 in soup.select("h3.program-view__label___RGRDq"):
        if h3.get_text(strip=True) == "Course Requirements":
            label = h3
            break

    if not label:
        return {}

    content_div = label.find_next_sibling("div")
    if not content_div:
        return {}

    sections = content_div.select("section")
    result = []
    for section in sections:
        result.append(parse_section(section))

    return {"type": "AND", "items": result}


def parse_graduation_requirements(html_text):
    soup = BeautifulSoup(html_text, "html.parser")
    result = {}

    # Title
    title_tag = soup.select_one("h2.program-view__title___x6bi1")
    result["title"] = title_tag.get_text(strip=True) if title_tag else ""

    # Course Requirements (structured)
    result["Course Requirements"] = parse_course_requirements(html_text)

    # Other plain-text sections
    text_sections = [
        "Systems of Study",
        "Declaration Requirements",
        "Minimum Average(s) Required",
        "Graduation Requirements",
        "Additional Constraints",
        "Specializations",
    ]
    for h3 in soup.select("h3.program-view__label___RGRDq"):
        name = h3.get_text(strip=True)
        if name in text_sections:
            content = h3.find_next_sibling("div")
            result[name] = content.get_text(separator="\n", strip=True) if content else ""

    # Offered by Faculty
    for h3 in soup.select("h3.program-view__label___RGRDq"):
        if h3.get_text(strip=True) == "Offered by Faculty(ies)":
            content = h3.find_next_sibling("div")
            result["Faculty"] = content.get_text(strip=True) if content else ""

    return result


# ── 4. Main flow ────────────────────────────────────────────────

if __name__ == "__main__":
    chrome_options = Options()
    # chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=chrome_options)

    # Step 1: Get all program links
    programs = extract_programs_link(driver)

    # Save programs.csv
    with open("programs.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["group", "name", "type", "link"],
            quoting=csv.QUOTE_ALL
        )
        writer.writeheader()
        writer.writerows(programs)
    print("Saved programs.csv")

    # Step 2: Crawl each program detail page
    os.makedirs("Programs", exist_ok=True)
    for i, program in enumerate(programs):
        print(f"[{i+1}/{len(programs)}] {program['name']}")
        for attempt in range(3):
            try:
                html_text = extract_program_html(program["link"], driver, expected_title=program["name"])
                data = parse_graduation_requirements(html_text)
                data["name"] = program["name"].replace("/", "-")
                data["group"] = program["group"]
                data["link"] = program["link"]

                safe_name = program["name"].replace("/", "-").replace(":", "").replace("?", "")
                folder = os.path.join("Programs", program["group"])
                os.makedirs(folder, exist_ok=True)
                with open(os.path.join(folder, f"{safe_name}.json"), "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=4, ensure_ascii=False)
                break
            except Exception as e:
                print(f"  Attempt {attempt+1} failed: {e}")
                try:
                    driver.quit()
                except Exception:
                    pass
                driver = webdriver.Chrome(options=chrome_options)
                time.sleep(2)
        else:
            print(f"  Skipping {program['name']} after 3 failed attempts")

    driver.quit()
    print("All done!")