require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const todosRoutes = require('./routes/todos');
const notesRoutes = require('./routes/notes');
const { authMiddleware } = require('./middleware/auth');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (_req, res) =>
  res.json({ service: 'poc-backend', version: '1.0.0' })
);

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.use('/api/auth', authRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/todos', authMiddleware, todosRoutes);
app.use('/api/notes', authMiddleware, notesRoutes);

app.use((_req, res) => res.status(404).json({ error: 'not found' }));

module.exports = app;
