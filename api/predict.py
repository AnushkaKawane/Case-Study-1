import os
import sys
import pickle
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify

app = Flask(__name__)

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "model",
    "heart_model.pkl"
)

with open(MODEL_PATH, "rb") as file:
    saved_data = pickle.load(file)

model = saved_data["model"]
scaler = saved_data["scaler"]
features = saved_data["features"]


@app.route("/api/predict", methods=["POST"])
def predict():

    data = request.get_json()

    try:
        values = [data[feature] for feature in features]

        input_data = pd.DataFrame(
            [values],
            columns=features
        )

        scaled_data = scaler.transform(input_data)

        prediction = model.predict(scaled_data)[0]

        probability = model.predict_proba(scaled_data)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": round(float(probability) * 100, 2)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400