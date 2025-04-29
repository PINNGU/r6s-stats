from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import requests

def scraper():

    url = f"https://r6.tracker.network/r6siege/profile/ubi/Pinngu.FRGTN/"
    url_ops = url.join("operators")
    url = url.join("overview")
    service = Service("BACK/chromedriver.exe")

    driver = webdriver.Chrome(service=service)
    driver.get(url)


    soup = bs(driver.page_source,'html.parser')

    driver.quit()
    return soup

