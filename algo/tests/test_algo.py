import pytest
import requests
import os

from app import nn_model
from app import svd_model
from app import nn_operator
from app import svd_operator
from app import model_context
from app import ModelContext

def testSVD_top5_1UserNItem():
    user = 120
    n = 5
    
    model_context.set_model_info(svd_model)
    model_context.set_model_operator(svd_operator)
    model_context.train_model() 

    result = model_context.topN_1UserNItem(user, n)

    assert len(result) == n
    assert all(isinstance(item, tuple) and len(item) == 2 and isinstance(item[0], int) and isinstance(item[1], int) for item in result)
    assert all(1 <= item[1] <= 5 for item in result)
    
def testNN_top5_1UserNItem():
    user = 120
    n = 5
    
    model_context.set_model_info(nn_model)
    model_context.set_model_operator(nn_operator)
    model_context.train_model() 

    result = model_context.topN_1UserNItem(user, n)

    assert len(result) == n
    assert all(isinstance(item, tuple) and len(item) == 2 and isinstance(item[0], int) and isinstance(item[1], float) for item in result)
    assert all(1 <= item[1] <= 5 for item in result)

@pytest.fixture
def api_url():
    hostname = os.getenv("ALGO_URL", "localhost")
    return "http://" + hostname + ":4000"

def test_api_response_svd(api_url):
    response = requests.get(api_url + "/search/SVD/user/120/5")

    assert response.status_code == 200

    response_data = response.json()
    assert isinstance(response_data, list)

    for item in response_data:
        assert isinstance(item, dict)
        assert "id" in item and isinstance(item["id"], str)
        assert "value" in item and isinstance(item["value"], int)
        
        
def test_api_response_nn(api_url):
    response = requests.get(api_url + "/search/NN/user/120/5")

    assert response.status_code == 200

    response_data = response.json()
    assert isinstance(response_data, list)

    for item in response_data:
        assert isinstance(item, dict)
        assert "id" in item and isinstance(item["id"], str)
        assert "value" in item and isinstance(item["value"], int)