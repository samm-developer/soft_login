import { API_URL } from './authConfig';

export async function loginWithMicrosoft(idToken) {
  const res = await fetch(`${API_URL}/auth/microsoft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || `Login failed (${res.status})`);
  }
  return body;
}
