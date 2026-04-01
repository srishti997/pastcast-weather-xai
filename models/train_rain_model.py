import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

from backend.models.dataset_loader import generate_weather_dataset
from backend.models.preprocessing import build_preprocessor


ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")
MODEL_PATH = os.path.join(ARTIFACT_DIR, "rain_model.pkl")


def train_model():
    print("Generating dataset...")
    df = generate_weather_dataset(8000)

    X = df.drop(columns=["rain"])
    y = df["rain"]

    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Building pipeline...")

    preprocessor = build_preprocessor()

    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=8,
        random_state=42
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    print("Training model...")
    pipeline.fit(X_train, y_train)

    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_proba)

    print("\n===== MODEL PERFORMANCE =====")
    print(f"Accuracy: {acc:.4f}")
    print(f"ROC-AUC: {roc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    print("\nSaving model...")

    os.makedirs(ARTIFACT_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)

    print(f"Model saved at: {MODEL_PATH}")


if __name__ == "__main__":
    train_model()