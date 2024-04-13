import pytest
import requests
import os
import threading


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

def testSVDModel_load_model():
    svd_model.load_model()
    assert svd_model.model is not None

def testSVDModel_save_model():
    svd_model.save_model()
    assert os.path.exists(svd_model.file_info.model_file)

def testSVDModel_train_model():
    svd_model.train_model()
    assert svd_model.model is not None
    assert svd_model.trainset is not None
    assert svd_model.testset is not None

def testSVDOperator_ratings_float2int():
    assert svd_operator.ratings_float2int(0.5) == 2
    assert svd_operator.ratings_float2int(1.5) == 4
    assert svd_operator.ratings_float2int(2.0) == 5
    
def testSVDOperator_apply_feedback_user():
    ratings = {1: 4, 2: 3, 3: 5}
    updated_ratings = svd_operator.apply_feedback("user", 1, ratings)
    assert updated_ratings == {1: 4, 2: 3, 3: 5}

def testSVDOperator_apply_feedback_item():
    ratings = {1: 4, 2: 3, 3: 5}
    updated_ratings = svd_operator.apply_feedback("item", 2, ratings)
    assert updated_ratings == {1: 4, 2: 3, 3: 5}

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
    
def testNNModel_load_model():
    nn_model.load_model()
    assert nn_model.model is not None
    assert nn_model.wide_preprocessor is not None
    assert nn_model.tab_preprocessor is not None
    
def testNNModel_load_model_not_existing():
    os.remove(nn_model.file_info.model_file)
    nn_model.load_model()
    assert nn_model.model is not None
    assert nn_model.wide_preprocessor is not None
    assert nn_model.tab_preprocessor is not None

def testNNModel_save_model():
    nn_model.save_model()
    assert os.path.exists(nn_model.file_info.model_state_file)
    assert os.path.exists(nn_model.file_info.model_file)
    assert os.path.exists(nn_model.file_info.wide_preprocessor_file)
    assert os.path.exists(nn_model.file_info.tab_preprocessor_file)

def testNNModel_train_model():
    nn_model.train_model()
    assert nn_model.model is not None
    assert nn_model.wide_preprocessor is not None
    assert nn_model.tab_preprocessor is not None

def testNNOperator_ratings_float2int():
    float_ratings = [0.5, 1.5, 2.0]
    result = nn_operator.ratings_float2int(float_ratings)
    assert result == [4.0, 2.0, 1.0]

def testNNOperator_apply_feedback_user():
    ratings = [(1, 4), (2, 3), (3, 5)]
    updated_ratings = nn_operator.apply_feedback("user", 1, ratings)
    assert updated_ratings == [(1, 4), (2, 3), (3, 5)]

def testNNOperator_apply_feedback_item():
    ratings = [(1, 4), (2, 3), (3, 5)]
    updated_ratings = nn_operator.apply_feedback("item", 2, ratings)
    assert updated_ratings == [(1, 4), (2, 3), (3, 5)]
    
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
    
    model_context.set_model_info(nn_model)
    model_context.set_model_operator(nn_operator)
    model_context.train_model() 

    result = model_context.topN_1ItemNUser(item, n)

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
    
def test_train_api_response_training(api_url):
    def make_training_request():
        return requests.get(api_url + "/train/SVD")
    
    def make_search_request():
        response = requests.get(api_url + "/search/SVD/user/120/5")
        assert response.status_code == 200
        assert response.json()['message'] == 'Training in progress. Please wait a few minutes and try again later.'

    thread1 = threading.Thread(target=make_training_request)
    
    thread2 = threading.Thread(target=make_search_request)

    thread1.start()
    thread2.start()
    
    thread2.join()
    thread1.join()
    
def test_train_api_response_wrong(api_url):
    response = requests.get(api_url + "/train/wrong")

    assert response.status_code == 500
    assert response.json()['error'] == 'Wrong algo. Select SVD or NN'
    
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
            
def test_search_api_response_wrong_object(api_url):
    response = requests.get(api_url + "/search/SVD/wrong/1101100/5")

    assert response.status_code == 500
    assert response.json()['error'] == 'Wrong object. Select user or item'
    
def test_search_api_response_wrong_algo(api_url):
    response = requests.get(api_url + "/search/wrong/item/1101100/5")

    assert response.status_code == 500
    assert response.json()['error'] == 'Wrong algo. Select SVD or NN'