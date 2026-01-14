from __future__ import annotations

import json
import os
from typing import Dict, Any, Optional, List


class User:
    def __init__(self, user_id: str, name: str, role: str):
        self.user_id = user_id
        self.name = name
        self.role = role

    # -------------------------
    # READERS
    # -------------------------
    def load_project_description(self) -> Optional[Dict[str, Any]]:
        """
        Reads flat JSON:
          Data/project_descriptions/{user_id}_projects.json

        Expected:
          {"Name": "...", "description": "..."}
        Returns None if missing.
        """
        try:
            with open(f"Data/project_descriptions/{self.user_id}_projects.json", "r") as file:
                data = json.load(file)
                return data if isinstance(data, dict) else None
        except FileNotFoundError:
            return None

    def load_update(self, update_type: str) -> Dict[str, Any]:
        """
        Reads:
          Data/updates/{user_id}_{update_type}_updates.json

        update_type: "wet" or "dry"
        Expected object:
          {"Data": "...", "Text_Update": "..."}
        Returns {} if missing.
        """
        try:
            with open(f"Data/updates/{self.user_id}_{update_type}_updates.json", "r") as file:
                data = json.load(file)
                return data if isinstance(data, dict) else {}
        except FileNotFoundError:
            return {}

    def load_past_updates(self) -> List[Dict[str, Any]]:
        """
        Reads append-only list:
          Data/updates/{user_id}_updates.json

        Expected list:
          [{"Data": "...", "Text_Update": "..."}, ...]
        Returns [] if missing.
        """
        try:
            with open(f"Data/updates/{self.user_id}_updates.json", "r") as file:
                data = json.load(file)
                return data if isinstance(data, list) else []
        except FileNotFoundError:
            return []

    # -------------------------
    # WRITERS
    # -------------------------
    def add_project(self, project: Dict[str, Any]) -> None:
        """
        Overwrites:
          Data/project_descriptions/{user_id}_projects.json

        Expected:
          {"Name": "...", "description": "..."}
        """
        os.makedirs("Data/project_descriptions", exist_ok=True)
        with open(f"Data/project_descriptions/{self.user_id}_projects.json", "w") as file:
            json.dump(project, file, indent=2)

    def add_update(self, update: Dict[str, Any]) -> None:
        """
        Appends to:
          Data/updates/{user_id}_updates.json

        Expected:
          {"Data": "...", "Text_Update": "..."}
        """
        os.makedirs("Data/updates", exist_ok=True)

        try:
            with open(f"Data/updates/{self.user_id}_updates.json", "r") as file:
                updates = json.load(file)
                if not isinstance(updates, list):
                    updates = []
        except FileNotFoundError:
            updates = []

        updates.append(update)

        with open(f"Data/updates/{self.user_id}_updates.json", "w") as file:
            json.dump(updates, file, indent=2)

    def save_wet_update(self, wet_obj: Dict[str, Any]) -> None:
        """
        Overwrites:
          Data/updates/{user_id}_wet_updates.json

        Expected:
          {"Data": "...", "Text_Update": "..."}
        """
        os.makedirs("Data/updates", exist_ok=True)
        with open(f"Data/updates/{self.user_id}_wet_updates.json", "w") as file:
            json.dump(wet_obj, file, indent=2)

    def save_dry_update(self, dry_obj: Dict[str, Any]) -> None:
        """
        Overwrites:
          Data/updates/{user_id}_dry_updates.json

        Expected:
          {"Data": "...", "Text_Update": "..."}
        """
        os.makedirs("Data/updates", exist_ok=True)
        with open(f"Data/updates/{self.user_id}_dry_updates.json", "w") as file:
            json.dump(dry_obj, file, indent=2)


class Lab:
    def __init__(self) -> None:
        self._users: Dict[str, User] = {}

    def get_user(self, user_id: str) -> Optional[User]:
        return self._users.get(user_id)

    def create_user(self, user_id: str, name: str, role: str) -> User:
        if user_id in self._users:
            raise ValueError("User already exists")
        user = User(user_id=user_id, name=name, role=role)
        self._users[user_id] = user
        return user
