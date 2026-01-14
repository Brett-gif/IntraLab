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
    # GET: project
    # -----------------------------------------
    @users_bp.get("/users/<user_id>/project")
    def get_project(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        project = user.load_project()
        if project is None:
            return jsonify({"error": "Project not found"}), 404
        return jsonify({"user_id": user_id, "project": project}), 200

    # -----------------------------------------
    # GET: wet update
    # -----------------------------------------
    @users_bp.get("/users/<user_id>/wet")
    def get_wet(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        wet = user.load_wet()
        return jsonify({"user_id": user_id, "wet_update": wet}), 200

    # -----------------------------------------
    # GET: dry update
    # -----------------------------------------
    @users_bp.get("/users/<user_id>/dry")
    def get_dry(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        dry = user.load_dry()
        return jsonify({"user_id": user_id, "dry_update": dry}), 200

    # -----------------------------------------
    # GET: dashboard (project + wet + dry)
    # -----------------------------------------
    @users_bp.get("/users/<user_id>/dashboard")
    def get_dashboard(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        project = user.load_project()
        wet = user.load_wet()
        dry = user.load_dry()
        return jsonify(
            {
                "user_id": user_id,
                "project": project,
                "wet_update": wet,
                "dry_update": dry,
            }
        ), 200

    # -----------------------------------------
    # POST: append general update and trigger compute
    # Body: {"Data": "...", "Text_Update": "..."}
    # -----------------------------------------
    @users_bp.post("/users/<user_id>/updates")
    def post_update(user_id: str):
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

        # 1) store raw update
        user.add_update(cleaned_or_err)

        # 2) trigger your internal wet/dry computation (you implement)
        try:
            user.compute_wet_and_dry()
        except NotImplementedError:
            # It's fine for now; you'll implement later
            pass

        return jsonify({"status": "ok", "update": cleaned_or_err}), 201

    return users_bp