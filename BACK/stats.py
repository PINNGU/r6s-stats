from scraper import scraper
from bs4 import BeautifulSoup as bs

r6_ranks = [
    "COPPER", "BRONZE", "SILVER", "GOLD",
    "PLATINUM", "EMERALD", "DIAMOND", "CHAMPION"
]

PLAYER = {
            "Name":"",
            "Rank":"",
            "RankImg":"",
            "Win":0.0,
            "KDA":0.0,
            "Atk":["",""],
            "Def":["",""],
            "Map":"", 
        }

STACK = []

soup = scraper()

STACK.append(PLAYER)
rank_image = soup.select_one('img.rank-image')
STACK[0]["RankImg"] = rank_image['src']



sections = soup.find_all("section",class_="season-overview")
for section in sections:
    stats = section.find_all("span",class_="stat-name")

    for stat in stats:
        if "win rate" in stat.text.lower():
            winrate_value = stat.find_next("span", class_="stat-value stat-value--text")
            if winrate_value:
                percentage = winrate_value.find("span").text.strip()
                STACK[0]["Win"] = percentage

        elif "kd" in stat.text.lower():
            kd = stat.find_next("span",class_="stat-value stat-value--text")
            if kd:
                kd_val = kd.find("span").text.strip()
                STACK[0]["KDA"] = kd_val


    stats = section.find_all("span")

    for stat in stats:
            for k in r6_ranks:
                
                if k in stat.text:
                    STACK[0]["Rank"] = stat.text  



print(STACK)

