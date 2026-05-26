import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/client';

export default function Register({ onAuth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await register(name, email, password);
      localStorage.setItem('token', data.token);
      onAuth(data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Create account</h1>
      {error && <p className="error" data-testid="error-msg">{error}</p>}
      <form onSubmit={submit}>
        <label htmlFor="name">Full name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required data-testid="name-input" />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="email-input" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} data-testid="password-input" />
        <button type="submit" data-testid="register-btn">Create account</button>
      </form>
      <p className="link">Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}
