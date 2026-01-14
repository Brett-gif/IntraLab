# app.py
from __future__ import annotations

from flask import Flask, jsonify

# Import your Lab class (and only Lab) from wherever you put it.
# If your classes are in "user_class.py", this is correct:
from user_class import Lab

# Import the blueprint register function from your routes file
# (rename "users_routes" to whatever your file is called)
from routes import register_user_routes


def create_app() -> Flask:
    app = Flask(__name__)

    # 1) Create the long-lived Lab instance
    lab = Lab()

    # 2) (Optional but useful) create some users at startup for testing
    #    In real usage you might create users via a POST /users endpoint.
    lab.create_user(user_id="123", name="Alice", role="student")

    # 3) Register your routes (Blueprint) and inject the Lab instance
    app.register_blueprint(register_user_routes(lab))

    # 4) Simple health check
    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    app = create_app()
    # debug=True is fine for development
    app.run(host="127.0.0.1", port=5000, debug=True)
