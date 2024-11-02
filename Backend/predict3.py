import pickle
import sys
import json
from pymongo import MongoClient
from bson.binary import Binary

def get_prediction(location, sqft, bath, bhk):
    # Connect to MongoDB
    client = MongoClient("mongodb+srv://RaunakSharma:PozqDxDkbYn0rcLm@cluster0.zmhsk06.mongodb.net/")
    db = client['my_database']
    model_collection = db['models']
    metadata_collection = db['metadata']
    
    # Load model and columns data
    model_data = model_collection.find_one({"name": "house_price_model"})
    columns_data = metadata_collection.find_one({"name": "columns"})
    
    if not model_data or not columns_data:
        return {"error": "Model or columns data not found"}

    # Deserialize model and retrieve columns
    model = pickle.loads(model_data['model'])
    columns = columns_data['data']
    input_data = [0] * len(columns)

    # Prepare input data
    if f"location_{location}" in columns:
        input_data[columns.index(f"location_{location}")] = 1
    input_data[columns.index("total_sqft")] = sqft
    input_data[columns.index("bath")] = bath
    input_data[columns.index("bhk")] = bhk

    # Make prediction
    prediction = model.predict([input_data])[0]
    return {"price": prediction}

if __name__ == "__main__":
    # Get input data from Node.js
    location = sys.argv[1]
    sqft = float(sys.argv[2])
    bath = int(sys.argv[3])
    bhk = int(sys.argv[4])

    # Get prediction
    result = get_prediction(location, sqft, bath, bhk)
    
    # Print the result as JSON for Node.js to capture
    print(json.dumps(result))
