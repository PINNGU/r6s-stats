from scraper import scraper_player,scraper_mates,scraper_matches
from optimizator import get_best_ops,get_icons,get_rank_image
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
    "Capitão": "atk",
    "Finka": "atk",
    "Glaz": "atk",
    "Iana": "atk",
    "IQ": "atk",
    "Lion": "atk",
    "Maverick": "atk",
    "Montagne": "atk",
    "Nøkk": "atk",
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
    "Gridlock":"atk",
    "Dokkaebi":"atk",
    "Ying": "atk",
    "Jackal":"atk",
    "Hibana":"atk",
    "Thatcher":"atk",
    "Thermite":"atk",
    "Fuze":"atk",



    "Alibi": "def",
    "Aruni": "def",
    "Bandit": "def",
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
    "Jäger": "def",
    "Skopós" : "def",
    "Sentry" : "def",
    "Tubarão" : "def",
    "Fenrir" : "def",
    "Solis" : "def",
    "Azami" : "def",
    "Thunderbird" : "def",
    "Mozzie": "def",
    "Vigil" : "def",
    "Ela" : "def",
    "Caveira" : "def",
    

}



OP = {
    "Name":"",
    "WR":0.0,
    "Side":""
}

OPS = []




def get_player():
    pass


def get_matches(player):
    soup = scraper_matches(player)
    body = soup.find('body')
    divs = body.find_all('div',class_="match-row")

    matches_mmr = []
    matches = []
    for div in divs:
        matchstats = div.find_all("span")
        for match in matchstats:
            if "+" in match.text or "-" in match.text:
                matches_mmr.append(match.text)

        classes = div.get('class',[])
        if any('match-row--loss' in cls for cls in classes):
            matches.append("L")
        elif any('match-row--win' in cls for cls in classes):
            matches.append("W")
        elif any('match-row--rollback' in cls for cls in classes):
            matches.append("R")
    
    
    return matches[:15],matches_mmr[:15]



def get_ops_values(soup):
    OPS.clear()
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
    MATES = [
    {
        "Name":"",
        "Rank":"",
        "RankColor":"",
        "Win":None
    },
    {
        "Name":"",
        "Rank":"",
        "RankColor":"",
        "Win":None
    },
    {
        "Name":"",
        "Rank":"",
        "RankColor":"",
        "Win":None
    },
    {
        "Name":"",
        "Rank":"",
        "RankColor":"",
        "Win":None
    },

    ]
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

            if name:
                MATES[counter]["Name"] = name
            if winrate:
                MATES[counter]["Win"] = str(winrate) + "% WR"
            if image:
                MATES[counter]["Rank"] = image

                for k in r6_ranks:
                    if k.lower() in MATES[counter]["Rank"].lower():
                        MATES[counter]["RankColor"] = k.lower()

            counter = counter + 1
        else:
            break

    print(MATES)
    return MATES




def get_all_stats(player):
    PLAYER = {
            "Name":"",
            "Rank":"",
            "RankColor":"",
            "RankImg":"",
            "MMR":0.0,
            "Win":0.0,
            "KDA":0.0,
            "Matches":0,
            "Kills/Game":0.0,
            "Atk":["","",""],
            "Def":["","",""],
            "Playtime":0.0,
            "AtkImg":[],
            "DefImg" :[] 
        }
    PLAYER["Name"] = player
    soup_basic,soup_ops = scraper_player(player)

    rank_image = soup_basic.select_one('img.rank-image')
    print(rank_image['src'])
    PLAYER["RankImg"] = get_rank_image(rank_image['src'])

    sections = soup_basic.find_all("section",class_="overview")
    for section in sections:
        spans = section.find_all("span")
        for span in spans:
           if "playtime" in span.text.lower():
                pt = span.find_next("span")
                PLAYER["Playtime"] = pt.text


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

            elif "matches" in stat.next.lower():
                matches = stat.find_next("span",class_="stat-value stat-value--text")
                if matches:
                    matches = matches.find("span").text.strip()
                    PLAYER["Matches"] = matches

            elif "kills/game" in stat.next.lower():
                kills = stat.find_next("span",class_="stat-value stat-value--text")
                if kills:
                    kills = kills.find("span").text.strip()
                    PLAYER["Kills/Game"] = kills
            

        stats = section.find_all("span")

        for stat in stats:
                for k in r6_ranks:
                    
                    if k in stat.text:
                        mmr = stat.find_next("span").text.strip()
                        mmr = mmr.replace("RP","")
                        print(mmr)
                        PLAYER["MMR"] = mmr
                        PLAYER["Rank"] = stat.text
                        PLAYER["RankColor"] = k.lower()
              
    
    get_ops_values(soup_ops)
    get_ops_side()
    atk,df = get_best_ops(OPS)
    PLAYER["Atk"] = atk
    PLAYER['Def'] = df
    atk,df = get_icons(atk,df)
    PLAYER["AtkImg"] = atk
    PLAYER["DefImg"] = df

    return PLAYER





