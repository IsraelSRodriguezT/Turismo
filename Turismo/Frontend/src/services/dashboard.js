export async function getSummary() {
  const res = await fetch('/specs/004-login-dashboard/mocks/dashboard.json');
  if (!res.ok) throw new Error('Dashboard error');
  return await res.json();
}
