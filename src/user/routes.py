from __future__ import annotations

from flask import Blueprint, jsonify, request
from user_class import Lab

users_bp = Blueprint("users", __name__)


def register_user_routes(lab: Lab) -> Blueprint:
    # ------------------------------------------------------------
    # POST: user submits an update -> backend runs internal logic
    # ------------------------------------------------------------
    @users_bp.post("/users/<user_id>/update")
    def post_user_update(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify({"error": "JSON body required"}), 400

        # You choose your schema. Example expected fields:
        # {
        #   "text": "...",          # what the user wrote
        #   "project_id": "P1",     # optional
        #   "update_type": "wet"    # optional if you want
        # }

        if "text" not in payload or not isinstance(payload["text"], str) or not payload["text"].strip():
            return jsonify({"error": "Field 'text' (non-empty string) is required"}), 400

        # This is where YOUR internal logic runs.
        # You can:
        # - store raw update in Data/updates/{user_id}_updates.json
        # - generate wet/dry outputs
        # - write Data/updates/{user_id}_wet_updates.json and ..._dry_updates.json
        try:
            # Implement these in your User class:
            # 1) add_update(...) to persist the raw update
            # 2) generate_update(...) to produce wet/dry outputs (and persist them)
            user.add_update(update_payload=payload)

            # If your internal logic produces both wet and dry results, do it here:
            user.generate_update()

        except NotImplementedError:
            return jsonify({"error": "add_update/generate_update not implemented yet"}), 501

        return jsonify({"status": "ok"}), 201

    # --------------------------------------------------------------------
    # GET: one call for page load -> project descriptions + wet + dry
    # --------------------------------------------------------------------
    @users_bp.get("/users/<user_id>/dashboard")
    def get_user_dashboard(user_id: str):
        user = lab.get_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        # Important: if these files can change while server runs,
        # prefer re-loading from disk each request:
        project_descriptions = user.load_project_descriptions()
        wet_updates = user.load_update("wet")
        dry_updates = user.load_update("dry")

        return jsonify(
            {
                "user_id": user_id,
                "project_descriptions": project_descriptions,
                "wet_updates": wet_updates,
                "dry_updates": dry_updates,
            }
        )

    return users_bp
