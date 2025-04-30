from scraper import scraper_player,scraper_mates
from optimizator import get_best_ops
from bs4 import BeautifulSoup as bs


r6_ranks = [
    "COPPER", "BRONZE", "SILVER", "GOLD",
    "PLATINUM", "EMERALD", "DIAMOND", "CHAMPION"
]

operator_side_dict = {
    "Ash": "atk",
    "Blackbeard": "atk",
    "Blitz": "atk",
    "Buck": "atk",
    "Capitao": "atk",
    "Finka": "atk",
    "Glaz": "atk",
    "Iana": "atk",
    "IQ": "atk",
    "Lion": "atk",
    "Maverick": "atk",
    "Montagne": "atk",
    "Nokk": "atk",
    "Nomad": "atk",
    "Sledge": "atk",
    "Twitch": "atk",
    "Zero": "atk",
    "Zofia": "atk",
    "Amaru": "atk",
    "Ace": "atk",
    "Rauora":"atk",
    "Striker":"atk",
    "Deimos":"atk",
    "Ram":"atk",
    "Brava":"atk",
    "Grim":"atk",
    "Sens":"atk",
    "Osa":"atk",
    "Flores":"atk",
    "Kali":"atk",
    "Amaru":"atk",
    "Nøkk":"atk",
    "Gridlock":"atk",
    "Dokkaebi":"atk",
    "Ying": "atk",
    "Jackal":"atk",
    "Hibana":"atk",
    "Thatcher":"atk",
    "Thermite":"atk",
    "Fuze":"atk",



    # missing but not needed
    "Alibi": "def",
    "Aruni": "def",
    "Bandit": "def",
    "Castle": "def",
    "Clash": "def",
    "Doc": "def",
    "Echo": "def",
    "Frost": "def",
    "Goyo": "def",
    "Jäger": "def",
    "Kaid": "def",
    "Kapkan": "def",
    "Lesion": "def",
    "Mira": "def",
    "Maestro": "def",
    "Mute": "def",
    "Oryx": "def",
    "Pulse": "def",
    "Rook": "def",
    "Tachanka": "def",
    "Valkyrie": "def",
    "Wamai": "def",
    "Warden": "def",
    "Melusi": "def",
    "Smoke": "def",
    "Castle": "def",
    "Thorn": "def",
    "Jäger": "def"
}

PLAYER = {
            "Name":"",
            "Rank":"",
            "RankImg":"",
            "Win":0.0,
            "KDA":0.0,
            "Atk":["",""],
            "Def":["",""] 
        }

OP = {
    "Name":"",
    "WR":0.0,
    "Side":""
}

OPS = []

MATES = [
    {
        "Name":"",
        "Rank":"",
        "Win":0.0
    },
    {
        "Name":"",
        "Rank":"",
        "Win":0.0
    },
    {
        "Name":"",
        "Rank":"",
        "Win":0.0
    },
    {
        "Name":"",
        "Rank":"",
        "Win":0.0
    },

]



def get_player():
    pass


def get_ops_values(soup):
    rows = soup.find_all("div",class_="trow stat-table-row")
    counter = 0
    for row in rows:
        if counter < 10:
            cols = row.find_all("span")
            name = cols[0].get_text(strip=True)
            winrate = cols[3].get_text(strip=True) if len(cols) > 3 else "N/A"
            winrate = winrate.replace("%",'')
            winrate = float(winrate)
            OP = {
                "Name":"",
                "WR":0.0,
                "Side":""
            }
            OP["Name"] = name
            OP["WR"] = winrate
            OPS.append(OP)

            counter = counter + 1
        else:
            break

def get_ops_side():
    for op in OPS:
        name = op["Name"]
        if operator_side_dict[name]  == 'atk':
            op["Side"] = "atk"
        else:
            op["Side"] = "def"

def get_teammates(player):
    soup = scraper_mates(player)

    sections = soup.find_all("div",class_="trow stat-table-row")
    counter = 0
    for section in sections:
        if counter < 4:
            cols = section.find_all("span")
            name = cols[0].get_text(strip=True)
            winrate = cols[7].get_text(strip=True) if len(cols) > 3 else "N/A"
            winrate = winrate.replace("%",'')
            winrate = float(winrate)
            image = cols[4].get_text(strip=True)

            MATES[counter]["Name"] = name
            MATES[counter]["Win"] = winrate
            MATES[counter]["Rank"] = image

            counter = counter + 1
        else:
            break
    print(MATES)




def get_all_stats(player):
    PLAYER["Name"] = player
    soup_basic,soup_ops = scraper_player(player)

    rank_image = soup_basic.select_one('img.rank-image')
    PLAYER["RankImg"] = rank_image['src']



    sections = soup_basic.find_all("section",class_="season-overview")
    for section in sections:
        stats = section.find_all("span",class_="stat-name")

        for stat in stats:
            if "win rate" in stat.text.lower():
                winrate_value = stat.find_next("span", class_="stat-value stat-value--text")
                if winrate_value:
                    percentage = winrate_value.find("span").text.strip()
                    PLAYER["Win"] = percentage

            elif "kd" in stat.text.lower():
                kd = stat.find_next("span",class_="stat-value stat-value--text")
                if kd:
                    kd_val = kd.find("span").text.strip()
                    PLAYER["KDA"] = kd_val


        stats = section.find_all("span")

        for stat in stats:
                for k in r6_ranks:
                    
                    if k in stat.text:
                        PLAYER["Rank"] = stat.text  
                    
    
    get_ops_values(soup_ops)
    get_ops_side()
    atk,df = get_best_ops(OPS)
    PLAYER["Atk"] = atk
    PLAYER['Def'] = df
    return PLAYER





