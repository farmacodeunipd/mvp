from flask import Flask, jsonify
from flask_cors import CORS
from ai_classes import Model, FileInfo

app = Flask(__name__)
CORS(app)

model = Model(file_info=FileInfo(model_file='trained_model.pkl', file_path="output_file.csv", column_1='cod_cli', column_2='cod_art', column_3='qta_ordinata'))
model.train_model()

# Endpoint per la comunicazione con l'algoritmo
@app.route('/search/<object>/<id>/<n>')
def search_endpoint(object, id, n):
    try:
        if object == "user": 
            dictionary = model.topN_1UserNItem(int(id), int(n))
            result_list = [{"id": str(uid), "value": int(est)} for uid, est in dictionary]
        elif object == "item":
            dictionary = model.topN_1ItemNUser(int(id), int(n))
            result_list = [{"id": str(uid), "value": int(est)} for uid, est in dictionary]
        else:
            return jsonify({'error': "Wrong object. Select user or item"}), 500

        return jsonify(result_list) 

    except Exception as e:
        # Gestire eventuali errori
        return jsonify({'error': str(e)}), 500

# Avviare il server Flask su tutte le interfacce su porta 4000
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000)
