from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def extract_course(url):
    driver.get(url)
    footer = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "footer")))

    html_before_footer = driver.execute_script("""
    var footer = arguments[0];
    var html = '';
    var elem = document.body.firstChild;
    while(elem && elem !== footer){
        html += elem.outerHTML;
        elem = elem.nextSibling;
    }
    return html;
    """, footer)
    driver.close()

    return html_before_footer


if __name__ == "__main__":
    chrome_options = Options()
    chrome_options.add_argument("--headless") 
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=chrome_options) 

    # AFM 101 url as an example
    url = "https://uwaterloo.ca/academic-calendar/undergraduate-studies/catalog#/courses/HJ5IYNmYn?bc=true&bcCurrent=AFM101%20-%20Introduction%20to%20Financial%20Accounting&bcGroup=Accounting%20and%20Financial%20Management%20(AFM)&bcItemType=courses"
    html = extract_course(url)
    driver.quit()

