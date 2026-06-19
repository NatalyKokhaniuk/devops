import os
import re

from flask import Flask, jsonify, request

WEATHER_WORDS = [
    "weather",
    "temperature",
    "rain",
    "snow",
    "wind",
    "погода",
    "температура"
]

CURRENCY_WORDS = [
    "currency",
    "exchange",
    "rate",
    "dollar",
    "euro",
    "курс",
    "валют",
    "долар",
    "євро"
]

KNOWN_CITIES = [
    "Kyiv",
    "Lviv",
    "Odesa",
    "Kharkiv",
    "Dnipro",
    "London",
    "Paris",
    "Berlin",
    "Warsaw"
]


def detect_city(text):
    lowered = text.lower()

    for city in KNOWN_CITIES:
        if city.lower() in lowered:
            return city

    match = re.search(r"/weather\s+([A-Za-zА-Яа-яІіЇїЄє' -]+)", text)
    if match:
        return match.group(1).strip().title()

    return None


def create_app():
    app = Flask(__name__)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.post("/analyze")
    def analyze():
        payload = request.get_json(force=True)
        text = payload.get("text", "")
        lowered = text.lower()

        intent = "unknown"
        if any(word in lowered for word in WEATHER_WORDS):
            intent = "weather"
        elif any(word in lowered for word in CURRENCY_WORDS):
            intent = "currency"

        return jsonify({
            "intent": intent,
            "city": detect_city(text)
        })

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))
