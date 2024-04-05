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

#Preprocess file SVD
svd_preprocessor = SVD_Preprocessor()
preprocessor_context = PreprocessorContext(svd_preprocessor)
preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/surprisedir/data_preprocessed_matrix.csv')
preprocessor_context.prepare_feedback('algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/surprisedir/feedback_matrix.csv')
#Create SVD model and file info
svd_file_info = SVD_FileInfo(model_file='./algoritmi/surprisedir/trained_model.pkl', file_path="./algoritmi/surprisedir/data_preprocessed_matrix.csv", feedback_path="./algoritmi/surprisedir/feedback_matrix.csv", column_1='cod_cli', column_2='cod_art', column_3='rating')
svd_model = SVD_Model(file_info=svd_file_info)

# Preprocess file NN
nn_preprocessor = NN_Preprocessor()
preprocessor_context = PreprocessorContext(nn_preprocessor)
preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/ptwidedeep/data_preprocessed_NN.csv')
preprocessor_context.prepare_feedback('algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/ptwidedeep/feedback_NN.csv')
# Create NN model and file info
nn_file_info = NN_FileInfo("./algoritmi/ptwidedeep/model.pt", "./algoritmi/ptwidedeep/wd_model.pt", "./algoritmi/ptwidedeep/WidePreprocessor.pkl", "./algoritmi/ptwidedeep/TabPreprocessor.pkl", "./algoritmi/ptwidedeep/data_preprocessed_NN.csv", "./algoritmi/ptwidedeep/feedback_NN.csv", "./algoritmi/preprocessor/exported_csv/anacli.csv", "./algoritmi/preprocessor/exported_csv/anaart.csv")
nn_model = NN_Model(file_info=nn_file_info, epochs_n=5)

# Endpoint train
@app.route('/train/<method>')
def search_endpoint(method):
    try:
        if method == "SVD":
            preprocessor_context = PreprocessorContext(svd_preprocessor)
            preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/surprisedir/data_preprocessed_matrix.csv')
            preprocessor_context.prepare_feedback('algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/surprisedir/feedback_matrix.csv')
            
            svd_file_info = SVD_FileInfo(model_file='./algoritmi/surprisedir/trained_model.pkl', file_path="./algoritmi/surprisedir/data_preprocessed_matrix.csv", feedback_path="./algoritmi/surprisedir/feedback_matrix.csv", column_1='cod_cli', column_2='cod_art', column_3='rating')
            svd_model = SVD_Model(file_info=svd_file_info)
            
            os.remove('./algoritmi/surprisedir/trained_model.pkl')
            model_context = ModelContext(svd_model)
            model_context.train_model() 
            
        elif method == "NN":
            preprocessor_context = PreprocessorContext(nn_preprocessor)
            preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/ptwidedeep/data_preprocessed_NN.csv')
            preprocessor_context.prepare_feedback('algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/ptwidedeep/feedback_NN.csv')

            nn_file_info = NN_FileInfo("./algoritmi/ptwidedeep/model.pt", "./algoritmi/ptwidedeep/wd_model.pt", "./algoritmi/ptwidedeep/WidePreprocessor.pkl", "./algoritmi/ptwidedeep/TabPreprocessor.pkl", "./algoritmi/ptwidedeep/data_preprocessed_NN.csv", "./algoritmi/ptwidedeep/feedback_NN.csv", "./algoritmi/preprocessor/exported_csv/anacli.csv", "./algoritmi/preprocessor/exported_csv/anaart.csv")
            nn_model = NN_Model(file_info=nn_file_info, epochs_n=5)
            
            os.remove('./algoritmi/ptwidedeep/wd_model.pt')
            os.remove('./algoritmi/ptwidedeep/model.pt')
            model_context = ModelContext(nn_model)
            model_context.train_model() 
            
    except Exception as e:
        # Gestire eventuali errori
        return jsonify({'error': str(e)}), 500

# Endpoint search
@app.route('/search/<method>/<object>/<id>/<n>')
def search_endpoint(method, object, id, n):
    try:
        if method == "SVD":
            #Train model
            model_context = ModelContext(svd_model)
            model_context.train_model() 
        elif method == "NN":
            #Train model
            model_context = ModelContext(nn_model)
            model_context.train_model() 
        if object == "user": 
            dictionary = model_context.topN_1UserNItem(int(id), int(n))
            result_list = [{"id": str(uid), "value": int(est)} for uid, est in dictionary]
        elif object == "item":
            dictionary = model_context.topN_1ItemNUser(int(id), int(n))
            result_list = [{"id": str(iid), "value": int(est)} for iid, est in dictionary]
        else:
            return jsonify({'error': "Wrong object. Select user or item"}), 500

        return jsonify(result_list) 

    except Exception as e:
        # Gestire eventuali errori
        return jsonify({'error': str(e)}), 500

# Avviare il server Flask su tutte le interfacce su porta 4000
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000)
