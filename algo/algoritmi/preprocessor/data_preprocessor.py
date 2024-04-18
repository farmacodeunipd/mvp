from abc import ABC, abstractmethod
import pandas as pd
import numpy as np
import csv
import os
import mysql.connector
from algoritmi.surprisedir.Matrix import SVD_FileInfo
from algoritmi.ptwidedeep.NN2 import NN_FileInfo

class Preprocessor(ABC):
    tables_to_export = []
    
    def retrieve_file(self, cursor, table_name, csv_path):
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        csv_file = os.path.join(csv_path, f"{table_name}.csv")
        with open(csv_file, 'w', newline='') as csvfile:  # Open with 'w' mode
            csv_writer = csv.writer(csvfile)
            # Write header
            csv_writer.writerow([description[0] for description in cursor.description])
            if rows:
                # Write rows
                csv_writer.writerows(rows)
                print(f"Table '{table_name}' exported to '{csv_file}'")
            else:
                print(f"No data found in table '{table_name}', but header written to '{csv_file}'")
            
    @abstractmethod
    def process_file(self, input_file_og, output_file):
        pass
    
    @abstractmethod
    def prepare_feedback(self, input_file_og, output_file):
        pass

class SVD_Preprocessor(Preprocessor):
    tables_to_export = ['ordclidet_feedback', 'ordclidet']
    
    def process_file(self, input_file_og, output_file):
        df1 = pd.read_csv(input_file_og, delimiter=',', thousands=',', decimal='.')        
        # Group by 'cod_cli' and 'cod_art', summing the 'qta_ordinata' values and considering 'check_value' True if any value is True
        grouped_df = df1.groupby(['cod_cli', 'cod_art'], as_index=False).agg({'qta_ordinata': 'sum'})
            
        # Multiply the original quantity by the logarithm
        grouped_df['qta_ordinata'] = np.log10(grouped_df['qta_ordinata'])
        # Cap the final value at 2 & et minimum value at 0.0001
        grouped_df['qta_ordinata'] = np.minimum(grouped_df['qta_ordinata'], 2)
        grouped_df['qta_ordinata'] = np.maximum(grouped_df['qta_ordinata'], 0.0001)
        # Round the values in 'qta_ordinata' to 4 decimal places & convert 'qta_ordinata' column to string
        grouped_df['qta_ordinata'] = grouped_df['qta_ordinata'].round(4)
        grouped_df['qta_ordinata'] = grouped_df['qta_ordinata'].astype(str)
        # Rename the column from 'qta_ordinata' to 'rating'
        grouped_df = grouped_df.rename(columns={'qta_ordinata': 'rating'})
        
        # Save the result to the output file
        grouped_df.to_csv(output_file, index=False)
        
        return SVD_FileInfo(model_file='./algoritmi/surprisedir/trained_model.pkl', file_path="./algoritmi/surprisedir/data_preprocessed_matrix.csv", column_1='cod_cli', column_2='cod_art', column_3='rating')
    
        
    def prepare_feedback(self, input_file_og, output_file):
        df1 = pd.read_csv(input_file_og, delimiter=',', thousands=',', decimal='.') 
                         
        # Filter the DataFrame to keep only rows where the 'algo' column equals 'SVD'
        df_filtered = df1[df1['algo'] == 'SVD']
        
        # Drop the unused column from the filtered DataFrame
        df_filtered.drop(columns=['id'], inplace=True)
        df_filtered.drop(columns=['dat_fed'], inplace=True)
        df_filtered.drop(columns=['user'], inplace=True)  
        
        # Drop the 'algo' column from the filtered DataFrame
        df_filtered.drop(columns=['algo'], inplace=True)
        
        # Save the filtered DataFrame to a new CSV file
        df_filtered.to_csv(output_file, index=False)  # index=False to exclude index column from being saved

class NN_Preprocessor(Preprocessor):
    tables_to_export = ['anaart', 'ordclidet_feedback', 'ordclidet', 'anacli']
    
    def process_file(self, input_file_og, output_file):
        df1 = pd.read_csv(input_file_og, delimiter=',', thousands=',', decimal='.')

        grouped_df = df1.groupby(['cod_cli', 'cod_art'], as_index=False)['qta_ordinata'].sum()
        grouped_df['qta_ordinata'] = np.log10(grouped_df['qta_ordinata'])
        grouped_df['qta_ordinata'] = np.minimum(grouped_df['qta_ordinata'], 2)
        grouped_df['qta_ordinata'] = np.maximum(grouped_df['qta_ordinata'], 0.0001)
        grouped_df['qta_ordinata'] = grouped_df['qta_ordinata'].round(4)
        grouped_df['qta_ordinata'] = grouped_df['qta_ordinata'].astype(str)
        grouped_df = grouped_df.rename(columns={'qta_ordinata': 'rating'})
        
        # Merge with additional information
        df_additional = pd.read_csv('algoritmi/preprocessor/exported_csv/anaart.csv')
        merged_df = pd.merge(grouped_df, df_additional, how='inner', on='cod_art')
        merged_df.drop('des_art', axis=1, inplace=True)
        merged_df.drop('cod_sott_comm', axis=1, inplace=True)
        merged_df.sort_values(by=['cod_cli'])
        merged_df.to_csv(output_file, index=False)
        
        return NN_FileInfo("./algoritmi/ptwidedeep/model.pt", "./algoritmi/ptwidedeep/wd_model.pt", "./algoritmi/ptwidedeep/WidePreprocessor.pkl", "./algoritmi/ptwidedeep/TabPreprocessor.pkl", "./algoritmi/ptwidedeep/data_preprocessed_NN.csv", "./algoritmi/preprocessor/exported_csv/anacli.csv", "./algoritmi/preprocessor/exported_csv/anaart.csv")
    
    def prepare_feedback(self, input_file_og, output_file):
        df1 = pd.read_csv(input_file_og, delimiter=',', thousands=',', decimal='.')     
         
        # Filter the DataFrame to keep only rows where the 'algo' column equals 'NN'
        df_filtered = df1[df1['algo'] == 'NN']
        
        # Drop the unused column from the filtered DataFrame
        df_filtered.drop(columns=['id'], inplace=True)
        df_filtered.drop(columns=['dat_fed'], inplace=True)
        df_filtered.drop(columns=['user'], inplace=True)   
        
        # Drop the 'algo' column from the filtered DataFrame
        df_filtered.drop(columns=['algo'], inplace=True)
        
        # Save the filtered DataFrame to a new CSV file
        df_filtered.to_csv(output_file, index=False)  # index=False to exclude index column from being saved

class PreprocessorContext:
    def __init__(self, preprocessor= None):
        self.preprocessor = preprocessor
    
    def set_preprocessor(self, preprocessor):
        self.preprocessor = preprocessor

    def process_file(self, input_file_og, output_file):
        with mysql.connector.connect(
                host='db',
                user='myuser',
                password='mypassword',
                database='mydatabase',
                port='3306'
            ) as conn:
            cursor = conn.cursor()
            csv_folder = 'algoritmi/preprocessor/exported_csv'
            if not os.path.exists(csv_folder):
                os.makedirs(csv_folder)
            
            for table_name in self.preprocessor.tables_to_export:
                self.preprocessor.retrieve_file(cursor, table_name, csv_folder)
            
            return self.preprocessor.process_file(input_file_og, output_file)
    
    def prepare_feedback(self, input_file_og, output_file):
        self.preprocessor.prepare_feedback(input_file_og, output_file)
