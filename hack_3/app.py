from __future__ import annotations
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from user_class import Lab, User
from routes import register_user_routes
import os


def create_app() -> Flask:
    app = Flask(__name__, static_folder='.')
    CORS(app)  # Enable CORS for frontend communication
    
    lab = Lab()

    # Hard-code users at startup (as you requested)
    lab.add_user(User(user_id="123", name="Alice", role="student"))
    lab.add_user(User(user_id="999", name="James", role="student"))

    app.register_blueprint(register_user_routes(lab))

    @app.get("/")
    def index():
        return send_from_directory('.', 'index.html')

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)