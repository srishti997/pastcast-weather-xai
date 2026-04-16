# ============================================================
# CLEAN & STABLE APP.PY (FIXED VERSION)
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import random
import os, re, requests, pandas as pd, wikipedia

from api.routes_prediction import prediction_bp
from utils.nlp_model import generate_nlm_reply, translate_text
from utils.db import init_db, add_message, get_recent_messages, clear_history

# ============================================================
# APP INIT
# ============================================================

app = Flask(__name__)

# ✅ CORS FIX (important)
CORS(
    app,
    origins=["http://localhost:3000"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True,
)

# Register blueprint (your /api/v2/predict comes from here)
app.register_blueprint(prediction_bp)

# Initialize DB
init_db()

print("✅ App initialized successfully")

# ============================================================
# BASIC ROUTES
# ============================================================

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/test-cors")
def test_cors():
    return jsonify({"message": "CORS is working"})

# ============================================================
# CHAT ROUTE
# ============================================================

@app.route("/api/message", methods=["POST"])
def api_message():
    data = request.get_json() or {}
    user_input = (data.get("text") or "").strip()

    if not user_input:
        return jsonify({"reply": "Please enter a message."})

    add_message("user", user_input)

    try:
        reply = generate_nlm_reply(user_input)
    except Exception as e:
        print("❌ NLM error:", e)
        reply = "Error generating response."

    add_message("ai", reply)

    return jsonify({
        "reply": reply,
        "status": "success",
        "timestamp": datetime.now().isoformat()
    })

# ============================================================
# HISTORY ROUTES
# ============================================================

@app.route("/api/history")
def api_history():
    msgs = get_recent_messages(20)
    return jsonify([{"role": r, "content": c} for r, c in msgs])

@app.route("/api/clear", methods=["POST"])
def api_clear():
    clear_history()
    return jsonify({"message": "Chat memory cleared."})

# ============================================================
# WEATHER PROBABILITY (SAFE VERSION)
# ============================================================

@app.route("/weather/probability", methods=["POST"])
def weather_probability():
    try:
        data = request.get_json() or {}

        location = data.get("location")
        date_range = data.get("date_range")

        if not location:
            return jsonify({"error": "location required"}), 400

        if not date_range or not date_range.get("start_date"):
            return jsonify({"error": "date_range.start_date required"}), 400

        lat = float(location.get("latitude", 0))
        lng = float(location.get("longitude", 0))
        city_name = location.get("city_name") or f"{lat},{lng}"

        def random_prob(base):
            return round(max(0, min(100, base + random.randint(-10, 10))), 2)

        response = {
            "location": {
                "latitude": lat,
                "longitude": lng,
                "city_name": city_name
            },
            "date_range": date_range,
            "probabilities": {
                "rain": random_prob(50),
                "extreme_heat": random_prob(20),
                "high_wind": random_prob(15),
                "cloudy": random_prob(60),
                "good_weather": random_prob(70),
            },
            "status": "success"
        }

        return jsonify(response)

    except Exception as e:
        print("❌ weather_probability error:", e)
        return jsonify({"error": str(e)}), 500

# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    print("🚀 Starting Flask server on port 8000...")
    app.run(host="0.0.0.0", port=8000, debug=False, use_reloader=False)