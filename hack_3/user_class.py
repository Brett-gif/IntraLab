from __future__ import annotations
import json
import os
from typing import Dict, Any, Optional, List
from generate_wet_dry_json import main
key = os.environ.get("gem_key",None)
class User:
    def __init__(self, user_id: str, name: str, role: str):
        self.user_id = user_id
        self.name = name
        self.role = role

    # -------------------------
    # READERS (GET endpoints)
    # -------------------------
    def load_project(self) -> Optional[Dict[str, Any]]:
        """
        Reads:
          Data/project_descriptions/{user_id}_projects.json
        Expected:
          {"Name": "...", "description": "..."}
        """
        try:
            with open(f"Data/project_descriptions/{self.user_id}_projects.json", "r") as file:
                print("Loading project for user:", self.user_id)
                data = json.load(file)
                return data if isinstance(data, dict) else None
        except FileNotFoundError:
            return None

    def load_wet(self) -> Dict[str, Any]:
        """
        Reads:
          Data/updates/{user_id}_wet_updates.json
        Expected:
          {"Data": "...", "Text_Update": "..."}
        Returns {} if missing.
        """
        try:
            with open(f"Data/updates/{self.user_id}_wet_updates.json", "r") as file:
                data = json.load(file)
                return data if isinstance(data, dict) else {}
        except FileNotFoundError:
            return {}

    def load_dry(self) -> Dict[str, Any]:
        """
        Reads:
          Data/updates/{user_id}_dry_updates.json
        Expected:
          {"Data": "...", "Text_Update": "..."}
        Returns {} if missing.
        """
        try:
            with open(f"Data/updates/{self.user_id}_dry_updates.json", "r") as file:
                data = json.load(file)
                return data if isinstance(data, dict) else {}
        except FileNotFoundError:
            return {}

    # -------------------------
    # WRITERS (POST endpoints)
    # -------------------------
    def add_update(self, update: Dict[str, Any]) -> None:
        """
        Appends to:
          Data/updates/{user_id}_updates.json
        Expected:
          {"Data": "...", "Text_Update": "..."}
        """
        os.makedirs("Data/updates", exist_ok=True)
        path = f"Data/updates/{self.user_id}_updates.json"
        try:
            with open(path, "r") as file:
                updates = json.load(file)
                if not isinstance(updates, list):
                    updates = []
        except FileNotFoundError:
            updates = []

        updates.append(update)
        with open(path, "w") as file:
            json.dump(updates, file, indent=2)



    def compute_wet_and_dry(self) -> None:
        update = f"Data/{self.user_id}_updates.json"
        main()
      


class Lab:
    def __init__(self) -> None:
        self._users: Dict[str, User] = {}

    def get_user(self, user_id: str) -> Optional[User]:
        return self._users.get(user_id)

    def add_user(self, user: User) -> None:
        self._users[user.user_id] = user