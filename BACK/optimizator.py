

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