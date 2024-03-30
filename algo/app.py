from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import os

from algoritmi.preprocessor.data_preprocessor import PreprocessorContext, SVD_Preprocessor, NN_Preprocessor
from algoritmi.surprisedir.Matrix import SVD_FileInfo, SVD_Model
from algoritmi.ptwidedeep.NN2 import NN_FileInfo, NN_Model
from algoritmi.Algo import ModelContext

app = Flask(__name__)
CORS(app)

# Preprocessor

#Preprocess file SVD
preprocessor_context = PreprocessorContext(SVD_Preprocessor())
preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/surprisedir/data_preprocessed_matrix.csv')

# Preprocess file NN
preprocessor_context = PreprocessorContext(NN_Preprocessor())
preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/ptwidedeep/data_preprocessed_NN.csv')

# SVD
# svd_file_info = SVD_FileInfo(model_file='./algoritmi/surprisedir/trained_model.pkl', file_path="./algoritmi/surprisedir/data_preprocessed_matrix.csv", column_1='cod_cli', column_2='cod_art', column_3='rating')
# svd_model = SVD_Model(file_info=svd_file_info)

# NN
nn_file_info = NN_FileInfo("./algoritmi/ptwidedeep/model.pt", "./algoritmi/ptwidedeep/wd_model.pt", "./algoritmi/ptwidedeep/WidePreprocessor.pkl", "./algoritmi/ptwidedeep/TabPreprocessor.pkl", "./algoritmi/ptwidedeep/data_preprocessed_NN.csv", "./algoritmi/preprocessor/exported_csv/anacli.csv", "./algoritmi/preprocessor/exported_csv/anaart.csv")
nn_model = NN_Model(file_info=nn_file_info, epochs_n=5)

# NN
model_context = ModelContext(nn_model)
model_context.train_model()

# Endpoint per la comunicazione con l'algoritmo
@app.route('/search/<object>/<id>/<n>')
def search_endpoint(object, id, n):
    try:
        if object == "user": 
            dictionary = model_context.topN_1UserNItem(int(id), int(n))
            result_list = [{"id": str(uid), "value": int(est)} for uid, est in dictionary]
        elif object == "item":
            dictionary = model_context.topN_1ItemNUser(int(id), int(n))
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
