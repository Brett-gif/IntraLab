const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000";

export async function fetchAllUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json() as Promise<{ users: Array<{ user_id: string; name: string; email: string; role: string }> }>;
}

export async function fetchDashboard(userId: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}/dashboard`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

export async function submitUpdate(
  userId: string,
  payload: { text: string; project_id?: string; update_type?: "wet" | "dry" }
) {
  const res = await fetch(`${BASE_URL}/users/${userId}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}