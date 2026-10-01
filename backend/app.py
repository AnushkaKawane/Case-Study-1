from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import pickle
import os

app = Flask(__name__)


# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "heart_model.pkl"
)

FRONTEND_FOLDER = os.path.join(
    BASE_DIR,
    "frontend"
)


# ==========================================
# LOAD MODEL
# ==========================================

try:

    with open(MODEL_PATH, "rb") as file:
        saved_data = pickle.load(file)

    model = saved_data["model"]
    scaler = saved_data["scaler"]
    features = saved_data["features"]

    print("===================================")
    print("MODEL LOADED SUCCESSFULLY")
    print("Features:", features)
    print("===================================")

except Exception as e:

    print("===================================")
    print("MODEL LOADING ERROR")
    print(e)
    print("===================================")

    model = None
    scaler = None
    features = []


# ==========================================
# FRONTEND
# ==========================================

@app.route("/")
def home():

    return send_from_directory(
        FRONTEND_FOLDER,
        "index.html"
    )


@app.route("/<path:filename>")
def frontend_files(filename):

    return send_from_directory(
        FRONTEND_FOLDER,
        filename
    )


# ==========================================
# PREDICTION API
# ==========================================

@app.route("/api/predict", methods=["POST"])
def predict():

    try:

        # Check model
        if model is None:

            return jsonify({
                "error": "ML model was not loaded."
            }), 500


        # Get JSON data
        data = request.get_json()

        print("\nReceived data:")
        print(data)


        if data is None:

            return jsonify({
                "error": "No JSON data received."
            }), 400


        # Check required features
        missing_features = []

        for feature in features:

            if feature not in data:

                missing_features.append(feature)


        if missing_features:

            return jsonify({
                "error": "Missing features: "
                         + ", ".join(missing_features)
            }), 400


        # Create input in correct feature order
        values = []

        for feature in features:

            values.append(
                float(data[feature])
            )


        input_data = pd.DataFrame(
            [values],
            columns=features
        )


        print("\nInput Data:")
        print(input_data)


        # Scale data
        scaled_data = scaler.transform(
            input_data
        )


        # Prediction
        prediction = model.predict(
            scaled_data
        )[0]


        # Probability
        probabilities = model.predict_proba(
            scaled_data
        )[0]


        # Find probability of predicted class
        classes = model.classes_

        prediction_index = list(
            classes
        ).index(prediction)

        probability = probabilities[
            prediction_index
        ]


        print("\nPrediction:", prediction)

        print(
            "Probability:",
            probability * 100
        )


        return jsonify({

            "prediction": int(prediction),

            "probability": round(
                float(probability) * 100,
                2
            )

        })


    except Exception as e:

        print("\n===================================")
        print("PREDICTION ERROR")
        print(e)
        print("===================================")

        return jsonify({

            "error": str(e)

        }), 400


# ==============================
# Run Flask
# ==============================

if __name__ == "__main__":
    app.run(debug=True)
