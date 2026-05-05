import React from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api.service.js';
import { Profile } from '../types/index.js';

export function DashboardPage() {
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiService
      .getProfiles({ limit: 5, page: 1 })
      .then(setProfiles)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading metrics...</p>
      ) : (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <section style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, minWidth: 180 }}>
            <strong>Recent profiles</strong>
            <div style={{ fontSize: 32 }}>{profiles.length}</div>
          </section>
          <section style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, minWidth: 180 }}>
            <strong>Interface</strong>
            <div>Web portal</div>
          </section>
        </div>
      )}
      <nav style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <Link to="/profiles">Profiles</Link>
        <Link to="/search">Search</Link>
        <Link to="/account">Account</Link>
      </nav>
    </main>
  );
}
