const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store/notes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.list(req.user.id));
});

router.post('/', (req, res) => {
  const { title, content } = req.body || {};
  if (!title?.trim()) return res.status(400).json({ error: 'title is required' });
  const note = store.create(req.user.id, {
    id: uuidv4(),
    userId: req.user.id,
    title: title.trim(),
    content: content?.trim() || '',
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(note);
});

router.delete('/:id', (req, res) => {
  const removed = store.remove(req.user.id, req.params.id);
  if (!removed) return res.status(404).json({ error: 'note not found' });
  res.status(204).end();
});

module.exports = router;
