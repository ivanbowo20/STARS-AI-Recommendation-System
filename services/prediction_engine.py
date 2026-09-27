import os
import json
import joblib
import pandas as pd
import numpy as np

# Base directory is one level up from services
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'model')

MODEL_PATH = os.path.join(MODEL_DIR, 'model_random_forest_v4_2_final.pkl')
SCHEMA_PATH = os.path.join(MODEL_DIR, 'feature_schema_v4_2.json')

class PredictionEngine:
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PredictionEngine, cls).__new__(cls)
        return cls._instance
        
    def __init__(self):
        if not self._initialized:
            self._initialize()
            PredictionEngine._initialized = True
            
    def _initialize(self):
        print(f"Loading schema from {SCHEMA_PATH}")
        with open(SCHEMA_PATH, 'r') as f:
            self.schema = json.load(f)
            
        print(f"Loading model from {MODEL_PATH}")
        self.model_data = joblib.load(MODEL_PATH)
        
        self.pipeline = self.model_data['pipeline']
        self.label_encoder = self.model_data['label_encoder']
        self.features = self.model_data['features']
        
        if self.schema['features'] != self.features:
            print("Warning: Schema features do not exactly match model artifact features.")
            
    def predict_recommendations(self, input_data):
        """
        input_data: dictionary mapping feature names to values.
        Missing numeric features should be np.nan.
        Missing binary features should be 0.
        """
        # Ensure all required features are present in input_data
        missing_features = {}
        for feature in self.features:
            if feature not in input_data:
                if feature in self.schema['numeric_features']:
                    missing_features[feature] = np.nan
                else:
                    missing_features[feature] = 0
                    
        # Add missing features
        input_data.update(missing_features)
        
        # Create a dataframe with a single row
        df_input = pd.DataFrame([input_data])
                    
        # Reorder columns to match exactly what the model expects
        df_input = df_input[self.features]
        
        # Predict probabilities
        probabilities = self.pipeline.predict_proba(df_input)[0]
        
        # Get classes from label encoder
        classes = self.label_encoder.classes_
        
        # Create list of (class_name, probability)
        results = []
        for i, class_name in enumerate(classes):
            results.append({
                'jurusan': class_name,
                'probability': float(probabilities[i])
            })
            
        # Sort by probability descending
        results = sorted(results, key=lambda x: x['probability'], reverse=True)
        
        # Return top 5
        return results[:5]

# Global instance for easy import
engine = PredictionEngine()

def predict_recommendations(input_data):
    return engine.predict_recommendations(input_data)
