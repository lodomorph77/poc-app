const express = require('express');
const store = require('../store/users');

const router = express.Router();

router.get('/', (req, res) => {
  const user = store.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ id: user.id, name: user.name, email: user.email, bio: user.bio || '', createdAt: user.createdAt });
});

router.put('/', (req, res) => {
  const { name, bio } = req.body || {};
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (bio !== undefined) updates.bio = bio;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'provide at least one of: name, bio' });
  }
  const updated = store.update(req.user.id, updates);
  if (!updated) return res.status(404).json({ error: 'user not found' });
  res.json({ id: updated.id, name: updated.name, email: updated.email, bio: updated.bio || '' });
});

module.exports = router;
