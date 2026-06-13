export async function login(email, password) {
  // Simple stub: use mock file for development
  const res = await fetch('/specs/004-login-dashboard/mocks/auth.json');
  if (!res.ok) throw new Error('Auth error');
  const data = await res.json();
  return data;
}
