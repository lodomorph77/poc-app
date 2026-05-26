import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Todos from './pages/Todos';
import Notes from './pages/Notes';

export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });

  const handleAuth = (userData) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login onAuth={handleAuth} />} />
          <Route path="/register" element={<Register onAuth={handleAuth} />} />
          <Route path="*"         element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Nav email={user.email} onLogout={handleLogout} />
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/todos"     element={<Todos />} />
        <Route path="/notes"     element={<Notes />} />
        <Route path="/profile"   element={<Profile user={user} onUpdate={(u) => setUser((prev) => ({ ...prev, ...u }))} onLogout={handleLogout} />} />
        <Route path="*"          element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
