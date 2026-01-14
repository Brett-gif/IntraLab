from __future__ import annotations

from flask import Blueprint, jsonify, request
from user_class import Lab

users_bp = Blueprint("users", __name__)


# -------------------------
# Validation helpers
# -------------------------
def _require_json_object(payload):
    if not isinstance(payload, dict):
        return False, (jsonify({"error": "JSON body must be an object"}), 400)
    return True, None


def _validate_project(payload: dict):
    # Expected: {"Name": "...", "description": "..."}
    name = payload.get("Name")
    description = payload.get("description")

    if not isinstance(name, str) or not name.strip():
        return False, (jsonify({"error": "Field 'Name' (non-empty string) is required"}), 400)
    if not isinstance(description, str) or not description.strip():
        return False, (jsonify({"error": "Field 'description' (non-empty string) is required"}), 400)

    return True, {"Name": name.strip(), "description": description.strip()}


def _validate_update_obj(payload: dict):
    # Expected: {"Data": "...", "Text_Update": "..."}
    data = payload.get("Data")
    text = payload.get("Text_Update")

    if not isinstance(data, str) or not data.strip():
        return False, (jsonify({"error": "Field 'Data' (non-empty string) is required"}), 400)
    if not isinstance(text, str) or not text.strip():
        return False, (jsonify({"error": "Field 'Text_Update' (non-empty string) is required"}), 400)

    return True, {"Data": data.strip(), "Text_Update": text.strip()}


def register_user_routes(lab: Lab) -> Blueprint:
    # -----------------------------------------
    # POST: create user
    # Body: {"user_id": "...", "name": "...", "role": "..."}
    # -----------------------------------------
    @users_bp.post("/users")
    def create_user():
        payload = request.get_json(silent=True)
        ok, err = _require_json_object(payload)
        if not ok:
            return err

        user_id = payload.get("user_id")
        name = payload.get("name")
        role = payload.get("role")

        if not isinstance(user_id, str) or not user_id.strip():
            return jsonify({"error": "Field 'user_id' (non-empty string) is required"}), 400
        if not isinstance(name, str) or not name.strip():
            return jsonify({"error": "Field 'name' (non-empty string) is required"}), 400
        if not isinstance(role, str) or not role.strip():
            return jsonify({"error": "Field 'role' (non-empty string) is required"}), 400

        try:
            lab.create_user(user_id=user_id.strip(), name=name.strip(), role=role.strip())
        except ValueError:
            return jsonify({"error": "User already exists"}), 409

        return jsonify({"status": "ok", "user_id": user_id.strip()}), 201

    # -----------------------------------------
    # GET: dashboard (project + wet + dry)
    # # -----------------------------------------
    # @users_bp.get("/users/<user_id>/dashboard")
    # def get_user_dashboard(user_id: str):
    #     user = lab.get_user(user_id)
    #     if user is None:
    #         return jsonify({"error": "User not found"}), 404

    #     project = user.load_project_description()  # dict or None
    #     wet = user.load_update("wet")              # dict or {}
    #     dry = user.load_update("dry")              # dict or {}

    #     return jsonify(
    #         {
    #             "user_id": user_id,
    #             "project": project,
    #             "wet_update": wet,
    #             "dry_update": dry,
    #         }
    #     ), 200
    

    @users_bp.get("/users/<user_id>/dashboard")
    def get_user_dashboard(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        project = user.load_project_description()
        wet = user.load_update("wet")
        dry = user.load_update("dry")

        return jsonify(
            {
                "user_id": user_id,
                "project_descriptions": project or {},
                "wet_updates": wet or {},
                "dry_updates": dry or {},
            }
        ), 200

    # -----------------------------------------
    # POST: overwrite project description
    # Body: {"Name": "...", "description": "..."}
    # -----------------------------------------
    @users_bp.post("/users/<user_id>/project")
    def post_project(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        payload = request.get_json(silent=True)
        ok, err = _require_json_object(payload)
        if not ok:
            return err

        ok, cleaned_or_err = _validate_project(payload)
        if not ok:
            return cleaned_or_err

        user.add_project(cleaned_or_err)
        return jsonify({"status": "ok", "project": cleaned_or_err}), 201

    # -----------------------------------------
    # POST: append general update (append-only list)
    # Body: {"Data": "...", "Text_Update": "..."}
    # -----------------------------------------
    @users_bp.post("/users/<user_id>/updates")
    def post_user_update(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        payload = request.get_json(silent=True)
        ok, err = _require_json_object(payload)
        if not ok:
            return err

        ok, cleaned_or_err = _validate_update_obj(payload)
        if not ok:
            return cleaned_or_err

        user.add_update(cleaned_or_err)
        return jsonify({"status": "ok", "update": cleaned_or_err}), 201

    # -----------------------------------------
    # POST: overwrite wet update
    # Body: {"Data": "...", "Text_Update": "..."}
    # -----------------------------------------
    @users_bp.post("/users/<user_id>/wet")
    def post_wet_update(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        payload = request.get_json(silent=True)
        ok, err = _require_json_object(payload)
        if not ok:
            return err

        ok, cleaned_or_err = _validate_update_obj(payload)
        if not ok:
            return cleaned_or_err

        user.save_wet_update(cleaned_or_err)
        return jsonify({"status": "ok", "wet_update": cleaned_or_err}), 201

    # -----------------------------------------
    # POST: overwrite dry update
    # Body: {"Data": "...", "Text_Update": "..."}
    # -----------------------------------------
    @users_bp.post("/users/<user_id>/dry")
    def post_dry_update(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        payload = request.get_json(silent=True)
        ok, err = _require_json_object(payload)
        if not ok:
            return err

        ok, cleaned_or_err = _validate_update_obj(payload)
        if not ok:
            return cleaned_or_err

        user.save_dry_update(cleaned_or_err)
        return jsonify({"status": "ok", "dry_update": cleaned_or_err}), 201

    # -----------------------------------------
    # GET: all appended updates list
    # -----------------------------------------
    @users_bp.get("/users/<user_id>/updates")
    def get_user_updates(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        updates = user.load_past_updates()
        return jsonify({"user_id": user_id, "updates": updates}), 200


    @users_bp.get("/users")
    def get_all_users():
        users = [
            {
                "user_id": user.user_id,
                "name": user.name,
                "email": getattr(user, "email", ""),
                "role": user.role,
            }
            for user in lab._users.values()
        ]
        return jsonify({"users": users}), 200
    return users_bp
