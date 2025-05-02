
def get_best_ops(OPS):
    atk_nums = [0.0,0.0]
    atk_names = ["",""]
    def_nums = [0.0,0.0]
    def_names = ["",""]

    for op in OPS:
        if op["Side"] == 'atk':
            if op['WR'] > atk_nums[0]:
                atk_names[0] = op["Name"]
                atk_nums[0] = op['WR']
            elif op['WR'] > atk_nums[1]:
                atk_names[1] = op["Name"]
                atk_nums[1] = op['WR']
        else:
            if op['WR'] > def_nums[0]:
                def_names[0] = op["Name"]
                def_nums[0] = op['WR']
            elif op['WR'] > def_nums[1]:
                def_names[1] = op["Name"]
                def_nums[1] = op['WR']

    return atk_names,def_names
            
def get_yt_tips(OPS):
    pass

def get_icons(atk,df):
    atk_icons = []
    def_icons = []

    a1,a2 = atk
    d1,d2 = df

    a1 = "FRONT/icons/" + a1.lower() + ".png"
    a2 = "FRONT/icons/" + a2.lower() + ".png"
    d1 = "FRONT/icons/" + d1.lower() + ".png"
    d2 = "FRONT/icons/" + d2.lower() + ".png"

    atk_icons.append(a1)
    atk_icons.append(a2)
    def_icons.append(d1)
    def_icons.append(d2)

    return atk_icons,def_icons
