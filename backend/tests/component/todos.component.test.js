process.env.JWT_SECRET = 'test-secret-component';

const request = require('supertest');
const app = require('../../src/app');
const userStore = require('../../src/store/users');
const todoStore = require('../../src/store/todos');

let token;

beforeEach(async () => {
  userStore.clear();
  todoStore.clear();
  const res = await request(app).post('/api/auth/register')
    .send({ name: 'Todo User', email: 'todo@example.com', password: 'pass1234' });
  token = res.body.token;
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('POST /api/todos', () => {
  it('creates a todo and returns 201', async () => {
    const res = await request(app).post('/api/todos').set(auth())
      .send({ title: 'Buy milk' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Buy milk');
    expect(res.body.completed).toBe(false);
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/todos').set(auth()).send({});
    expect(res.status).toBe(400);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).post('/api/todos').send({ title: 'x' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/todos', () => {
  beforeEach(async () => {
    await request(app).post('/api/todos').set(auth()).send({ title: 'Active todo' });
    const created = await request(app).post('/api/todos').set(auth()).send({ title: 'Done todo' });
    await request(app).put(`/api/todos/${created.body.id}`).set(auth()).send({ completed: true });
  });

  it('returns all todos', async () => {
    const res = await request(app).get('/api/todos').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('filters by active', async () => {
    const res = await request(app).get('/api/todos?status=active').set(auth());
    expect(res.body.every((t) => !t.completed)).toBe(true);
  });

  it('filters by completed', async () => {
    const res = await request(app).get('/api/todos?status=completed').set(auth());
    expect(res.body.every((t) => t.completed)).toBe(true);
  });
});

describe('PUT /api/todos/:id', () => {
  let todoId;
  beforeEach(async () => {
    const res = await request(app).post('/api/todos').set(auth()).send({ title: 'Toggle me' });
    todoId = res.body.id;
  });

  it('toggles completed to true', async () => {
    const res = await request(app).put(`/api/todos/${todoId}`).set(auth()).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).put('/api/todos/ghost').set(auth()).send({ completed: true });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/todos/:id', () => {
  it('deletes a todo and returns 204', async () => {
    const created = await request(app).post('/api/todos').set(auth()).send({ title: 'Delete me' });
    const res = await request(app).delete(`/api/todos/${created.body.id}`).set(auth());
    expect(res.status).toBe(204);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/todos/ghost').set(auth());
    expect(res.status).toBe(404);
  });
});

describe('GET /api/todos/stats', () => {
  it('returns correct counts', async () => {
    await request(app).post('/api/todos').set(auth()).send({ title: 'T1' });
    const t2 = await request(app).post('/api/todos').set(auth()).send({ title: 'T2' });
    await request(app).put(`/api/todos/${t2.body.id}`).set(auth()).send({ completed: true });

    const res = await request(app).get('/api/todos/stats').set(auth());
    expect(res.body).toMatchObject({ total: 2, completed: 1, active: 1 });
  });
});
