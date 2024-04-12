import pytest
import requests
import os
import threading

from app import nn_model
from app import svd_model
from app import nn_operator
from app import svd_operator
from app import model_context

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

def test_train_api_response_svd(api_url):
    response = requests.get(api_url + "/train/SVD")

    assert response.status_code == 200
    assert response.json()['message'] == 'Training successful'
    assert response.json()['algo'] == 'SVD'
    
def test_train_api_response_nn(api_url):
    response = requests.get(api_url + "/train/NN")

    assert response.status_code == 200
    assert response.json()['message'] == 'Training successful'
    assert response.json()['algo'] == 'NN'
    
def test_train_api_response_already_training(api_url):
    def make_training_request():
        return requests.get(api_url + "/train/SVD")
    
    def make_second_training_request():
        response = make_training_request()
        assert response.status_code == 200
        assert response.json()['message'] == 'Training in progress. Please wait a few minutes and try again later.'

    thread1 = threading.Thread(target=make_training_request)
    
    thread2 = threading.Thread(target=make_second_training_request)

    thread1.start()
    thread2.start()
    
    thread2.join()
    thread1.join()
    
def test_search_api_response_svd_user(api_url):
    response = requests.get(api_url + "/search/SVD/user/120/5")

    assert response.status_code == 200

    response_data = response.json()
    assert isinstance(response_data, list)

    for item in response_data:
        assert isinstance(item, dict)
        assert "id" in item and isinstance(item["id"], str)
        assert "value" in item and isinstance(item["value"], int)
        
def test_search_api_response_svd_item(api_url):
    response = requests.get(api_url + "/search/SVD/item/1101100/5")

    assert response.status_code == 200

    response_data = response.json()
    assert isinstance(response_data, list)

    for item in response_data:
        assert isinstance(item, dict)
        assert "id" in item and isinstance(item["id"], str)
        assert "value" in item and isinstance(item["value"], int)
        
        
def test_search_api_response_nn_user(api_url):
    response = requests.get(api_url + "/search/NN/user/120/5")

    assert response.status_code == 200

    response_data = response.json()
    assert isinstance(response_data, list)

    for item in response_data:
        assert isinstance(item, dict)
        assert "id" in item and isinstance(item["id"], str)
        assert "value" in item and isinstance(item["value"], int)
        
def test_search_api_response_nn_item(api_url):
    response = requests.get(api_url + "/search/NN/item/1101100/5")

    assert response.status_code == 200

    response_data = response.json()
    assert isinstance(response_data, list)

    for item in response_data:
        assert isinstance(item, dict)
        assert "id" in item and isinstance(item["id"], str)
        assert "value" in item and isinstance(item["value"], int)