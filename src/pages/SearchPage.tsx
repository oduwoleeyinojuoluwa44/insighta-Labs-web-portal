import React from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api.service.js';
import { Profile } from '../types/index.js';

export function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      setProfiles(await apiService.searchProfiles(query, { limit: 20, page: 1 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Search</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="young males from nigeria" style={{ flex: 1, padding: 10 }} />
        <button onClick={runSearch}>Search</button>
      </div>
      {loading && <p>Searching...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            <Link to={`/profiles/${profile.id}`}>{profile.name}</Link> - {profile.gender}, {profile.age}, {profile.country_name}
          </li>
        ))}
      </ul>
    </main>
  );
}
