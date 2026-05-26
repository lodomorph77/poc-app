import { useState, useEffect } from 'react';
import { getNotes, createNote, deleteNote } from '../api/client';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { getNotes().then(setNotes).catch(() => {}); }, []);

  const add = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const note = await createNote(title, content);
      setNotes((prev) => [note, ...prev]);
      setTitle(''); setContent(''); setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  return (
    <div className="page" data-testid="notes-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Notes</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)} data-testid="new-note-btn">
          {showForm ? 'Cancel' : '+ New note'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={add} className="expand-form" data-testid="note-form">
          {error && <p className="error">{error}</p>}
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            data-testid="note-title-input"
          />
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            placeholder="Write your note…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            data-testid="note-content-input"
          />
          <button type="submit" className="btn btn-primary" data-testid="note-save-btn">Save note</button>
        </form>
      )}

      {notes.length === 0 ? (
        <p className="empty" data-testid="notes-empty">No notes yet — create one above.</p>
      ) : (
        <div className="item-list" data-testid="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-item" data-testid="note-item">
              <div className="note-body">
                <div className="note-title" data-testid="note-title">{note.title}</div>
                {note.content && <div className="note-content">{note.content}</div>}
                <div className="note-date">{new Date(note.createdAt).toLocaleString()}</div>
              </div>
              <button
                className="btn btn-ghost"
                style={{ marginLeft: 12, padding: '4px 10px', fontSize: '.8rem' }}
                onClick={() => remove(note.id)}
                data-testid="note-delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
