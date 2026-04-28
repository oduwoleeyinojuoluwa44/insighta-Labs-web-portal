import React from 'react';
import { apiService } from '../services/api.service.js';

export function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const authUrl = await apiService.getAuthorizationUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate login');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h1>Insighta Labs+</h1>
        <p>Profile Intelligence Platform</p>

        <button
          onClick={handleGitHubLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            marginTop: '20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: '#24292e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Connecting...' : 'Login with GitHub'}
        </button>

        {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

        <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
          Secure authentication powered by GitHub OAuth 2.0
        </p>
      </div>
    </div>
  );
}
