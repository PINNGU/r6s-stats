from .stats import get_all_stats,get_teammates,get_matches,get_ops
from .optimizator import get_all_vids


class Service:

    def __init__(self):
        self.stats = {}

    def get_stats(self,name):
        return get_all_stats(name)
    
    def get_ops(self,name):
        return get_ops(name)
    
    def get_matches(self,name):
        return get_matches(name)
    
    def get_teammates(self,name):
        return get_teammates(name)
    
    def get_all_vids(self):
        ops = []
        ops.extend(self.stats["Atk"])
        ops.extend(self.stats["Def"])
        print(ops)

        return get_all_vids(ops)


