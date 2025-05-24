import unicodedata
import requests
import random
import os

import urllib.parse

def get_rank_image(cdn_wrapped_url):
    save_folder='./FRONT/ranks'
    os.makedirs(save_folder, exist_ok=True)

    parts = cdn_wrapped_url.split('/')
    encoded_image_url = parts[-2] 

    real_image_url = urllib.parse.unquote(encoded_image_url)

    filename = os.path.basename(real_image_url)
    local_path = os.path.join(save_folder, filename)

    if os.path.exists(local_path):
        return local_path

    response = requests.get(real_image_url)
    if response.status_code == 200:
        with open(local_path, 'wb') as f:
            f.write(response.content)
        return local_path
    else:
        raise Exception(f'Failed to download image. Status code: {response.status_code}')




def get_best_ops(OPS):
    atk_nums = [0.0,0.0,0.0]
    atk_names = ["","",""]
    def_nums = [0.0,0.0,0.0]
    def_names = ["","",""]

    for op in OPS:
        print(atk_names,def_names)
        if op["Side"] == 'atk':
            if op['WR'] > atk_nums[0]:
                atk_names[2] = atk_names[1]
                atk_nums[2] = atk_nums[1]
                atk_names[1] = atk_names[0]
                atk_nums[1] = atk_nums[0]
                atk_names[0] = op["Name"]
                atk_nums[0] = op['WR']
            elif op['WR'] > atk_nums[1]:
                atk_names[2] = atk_names[1]
                atk_nums[2] = atk_nums[1]
                atk_names[1] = atk_names[0]
                atk_nums[1] = atk_nums[0]
                atk_names[1] = op["Name"]
                atk_nums[1] = op['WR']
            elif op['WR'] >= atk_nums[2]:
                atk_names[2] = op["Name"]
                atk_nums[2] = op['WR']
        else:
            if op['WR'] >= def_nums[0]:
                def_names[2] = def_names[1]
                def_nums[2] = def_nums[1]
                def_names[1] = def_names[0]
                def_nums[1] = def_nums[0]
                def_names[0] = op["Name"]
                def_nums[0] = op['WR']
            elif op['WR'] >= def_nums[1]:
                def_names[2] = def_names[1]
                def_nums[2] = def_nums[1]
                def_names[1] = def_names[0]
                def_nums[1] = def_nums[0]
                def_names[1] = op["Name"]
                def_nums[1] = op['WR']
            elif op['WR'] >= def_nums[2]:
                def_names[2] = op["Name"]
                def_nums[2] = op['WR']


    return atk_names,def_names
            
def get_all_vids(OPS):
    vids = []
    for op in OPS:
        vids.append(get_video(op))

    return vids

    
def get_video(keyword):
    print(keyword)
    keywords = ['rainbow six siege','r6','strat','guide','rainbowsix']
    keywords.append(keyword)
    keywords = ' '.join(keywords)

    url = 'https://www.googleapis.com/youtube/v3/search'
    params = {
        'part': 'snippet',
        'q': keywords,
        'type': 'video',
        'maxResults': 10,
        'key': "1"
    }

    response = requests.get(url, params=params)
    data = response.json()

    if 'items' not in data or len(data['items']) == 0:
        return None
    
    videos = data['items']
    random_video = random.choice(videos)
    video_id = random_video['id']['videoId']
    
    return video_id


def normalize(text):
    return unicodedata.normalize("NFKD",text).encode('ascii','ignore').decode('ascii')

def get_icons(atk,df):
    atk_icons = []
    def_icons = []

    a1,a2,a3 = atk
    d1,d2,d3 = df

    a1 = normalize(a1)
    a2 = normalize(a2)
    a3 = normalize(a3)
    d1 = normalize(d1)
    d2 = normalize(d2)
    d3 = normalize(d3)
    print(atk,df)
    a1 = "FRONT/icons/" + a1.lower() + ".png"
    a2 = "FRONT/icons/" + a2.lower() + ".png"
    a3 = "FRONT/icons/" + a3.lower() + ".png"
    d1 = "FRONT/icons/" + d1.lower() + ".png"
    d2 = "FRONT/icons/" + d2.lower() + ".png"
    d3 = "FRONT/icons/" + d3.lower() + ".png"

    atk_icons.append(a1)
    atk_icons.append(a2)
    atk_icons.append(a3)
    def_icons.append(d1)
    def_icons.append(d2)
    def_icons.append(d3)

    return atk_icons,def_icons
