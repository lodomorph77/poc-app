import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/client';

const FILTERS = ['all', 'active', 'completed'];

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDesc, setShowDesc] = useState(false);
  const [error, setError] = useState('');

  const load = (f = filter) =>
    getTodos(f).then(setTodos).catch(() => {});

  useEffect(() => { load(); }, [filter]);

  const add = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const todo = await createTodo(title, description);
      setTitle(''); setDescription(''); setShowDesc(false);
      setTodos((prev) => [todo, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      if (filter !== 'all') load();
    } catch {}
  };

  const remove = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {}
  };

  return (
    <div className="page" data-testid="todos-page">
      <h1>Todos</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={add} className="expand-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            data-testid="todo-title-input"
          />
          <button type="button" className="btn btn-ghost" onClick={() => setShowDesc((s) => !s)}
            data-testid="todo-toggle-desc">
            {showDesc ? 'Less' : '+ Note'}
          </button>
          <button type="submit" className="btn btn-primary" data-testid="todo-add-btn">Add</button>
        </div>
        {showDesc && (
          <textarea
            placeholder="Optional description…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-testid="todo-desc-input"
          />
        )}
      </form>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
            data-testid={`filter-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {todos.length === 0 ? (
        <p className="empty" data-testid="todos-empty">
          {filter === 'all' ? 'No todos yet — add one above.' : `No ${filter} todos.`}
        </p>
      ) : (
        <div className="item-list" data-testid="todos-list">
          {todos.map((todo) => (
            <div key={todo.id} className={`todo-item${todo.completed ? ' done' : ''}`} data-testid="todo-item">
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => toggle(todo)}
                data-testid="todo-checkbox"
              />
              <div className="todo-body">
                <div className="todo-title" data-testid="todo-title">{todo.title}</div>
                {todo.description && <div className="todo-desc">{todo.description}</div>}
              </div>
              <div className="todo-actions">
                <button
                  className="btn btn-ghost"
                  style={{ padding: '4px 10px', fontSize: '.8rem' }}
                  onClick={() => remove(todo.id)}
                  data-testid="todo-delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
