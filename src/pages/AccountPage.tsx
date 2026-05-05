import { useAuth } from '../hooks/index.js';

export function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <main style={{ padding: 24 }}>
      <h1>Account</h1>
      <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
      <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
      <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
      <button onClick={logout}>Logout</button>
    </main>
  );
}
