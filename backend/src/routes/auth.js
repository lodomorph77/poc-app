const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/token');
const { authMiddleware } = require('../middleware/auth');
const store = require('../store/users');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }
  if (store.findByEmail(email)) {
    return res.status(409).json({ error: 'email already registered' });
  }
  const hashed = await hashPassword(password);
  const user = store.create({
    id: uuidv4(),
    name,
    email,
    password: hashed,
    bio: '',
    createdAt: new Date().toISOString(),
  });
  const token = generateToken({ id: user.id, email: user.email });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  const user = store.findByEmail(email);
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = generateToken({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = store.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ id: user.id, name: user.name, email: user.email, bio: user.bio });
});

module.exports = router;
