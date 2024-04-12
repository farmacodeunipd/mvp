from flask import Flask, jsonify
from flask_cors import CORS
from threading import Lock
import os
import logging

from algoritmi.preprocessor.data_preprocessor import PreprocessorContext, SVD_Preprocessor, NN_Preprocessor
from algoritmi.surprisedir.Matrix import SVD_FileInfo, SVD_Model, SVD_Operator
from algoritmi.ptwidedeep.NN2 import NN_FileInfo, NN_Model, NN_Operator
from algoritmi.Algo import ModelContext

# Configure logging
logging.basicConfig(level=logging.DEBUG)  # Set the logging level to DEBUG

# Create a logger
logger = logging.getLogger(__name__)

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

# def preprocess_feedback_nn(nn_operator):
#     print("Preparing NN's files...")
#     preprocessor_context.process_file('algoritmi/preprocessor/exported_csv/ordclidet.csv', 'algoritmi/ptwidedeep/data_preprocessed_NN.csv')
#     preprocessor_context.prepare_feedback('algoritmi/preprocessor/exported_csv/ordclidet_feedback.csv', 'algoritmi/ptwidedeep/feedback_NN.csv')
#     nn_operator.set_feedback_path('algoritmi/ptwidedeep/feedback_NN.csv')
#     return nn_operator

app = Flask(__name__)
CORS(app)

training_lock = Lock()  # Create a lock for synchronization
training_in_progress = False  # Flag to indicate if training is in progress

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

# Endpoint train
@app.route('/train/<algo>')
def train_endpoint(algo):
    global training_in_progress
    try:
        logger.debug("Received request to train algorithm: %s", algo)
        with training_lock:
            if training_in_progress:
                return jsonify({'message': 'Training in progress. Please wait a few minutes and try again later.'}), 200

            training_in_progress = True
        
        logger.debug("Starting training for algorithm: %s", algo)
        if algo == "SVD":
            preprocessor_context.set_preprocessor(svd_preprocessor)
            svd_model, svd_operator = preprocess_svd()
            os.remove('./algoritmi/surprisedir/trained_model.pkl')
            model_context.set_model_info(svd_model)
            model_context.set_model_operator(svd_operator)
            model_context.train_model() 
            
        if algo == "NN":
            preprocessor_context.set_preprocessor(nn_preprocessor)
            nn_model, nn_operator = preprocess_nn()
            os.remove('./algoritmi/ptwidedeep/model.pt')
            model_context.set_model_info(nn_model)
            model_context.set_model_operator(nn_operator)
            model_context.train_model() 
        
        training_in_progress = False
        response_data = {'message': 'Training successful', 'algo': algo}
        return jsonify(response_data), 200
            
    except Exception as e:
        training_in_progress = False
        logger.error("An error occurred during training: %s", e)
        return jsonify({'error': str(e)}), 500

# Endpoint search
@app.route('/search/<algo>/<object>/<id>/<n>')
def search_endpoint(algo, object, id, n):
    try:
        if training_in_progress:
            return jsonify({'message': 'Training in progress. Please wait a few minutes and try again later.'}), 200
        if algo == "SVD":
            preprocessor_context.set_preprocessor(svd_preprocessor)
            svd_model, svd_operator = preprocess_svd()
            model_context.set_model_info(svd_model)
            model_context.set_model_operator(svd_operator)
            
        elif algo == "NN":
            preprocessor_context.set_preprocessor(nn_preprocessor)
            nn_model, nn_operator = preprocess_nn()
            model_context.set_model_info(nn_model)
            model_context.set_model_operator(nn_operator)
            
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
