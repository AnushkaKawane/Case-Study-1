from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import pickle
import os

app = Flask(__name__)

# Project folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Frontend folder
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Model file
MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "heart_model.pkl"
)

# Load model
with open(MODEL_PATH, "rb") as file:
    saved_model = pickle.load(file)

model = saved_model["model"]
scaler = saved_model["scaler"]
features = saved_model["features"]

print("Model loaded successfully")
print("Features:", features)


# =========================
# FRONTEND
# =========================

@app.route("/")
def home():
    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# CSS, JavaScript, images, etc.
@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(
        FRONTEND_DIR,
        filename
    )


# =========================
# PREDICTION
# =========================

@app.route("/api/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        print("Received:", data)

        # Put values in exactly the same order
        # used during model training
        values = [
            float(data[feature])
            for feature in features
        ]

        input_data = pd.DataFrame(
            [values],
            columns=features
        )

        # Scale input
        input_scaled = scaler.transform(
            input_data
        )

        # Prediction
        prediction = model.predict(
            input_scaled
        )[0]

        # Probability
        probabilities = model.predict_proba(
            input_scaled
        )[0]

        classes = list(model.classes_)

        index = classes.index(prediction)

        probability = probabilities[index] * 100

        print("Prediction:", prediction)
        print("Probability:", probability)

        return jsonify({
            "prediction": int(prediction),
            "probability": round(
                float(probability),
                2
            )
        })

    except Exception as error:

        print("Prediction error:", error)

        return jsonify({
            "error": str(error)
        }), 500


# =========================
# START SERVER
# =========================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )