const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store/todos');

const router = express.Router();

router.get('/stats', (req, res) => {
  res.json(store.stats(req.user.id));
});

router.get('/', (req, res) => {
  const { status } = req.query;
  res.json(store.list(req.user.id, status));
});

router.post('/', (req, res) => {
  const { title, description } = req.body || {};
  if (!title?.trim()) return res.status(400).json({ error: 'title is required' });
  const todo = store.create(req.user.id, {
    id: uuidv4(),
    userId: req.user.id,
    title: title.trim(),
    description: description?.trim() || '',
    completed: false,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(todo);
});

router.put('/:id', (req, res) => {
  const { title, description, completed } = req.body || {};
  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (completed !== undefined) updates.completed = Boolean(completed);
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'provide at least one field to update' });
  }
  const updated = store.update(req.user.id, req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'todo not found' });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const removed = store.remove(req.user.id, req.params.id);
  if (!removed) return res.status(404).json({ error: 'todo not found' });
  res.status(204).end();
});

module.exports = router;
