const BASE = '/api';

const json = (extra = {}) => ({ 'Content-Type': 'application/json', ...extra });
const auth = () => {
  const t = localStorage.getItem('token');
  return json(t ? { Authorization: `Bearer ${t}` } : {});
};
const handle = async (res) => {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (name, email, password) =>
  fetch(`${BASE}/auth/register`, { method: 'POST', headers: json(), body: JSON.stringify({ name, email, password }) }).then(handle);

export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, { method: 'POST', headers: json(), body: JSON.stringify({ email, password }) }).then(handle);

export const getMe = () =>
  fetch(`${BASE}/auth/me`, { headers: auth() }).then(handle);

// ── Profile ───────────────────────────────────────────────────────────────────
export const getProfile = () =>
  fetch(`${BASE}/profile`, { headers: auth() }).then(handle);

export const updateProfile = (name, bio) =>
  fetch(`${BASE}/profile`, { method: 'PUT', headers: auth(), body: JSON.stringify({ name, bio }) }).then(handle);

// ── Todos ─────────────────────────────────────────────────────────────────────
export const getTodos = (status) => {
  const q = status && status !== 'all' ? `?status=${status}` : '';
  return fetch(`${BASE}/todos${q}`, { headers: auth() }).then(handle);
};

export const getTodoStats = () =>
  fetch(`${BASE}/todos/stats`, { headers: auth() }).then(handle);

export const createTodo = (title, description) =>
  fetch(`${BASE}/todos`, { method: 'POST', headers: auth(), body: JSON.stringify({ title, description }) }).then(handle);

export const updateTodo = (id, updates) =>
  fetch(`${BASE}/todos/${id}`, { method: 'PUT', headers: auth(), body: JSON.stringify(updates) }).then(handle);

export const deleteTodo = (id) =>
  fetch(`${BASE}/todos/${id}`, { method: 'DELETE', headers: auth() }).then(handle);

// ── Notes ─────────────────────────────────────────────────────────────────────
export const getNotes = () =>
  fetch(`${BASE}/notes`, { headers: auth() }).then(handle);

export const createNote = (title, content) =>
  fetch(`${BASE}/notes`, { method: 'POST', headers: auth(), body: JSON.stringify({ title, content }) }).then(handle);

export const deleteNote = (id) =>
  fetch(`${BASE}/notes/${id}`, { method: 'DELETE', headers: auth() }).then(handle);
