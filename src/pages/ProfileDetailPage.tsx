import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiService } from '../services/api.service.js';
import { Profile } from '../types/index.js';

export function ProfileDetailPage() {
  const { id } = useParams();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    apiService.getProfile(id).then(setProfile).catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'));
  }, [id]);

  if (error) return <main style={{ padding: 24 }}><p style={{ color: 'red' }}>{error}</p><Link to="/profiles">Back</Link></main>;
  if (!profile) return <main style={{ padding: 24 }}>Loading profile...</main>;

  return (
    <main style={{ padding: 24 }}>
      <Link to="/profiles">Back to profiles</Link>
      <h1>{profile.name}</h1>
      <dl>
        <dt>Age</dt><dd>{profile.age}</dd>
        <dt>Gender</dt><dd>{profile.gender}</dd>
        <dt>Age group</dt><dd>{profile.age_group}</dd>
        <dt>Country</dt><dd>{profile.country_name} ({profile.country_id})</dd>
        <dt>Gender confidence</dt><dd>{profile.gender_probability}</dd>
        <dt>Country confidence</dt><dd>{profile.country_probability}</dd>
      </dl>
    </main>
  );
}
