import pytest
import requests
import os
import threading
from unittest.mock import MagicMock, patch

from algoritmi.preprocessor.data_preprocessor import PreprocessorContext, SVD_Preprocessor, NN_Preprocessor
from algoritmi.surprisedir.Matrix import SVD_FileInfo, SVD_Model, SVD_Operator
from algoritmi.ptwidedeep.NN2 import NN_FileInfo, NN_Model, NN_Operator
from algoritmi.Algo import ModelContext

# Preprocess file SVD
def preprocess_svd():
    print("Preparing SVD's files...")
    preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/surprisedir/data_preprocessed_matrix.csv')
    svd_file_info = SVD_FileInfo(model_file='./algoritmi/surprisedir/trained_model.pkl', file_path="./algoritmi/surprisedir/data_preprocessed_matrix.csv", column_1='cod_cli', column_2='cod_art', column_3='rating')
    svd_model = SVD_Model(file_info=svd_file_info)
    preprocessor_context.prepare_feedback('algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/surprisedir/feedback_matrix.csv')
    svd_operator = SVD_Operator(svd_model, 'algoritmi/surprisedir/feedback_matrix.csv')
    return svd_model, svd_operator

# Preprocess file NN
def preprocess_nn():
    print("Preparing NN's files...")
    preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/ptwidedeep/data_preprocessed_NN.csv')
    nn_file_info = NN_FileInfo("./algoritmi/ptwidedeep/model.pt", "./algoritmi/ptwidedeep/wd_model.pt", "./algoritmi/ptwidedeep/WidePreprocessor.pkl", "./algoritmi/ptwidedeep/TabPreprocessor.pkl", "./algoritmi/ptwidedeep/data_preprocessed_NN.csv", "./algoritmi/preprocessor/exported_csv/anacli.csv", "./algoritmi/preprocessor/exported_csv/anaart.csv")
    nn_model = NN_Model(file_info=nn_file_info, epochs_n=5)
    preprocessor_context.prepare_feedback('algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/ptwidedeep/feedback_NN.csv')
    nn_operator = NN_Operator(nn_model, 'algoritmi/ptwidedeep/feedback_NN.csv')
    return nn_model, nn_operator

preprocessor_context = PreprocessorContext()

#Init SVD
svd_preprocessor = SVD_Preprocessor()
preprocessor_context.set_preprocessor(svd_preprocessor)
svd_model, svd_operator = preprocess_svd()

#Init NN
nn_preprocessor = NN_Preprocessor()
preprocessor_context.set_preprocessor(nn_preprocessor)
nn_model, nn_operator = preprocess_nn()

model_context = ModelContext()

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
    
def testSVD_top5_1ItemNUser():
    item = 1101100
    n = 5
    
    model_context.set_model_info(svd_model)
    model_context.set_model_operator(svd_operator)
    model_context.train_model() 

    result = model_context.topN_1ItemNUser(item, n)

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

def testNN_top5_1ItemNUser():
    item = 1101100
    n = 5
    
    model_context.set_model_info(svd_model)
    model_context.set_model_operator(svd_operator)
    model_context.train_model() 

    result = model_context.topN_1ItemNUser(item, n)

    assert len(result) == n
    assert all(isinstance(item, tuple) and len(item) == 2 and isinstance(item[0], int) and isinstance(item[1], int) for item in result)
    assert all(1 <= item[1] <= 5 for item in result)
    
@pytest.fixture
def api_url():
    hostname = os.getenv("ALGO_URL", "localhost")
    return "http://" + hostname + ":4000"

def test_train_api_response_svd(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'message': 'Training successful', 'algo': 'SVD'}
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/train/SVD")

        assert response.status_code == 200
        assert response.json()['message'] == 'Training successful'
        assert response.json()['algo'] == 'SVD'

        mock_get.assert_called_once_with(api_url + "/train/SVD")
    
def test_train_api_response_nn(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'message': 'Training successful', 'algo': 'NN'}
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/train/NN")

        assert response.status_code == 200
        assert response.json()['message'] == 'Training successful'
        assert response.json()['algo'] == 'NN'

        mock_get.assert_called_once_with(api_url + "/train/NN")

