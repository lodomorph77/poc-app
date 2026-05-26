import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/client';

export default function Profile({ onUpdate }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile().then((p) => { setName(p.name); setBio(p.bio); setEmail(p.email); }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const updated = await updateProfile(name, bio);
      setMsg('Profile updated successfully');
      onUpdate?.({ name: updated.name, email: updated.email });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page" data-testid="profile-page">
      <h1>Your profile</h1>
      <div className="card">
        {msg && <p className="success" data-testid="success-msg">{msg}</p>}
        {error && <p className="error" data-testid="error-msg">{error}</p>}
        <form onSubmit={submit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} readOnly style={{ background: '#f9fafb', color: '#6b7280' }} />
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required data-testid="name-input" />
          <label htmlFor="bio">Bio</label>
          <input id="bio" type="text" value={bio} onChange={(e) => setBio(e.target.value)} data-testid="bio-input" />
          <button type="submit" className="btn btn-primary btn-full" data-testid="save-btn">Save changes</button>
        </form>
      </div>
    </div>
  );
}
