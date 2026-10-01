import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# Load dataset
df = pd.read_csv("backend/heart.csv")

print("Dataset loaded successfully")
print("Shape:", df.shape)
print("Columns:", df.columns.tolist())

# Change this if your target column has a different name
TARGET = "target"

X = df.drop(TARGET, axis=1)
y = df[TARGET]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Scale data
scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Accuracy
accuracy = model.score(X_test, y_test)

print("Model trained successfully")
print("Accuracy:", accuracy)

# Save model + scaler
with open("model/heart_model.pkl", "wb") as file:
    pickle.dump(
        {
            "model": model,
            "scaler": scaler,
            "features": X.columns.tolist()
        },
        file
    )

print("Model saved to model/heart_model.pkl")