def test_train_api_response_already_training(api_url):
    with patch('requests.get') as mock_get:
        def make_training_request():
            return requests.get(api_url + "/train/SVD")
        
        def make_second_training_request():
            response = make_training_request()
            assert response.status_code == 200
            assert response.json()['message'] == 'Training in progress. Please wait a few minutes and try again later.'

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'message': 'Training in progress. Please wait a few minutes and try again later.'}
        mock_get.side_effect = [mock_response, mock_response]

        thread1 = threading.Thread(target=make_training_request)
        thread2 = threading.Thread(target=make_second_training_request)

        thread1.start()
        thread2.start()
        
        thread2.join()
        thread1.join()
    
def test_train_api_response_wrong(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.json.return_value = {'error': 'Wrong algo. Select SVD or NN'}
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/train/wrong")

        assert response.status_code == 500
        assert response.json()['error'] == 'Wrong algo. Select SVD or NN'

        mock_get.assert_called_once_with(api_url + "/train/wrong")
    
def test_search_api_response_svd_user(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{"id": "123", "value": 5}, {"id": "456", "value": 4}]
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/search/SVD/user/120/5")

        assert response.status_code == 200

        response_data = response.json()
        assert isinstance(response_data, list)
        assert len(response_data) == 2

        for item in response_data:
            assert isinstance(item, dict)
            assert "id" in item and isinstance(item["id"], str)
            assert "value" in item and isinstance(item["value"], int)

        mock_get.assert_called_once_with(api_url + "/search/SVD/user/120/5")
        
def test_search_api_response_svd_item(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{"id": "1101100", "value": 5}, {"id": "1101101", "value": 4}]
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/search/SVD/item/1101100/5")

        assert response.status_code == 200

        response_data = response.json()
        assert isinstance(response_data, list)
        assert len(response_data) == 2

        for item in response_data:
            assert isinstance(item, dict)
            assert "id" in item and isinstance(item["id"], str)
            assert "value" in item and isinstance(item["value"], int)

        mock_get.assert_called_once_with(api_url + "/search/SVD/item/1101100/5")

def test_search_api_response_nn_user(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{"id": "123", "value": 5}, {"id": "456", "value": 4}]
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/search/NN/user/120/5")

        assert response.status_code == 200

        response_data = response.json()
        assert isinstance(response_data, list)
        assert len(response_data) == 2

        for item in response_data:
            assert isinstance(item, dict)
            assert "id" in item and isinstance(item["id"], str)
            assert "value" in item and isinstance(item["value"], int)

        mock_get.assert_called_once_with(api_url + "/search/NN/user/120/5")

def test_search_api_response_nn_item(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{"id": "1101100", "value": 5}, {"id": "1101101", "value": 4}]
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/search/NN/item/1101100/5")

        assert response.status_code == 200

        response_data = response.json()
        assert isinstance(response_data, list)
        assert len(response_data) == 2

        for item in response_data:
            assert isinstance(item, dict)
            assert "id" in item and isinstance(item["id"], str)
            assert "value" in item and isinstance(item["value"], int)

        mock_get.assert_called_once_with(api_url + "/search/NN/item/1101100/5")

def test_search_api_response_wrong_algo(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.json.return_value = {'error': 'Wrong algo. Select SVD or NN'}
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/search/wrong/item/1101100/5")

        assert response.status_code == 500
        assert response.json()['error'] == 'Wrong algo. Select SVD or NN'

        mock_get.assert_called_once_with(api_url + "/search/wrong/item/1101100/5")

def test_search_api_response_wrong_object(api_url):
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.json.return_value = {'error': 'Wrong object. Select user or item'}
        mock_get.return_value = mock_response

        response = requests.get(api_url + "/search/SVD/wrong/1101100/5")

        assert response.status_code == 500
        assert response.json()['error'] == 'Wrong object. Select user or item'

        mock_get.assert_called_once_with(api_url + "/search/SVD/wrong/1101100/5")
