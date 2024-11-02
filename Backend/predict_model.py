import pandas as pd
import numpy as np
import pickle
from pymongo import MongoClient
from bson.binary import Binary

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['real_estate']
model_collection = db['models']
metadata_collection = db['metadata']

# Load model from MongoDB
model_data = model_collection.find_one({"name": "house_price_model"})["model"]
model = pickle.loads(model_data)

# Load columns from MongoDB
columns_data = metadata_collection.find_one({"name": "columns"})["data"]

def predict_price(location, sqft, bath, bhk):
    # Prepare the input data
    x = pd.DataFrame(columns=columns_data)
    x.loc[0] = 0  # Initialize with zeros
    
    if f"location_{location}" in x.columns:
        x[f"location_{location}"] = 1  # Set location
    
    # Set the other features
    x["total_sqft"] = sqft
    x["bath"] = bath
    x["bhk"] = bhk
    
    # Make the prediction
    return model.predict(x)[0]

# Example call
predicted_price = predict_price("1st Phase JP Nagar", 1000, 2, 2)
print(f"The predicted price is: {predicted_price}")
