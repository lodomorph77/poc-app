import { Link, useLocation } from 'react-router-dom';

export default function Nav({ email, onLogout }) {
  const { pathname } = useLocation();
  const cls = (path) => (pathname === path ? 'active' : '');

  return (
    <nav className="topnav" data-testid="topnav">
      <div className="topnav-links">
        <Link to="/dashboard" className={cls('/dashboard')} data-testid="nav-dashboard">Dashboard</Link>
        <Link to="/todos"     className={cls('/todos')}     data-testid="nav-todos">Todos</Link>
        <Link to="/notes"     className={cls('/notes')}     data-testid="nav-notes">Notes</Link>
        <Link to="/profile"   className={cls('/profile')}   data-testid="nav-profile">Profile</Link>
      </div>
      <div className="topnav-user">
        <span data-testid="nav-email">{email}</span>
        <button onClick={onLogout} data-testid="logout-btn">Sign out</button>
      </div>
    </nav>
  );
}
