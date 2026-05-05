import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useProfiles } from '../hooks/index.js';
import { Profile } from '../types/index.js';

export function BrowserPage() {
  const { user, logout } = useAuth();
  const { profiles, loading, error, fetchProfiles, searchProfiles, exportProfiles, setFilters } = useProfiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setLocalFilters] = useState({ gender: '', country_id: '', age_group: '' });

  React.useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchProfiles(searchQuery);
    } else {
      fetchProfiles();
    }
  };

  const handleFilter = () => {
    const filterObj = {
      gender: filters.gender || undefined,
      country_id: filters.country_id || undefined,
      age_group: filters.age_group || undefined,
      limit: 10,
      page: 1,
    };
    setFilters(filterObj);
    if (searchQuery.trim()) {
      searchProfiles(searchQuery, filterObj);
    } else {
      fetchProfiles(filterObj);
    }
  };

  const handleExport = () => {
    exportProfiles();
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Profile Browser</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>{user?.username || user?.email}</span>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/search">Search</Link>
          <Link to="/account">Account</Link>
          <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          <input
            type="text"
            placeholder="Gender"
            value={filters.gender}
            onChange={(e) => setLocalFilters({ ...filters, gender: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="Location"
            value={filters.country_id}
            onChange={(e) => setLocalFilters({ ...filters, country_id: e.target.value.toUpperCase() })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="Age group"
            value={filters.age_group}
            onChange={(e) => setLocalFilters({ ...filters, age_group: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSearch}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Search
          </button>
          <button
            onClick={handleFilter}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Apply Filters
          </button>
          <button
            onClick={handleExport}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}

      {/* Loading State */}
      {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Loading profiles...</div>}

      {/* Profiles Grid */}
      {!loading && profiles.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {profiles.map((profile: Profile) => (
            <div
              key={profile.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h3>
                <Link to={`/profiles/${profile.id}`}>{profile.name}</Link>
              </h3>
              <p>
                <strong>Age:</strong> {profile.age || 'N/A'}
              </p>
              <p>
                <strong>Gender:</strong> {profile.gender || 'N/A'}
              </p>
              <p>
                <strong>Age Group:</strong> {profile.age_group || 'N/A'}
              </p>
              <p>
                <strong>Country:</strong> {profile.country_name || profile.country_id || 'N/A'}
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Gender confidence: {profile.gender_probability} | Country confidence: {profile.country_probability}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && profiles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No profiles found</div>
      )}
    </div>
  );
}
