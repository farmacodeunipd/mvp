import pytest
import requests
import os
#forse è bene testare anche il preprocessor?
from algoritmi.preprocessor.data_preprocessor import NN_Preprocessor

# from algoritmi.surprisedir.Matrix import SVD_FileInfo, SVD_Model
from algoritmi.ptwidedeep.NN2 import NN_FileInfo, NN_Model

file_infos = NN_FileInfo("algoritmi/ptwidedeep/model.pt", "algoritmi/ptwidedeep/wd_model.pt", "algoritmi/ptwidedeep/WidePreprocessor.pkl", "algoritmi/ptwidedeep/TabPreprocessor.pkl", "algoritmi/ptwidedeep/data_preprocessed_NN.csv", "algoritmi/preprocessor/exported_csv/anacli.csv", "algoritmi/preprocessor/exported_csv/anaart.csv")
model = NN_Model(file_infos, epochs_n=5)
model.train_model()

def test_top5_1UserNItem():
    user = 120
    n = 5


    result = model.topN_1UserNItem(user, n)

    assert len(result) == n
    assert all(isinstance(item, tuple) and len(item) == 2 and isinstance(item[0], int) and isinstance(item[1], float) for item in result)
    assert all(1 <= item[1] <= 5 for item in result)


@pytest.fixture
def api_url():
    hostname = os.getenv("ALGO_API_URL", "localhost")
    return "http://" + hostname + ":4000"

def test_api_response(api_url):
    response = requests.get(api_url + "/search/user/120/5")

    assert response.status_code == 200

    response_data = response.json()
    assert isinstance(response_data, list)

    for item in response_data:
        assert isinstance(item, dict)
        assert "id" in item and isinstance(item["id"], str)
        assert "value" in item and isinstance(item["value"], int)
