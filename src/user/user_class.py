import json
from typing import Dict, Any, Optional


class User:
    def __init__(self, user_id: str, name: str, role: str):
        self.user_id = user_id
        self.name = name
        self.role = role
        
        self.project_description = self.input_description()
        if not self.project_description:
            self.project_description = self.add_project_description()
        self.updates = self.load_past_updates()

        # Load wet/dry once at init (OK for read-only), but consider reloading on each GET if files can change
        self.wet_pub_updates = self.load_update("wet")
        self.dry_pub_updates = self.load_update("dry")

    def load_project_description(self):
        def input_description(self):
            try:
                with open(f"Data/project_descriptions/{self.user_id}_projects.json", "r") as file:
                    data = json.load(file)
                    return data.get("Description", "")
            except FileNotFoundError:
                return False

            return {}
    def add_project_description(self, name: str, description: str) -> dict:
        if not name or not isinstance(name, str):
            raise ValueError("Name must be a non-empty string")

        if not description or not isinstance(description, str):
            raise ValueError("Description must be a non-empty string")

        project_data = {
            "Name": name,
            "Description": description
        }


        with open(f"Data/project_descriptions/{self.user_id}_projects.json", "w") as file:
            json.dump(project_data, file, indent=2)

        self.project_descriptions = project_data

        return project_data        
    def load_past_updates(self):
        try:
            with open(f"Data/updates/{self.user_id}_updates.json", "r") as file:
                return json.load(file)
        except FileNotFoundError:
            return {}

    def load_update(self, update_type: str):
        try:
            with open(f"Data/updates/{self.user_id}_{update_type}_updates.json", "r") as file:
                return json.load(file)
        except FileNotFoundError:
            return {}

    def get_updates(self, update_type: str):
        if update_type == "wet":
            # If the file can change while server runs, do: return self.load_update("wet")
            return self.wet_pub_updates
        if update_type == "dry":
            return self.dry_pub_updates
        if update_type == "all":
            return self.wet_pub_updates, self.dry_pub_updates
        raise ValueError("update_type must be 'wet', 'dry', or 'all'")

    def add_update(self, update_type: str, update_payload: dict):
        # implement later: load file, append, write back
        raise NotImplementedError

    def generate_update(self):
        # implement later
        raise NotImplementedError


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
    


# lab = Lab()
# lab.create_user(user_id="123", name="Alice", role="student")
# # lab.create_user(user_id="456", email="bob@example.com", name="Bob", role="researcher")



# user = lab.get_user("123")
# if user:
#     wet_updates = user.get_updates("wet")
#     print(wet_updates)
# else:
#     print("User not found")