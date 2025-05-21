from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync
import time


def scraper_player(name):
    url_base = f"https://r6.tracker.network/r6siege/profile/ubi/{name}/"
    url_overview = url_base + "overview"
    url_operators = url_base + "operators"

    with sync_playwright() as p:
        browser = p.chromium.launch(args=[ '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage']  ) 
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 800},
            java_script_enabled=True
        )


        page = context.new_page()

        page.goto(url_overview)
        try:
            page.wait_for_selector(".season-overview",timeout=10000)
        except:
            page.reload()
            page.wait_for_selector(".season-overview",timeout=10000)
        

        content_overview = page.content()
        soup_basic = bs(content_overview, "html.parser")


        browser.close()

    return soup_basic

def scraper_matches(player):
    url = f"https://r6.tracker.network/r6siege/profile/ubi/{player}/matches?playlist=ranked"

   
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True,args=['--disable-gpu', '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage']  ) 
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 800},
            java_script_enabled=True
        )

        
        page = context.new_page()

        page.goto(url)
        try:
            page.wait_for_selector(".match-group")
        except:
            page.reload()
            page.wait_for_selector(".match-group")
        
        content_overview = page.content()
        soup = bs(content_overview, "html.parser")


        browser.close()

 

    return soup


def scraper_ops(player):
    url = f"https://r6.tracker.network/r6siege/profile/ubi/{player}/operators"
    with sync_playwright() as p:
        browser = p.chromium.launch(args=['--disable-gpu', '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'] ) 
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 800},
            java_script_enabled=True
        )

        page = context.new_page()

        page.goto(url)
        
        try:
            page.wait_for_selector(".operators-table")
        except:
            page.reload()
            page.wait_for_selector(".operators-table")
        
        soup = bs(page.content(),"html.parser")

        browser.close()

    return soup


def scraper_mates(player):

    url = f"https://r6.tracker.network/r6siege/profile/ubi/{player}/encounters?playlist=ranked"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True,args=['--disable-gpu', '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'] ) 
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 800},
            java_script_enabled=True
        )

        page = context.new_page()

        page.goto(url)
        
        
        for delay in [3000, 4000,5000,7000]:
            try:
                page.wait_for_timeout(delay)
                break
            except:
                page.reload()
        
        soup = bs(page.content(),"html.parser")

        browser.close()

    return soup


