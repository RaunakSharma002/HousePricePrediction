import pickle
from pymongo import MongoClient
import numpy as np
import pandas as pd
import json
from sklearn.linear_model import LinearRegression
from bson.binary import Binary

# Connect to MongoDB
client = MongoClient("mongodb+srv://RaunakSharma:PozqDxDkbYn0rcLm@cluster0.zmhsk06.mongodb.net/")
db = client['my_database']
data_collection = db['Property']
model_collection = db['models']

def train_model():
    # Load data from MongoDB
    data = list(data_collection.find())
    df = pd.DataFrame(data)

    # Drop unnecessary columns and handle missing values
    df = df.drop(['area_type', 'society', 'balcony', 'availability', '_id'], axis='columns').dropna()

    # Data preprocessing
    df['bhk'] = df['size'].apply(lambda x: int(x.split(' ')[0]) if pd.notnull(x) else None)

    # Function to convert `total_sqft` to numeric, handling ranges and invalid entries
    def convert_sqft(sqft):
        try:
            # Handle range values like "1000-1200" by taking the average
            if '-' in sqft:
                sqft_range = list(map(float, sqft.split('-')))
                return sum(sqft_range) / 2
            return float(sqft)  # Convert directly if it’s a single number
        except (ValueError, TypeError):
            return np.nan  # Return NaN for non-numeric or incompatible values

    df['total_sqft'] = df['total_sqft'].apply(convert_sqft)

    # Drop rows with NaN values in `total_sqft` or `price` after conversion
    df = df.dropna(subset=['total_sqft', 'price'])

    # Calculate price per square foot
    df['price_per_sqft'] = df['price'] * 100000 / df['total_sqft']

    # Handling locations with low frequency by grouping them as "other"
    location_stats = df['location'].value_counts()
    df['location'] = df['location'].apply(lambda x: 'other' if location_stats[x] <= 10 else x)

    # Store unique locations in MongoDB for use in the React app
    unique_locations = df['location'].unique().tolist()
    db['metadata'].replace_one({"name": "locations"}, {"name": "locations", "data": unique_locations}, upsert=True)
    
    # One-hot encode the 'location' column
    df = pd.get_dummies(df, columns=['location'], drop_first=True)

    # Prepare features and target variable
    X = df.drop(['price', 'size', 'price_per_sqft'], axis='columns')
    y = df['price']

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Serialize the model and save to MongoDB
    model_binary = Binary(pickle.dumps(model))
    model_collection.replace_one({"name": "house_price_model"}, {"name": "house_price_model", "model": model_binary}, upsert=True)

    # Save column names for later use (in predict.py or client app)
    columns = list(X.columns)
    db['metadata'].replace_one({"name": "columns"}, {"name": "columns", "data": columns}, upsert=True)

    print("Model trained and saved in MongoDB successfully.")

# Run the training function
train_model()
