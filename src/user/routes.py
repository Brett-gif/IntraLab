# routes.py

from __future__ import annotations

from flask import Blueprint, jsonify, request
from user_class import Lab

users_bp = Blueprint("users", __name__)


def register_user_routes(lab: Lab) -> Blueprint:
    # -----------------------------------------
    # GET: dashboard (project + wet + dry)
    # -----------------------------------------
    @users_bp.get("/users/<user_id>/dashboard")
    def get_user_dashboard(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        project_description = user.load_project_description()  # None if missing
        wet_updates = user.load_update("wet")                  # {} if missing
        dry_updates = user.load_update("dry")                  # {} if missing

        return jsonify(
            {
                "user_id": user_id,
                "project_description": project_description,
                "wet_updates": wet_updates,
                "dry_updates": dry_updates,
            }
        ), 200

    # -----------------------------------------
    # POST: overwrite project description
    # Body: {"Name": "...", "Description": "..."}
    # -----------------------------------------
    @users_bp.post("/users/<user_id>/project")
    def post_project(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify({"error": "JSON body required"}), 400

        name = payload.get("Name")
        description = payload.get("Description")

        if not isinstance(name, str) or not name.strip():
            return jsonify({"error": "Field 'Name' (non-empty string) is required"}), 400
        if not isinstance(description, str) or not description.strip():
            return jsonify({"error": "Field 'Description' (non-empty string) is required"}), 400

        user.add_project({"Name": name.strip(), "Description": description.strip()})
        return jsonify({"status": "ok"}), 201

    # -----------------------------------------
    # POST: append update (append-only list)
    # Body: {"date": "...", "Description": "..."}
    # -----------------------------------------
    @users_bp.post("/users/<user_id>/updates")
    def post_user_update(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify({"error": "JSON body required"}), 400

        date = payload.get("date")
        description = payload.get("Description")

        if not isinstance(date, str) or not date.strip():
            return jsonify({"error": "Field 'date' (non-empty string) is required"}), 400
        if not isinstance(description, str) or not description.strip():
            return jsonify({"error": "Field 'Description' (non-empty string) is required"}), 400

        user.add_update({"date": date.strip(), "Description": description.strip()})
        return jsonify({"status": "ok"}), 201

    # -----------------------------------------
    # OPTIONAL GET: return full appended updates list
    # (handy for frontend/debug)
    # -----------------------------------------
    @users_bp.get("/users/<user_id>/updates")
    def get_user_updates(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        updates = user.load_past_updates()
        return jsonify({"user_id": user_id, "updates": updates}), 200
    @users_bp.post("/users")
    def create_user():
        """
        Expects JSON:
        {
        "user_id": "...",
        "name": "...",
        "role": "..."
        }
        """
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify({"error": "JSON body required"}), 400

        user_id = payload.get("user_id")
        name = payload.get("name")
        role = payload.get("role")

        if not isinstance(user_id, str) or not user_id.strip():
            return jsonify({"error": "user_id is required"}), 400
        if not isinstance(name, str) or not name.strip():
            return jsonify({"error": "name is required"}), 400
        if not isinstance(role, str) or not role.strip():
            return jsonify({"error": "role is required"}), 400

        try:
            lab.create_user(
                user_id=user_id.strip(),
                name=name.strip(),
                role=role.strip()
            )
        except ValueError:
            return jsonify({"error": "User already exists"}), 409

        return jsonify({"status": "ok", "user_id": user_id}), 201
    return users_bp
