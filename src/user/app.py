from flask import Flask, jsonify
from user_class import Lab
from routes import register_user_routes


def create_app() -> Flask:
    app = Flask(__name__)

    lab = Lab()
    # Optional test user; you can remove once using POST /users
    lab.create_user(user_id="123", name="Alice", role="student")

    app.register_blueprint(register_user_routes(lab))

    @app.get("/")
    def index():
        return jsonify(
            {
                "message": "Backend running",
                "try": [
                    "/health",
                    "/users/123/dashboard",
                    "/users/123/updates",
                ],
            }
        )

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)