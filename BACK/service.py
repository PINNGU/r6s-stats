from stats import get_all_stats,get_teammates


class Service:

    def __init__(self):
        pass

    def get_stats(self,name):
        return get_all_stats(name)
    
    def get_teammates(self,name):
        return get_teammates(name)
