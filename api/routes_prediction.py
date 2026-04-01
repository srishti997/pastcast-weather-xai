from flask import Blueprint, request, jsonify
from services.weather_feature_service import build_feature_vector
from models.inference import predict_and_explain
prediction_bp = Blueprint("prediction_bp", __name__)


@prediction_bp.route("/api/v2/predict", methods=["POST"])
def predict_weather():
    body = request.get_json(force=True) or {}

    location = body.get("location", {})
    analysis_period = body.get("analysis_period", "")
    feature_payload = body.get("features", {})

    features = build_feature_vector(feature_payload)
    result = predict_and_explain(location, analysis_period, features)

    return jsonify(result), 200