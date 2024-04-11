from abc import ABC, abstractmethod
import pandas as pd

class BaseFileInfo(ABC):
    def __init__(self, model_file):
        self.model_file = model_file

    @abstractmethod
    def load_data(self):
        pass
    
class BaseModel(ABC):
    @abstractmethod
    def load_model(self):
        pass

    @abstractmethod
    def save_model(self):
        pass

    @abstractmethod
    def train_model(self):
        pass

class BaseOperator(ABC):
    def __init__(self, model):
        self.modelOp = model
        
    def start(self):
        self.modelOp.train_model()
        
    @abstractmethod
    def ratings_float2int(self, float_ratings, float_ratingMax = 2, float_ratingMin = 0, int_ratingMax = 5, int_ratingMin = 1):
        pass
    
    @abstractmethod
    def topN_1UserNItem(self, user_id, n=5):
        pass

    @abstractmethod
    def topN_1ItemNUser(self, item_id, n=5):
        pass

    
class ModelContext:
    def __init__(self, model_info):
        self.model_info = model_info

    def set_model_info(self, model_info):
        self.model_info = model_info

    def process_data(self, data):
        self.model_info.load_data(data)

    def load_model(self):
        return self.model_info.load_model()

    def save_model(self):
        return self.model_info.save_model()

    def train_model(self):
        return self.model_info.train_model()
    
    def ratings_float2int(self, float_ratings, float_ratingMax=2, float_ratingMin=0, int_ratingMax=5, int_ratingMin=1):
        return self.model_info.ratings_float2int(float_ratings, float_ratingMax, float_ratingMin, int_ratingMax, int_ratingMin)

    def topN_1UserNItem(self, user_id, n=5):
        return self.model_info.topN_1UserNItem(user_id, n)

    def topN_1ItemNUser(self, item_id, n=5):
        return self.model_info.topN_1ItemNUser(item_id, n)