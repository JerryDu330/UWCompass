from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time


def extract_programs_link(driver):
    browser = driver
    url = (
        "https://uwaterloo.ca/academic-calendar/undergraduate-studies/catalog#/programs"
    )
    browser.get(url)

    wait = WebDriverWait(browser, 5)
    browser.execute_script("document.activeElement.blur();")
    all_programs = []
    last_height = browser.execute_script("return document.body.scrollHeight")

    while True:
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        try:
            wait.until(
                lambda d: d.execute_script("return document.body.scrollHeight")
                > last_height
            )
            new_height = browser.execute_script("return document.body.scrollHeight")
        except:
            break

        if new_height == last_height:
            break
        last_height = new_height
    # find all subject modules
    modules = browser.find_elements(
        By.CSS_SELECTOR, "div.style__collapsibleBox___DBqEP"
    )

    for i in range(len(modules)):
        modules = browser.find_elements(
            By.CSS_SELECTOR, "div.style__collapsibleBox___DBqEP"
        )
        module = modules[i]

        title = module.find_element(By.TAG_NAME, "h2").text.strip()

        # expand modules
        try:
            btn = module.find_element(By.CSS_SELECTOR, "button[aria-label^='show']")
            if btn.get_attribute("aria-expanded") == "false":
                browser.execute_script(
                    "arguments[0].scrollIntoView({block:'center'});", btn
                )
                browser.execute_script("arguments[0].click();", btn)

                wait.until(
                    EC.presence_of_element_located(
                        (By.XPATH, './/a[starts-with(@href, "#/programs/")]')
                    )
                )
        except:
            print("No button or already expanded")

        prev_links_count = -1
        program_links = []
        timeout_links = 1
        start_time_links = time.time()

        while True:
            modules = browser.find_elements(
                By.CSS_SELECTOR, "div.style__collapsibleBox___DBqEP"
            )
            module = modules[i]
            program_links = module.find_elements(
                By.XPATH, './/a[starts-with(@href, "#/programs/")]'
            )

            if len(program_links) != prev_links_count:
                prev_links_count = len(program_links)
                start_time_links = time.time()

            if time.time() - start_time_links > timeout_links:
                break

            time.sleep(0.05)

        print(f"  program number: {len(program_links)}")

        for link in program_links:
            href = link.get_attribute("href")

            text = link.text
            if not text:
                continue

            all_programs.append({"module": title, "name": text, "link": href})
            print(f"  {title} - {text} - {href}")

    print("\nDone! Total program number:", len(all_programs))
    return all_programs


if __name__ == "__main__":
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        links = extract_programs_link(driver)
    finally:
        driver.quit()
