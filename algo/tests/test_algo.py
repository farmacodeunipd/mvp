import pytest
import requests
from ai_classes import Model, FileInfo

model = Model(file_info=FileInfo(model_file='trained_model.pkl', file_path="output_file.csv", column_1='cod_cli', column_2='cod_art', column_3='qta_ordinata'))
model.train_model()

def test_top5_1UserNItem():
    user = 120
    n = 5


    result = model.topN_1UserNItem(user, n)

    assert len(result) == n
    assert all(isinstance(item, tuple) and len(item) == 2 and isinstance(item[0], int) and isinstance(item[1], int) for item in result)
    assert all(1 <= item[1] <= 5 for item in result)


@pytest.fixture
def api_url():
    return "http://localhost:4000"

def test_api_response(api_url):
    response = requests.get(api_url + "/search/user/120/5")

    assert response.status_code == 200

    response_data = response.json()
    assert isinstance(response_data, list)

    for item in response_data:
        assert isinstance(item, dict)
        assert "id" in item and isinstance(item["id"], str)
        assert "value" in item and isinstance(item["value"], int)