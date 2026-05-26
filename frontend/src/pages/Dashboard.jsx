import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTodoStats, getNotes } from '../api/client';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTodoStats(), getNotes()])
      .then(([s, notes]) => {
        setStats(s);
        setRecentNotes(notes.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) return <div className="page"><p>Loading…</p></div>;

  return (
    <div className="page" data-testid="dashboard-page">
      <h1>Welcome back, {user?.name || 'there'} 👋</h1>

      <div className="stats-grid">
        <div className="stat-card blue" data-testid="stat-total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total todos</div>
        </div>
        <div className="stat-card green" data-testid="stat-completed">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card orange" data-testid="stat-active">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: '.9rem', fontWeight: 600 }}>Completion</span>
          <span style={{ fontSize: '.9rem', color: '#6b7280' }} data-testid="completion-pct">{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} data-testid="progress-fill" />
        </div>
        <Link to="/todos" style={{ fontSize: '.85rem', color: '#2563eb', textDecoration: 'none' }}>
          Manage todos →
        </Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: '1rem' }}>Recent notes</h2>
          <Link to="/notes" style={{ fontSize: '.85rem', color: '#2563eb', textDecoration: 'none' }}>See all →</Link>
        </div>
        {recentNotes.length === 0 ? (
          <p className="empty" style={{ padding: '16px 0' }}>No notes yet. <Link to="/notes">Add one →</Link></p>
        ) : (
          recentNotes.map((n) => (
            <div key={n.id} className="recent-item" data-testid="recent-note">
              <span>{n.title}</span>
              <span style={{ fontSize: '.75rem', color: '#9ca3af' }}>
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
