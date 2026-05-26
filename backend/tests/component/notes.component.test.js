process.env.JWT_SECRET = 'test-secret-component';

const request = require('supertest');
const app = require('../../src/app');
const userStore = require('../../src/store/users');
const noteStore = require('../../src/store/notes');

let token;

beforeEach(async () => {
  userStore.clear();
  noteStore.clear();
  const res = await request(app).post('/api/auth/register')
    .send({ name: 'Note User', email: 'notes@example.com', password: 'pass1234' });
  token = res.body.token;
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('POST /api/notes', () => {
  it('creates a note and returns 201', async () => {
    const res = await request(app).post('/api/notes').set(auth())
      .send({ title: 'Meeting notes', content: 'Discuss roadmap' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Meeting notes');
    expect(res.body.content).toBe('Discuss roadmap');
  });

  it('creates a note with no content', async () => {
    const res = await request(app).post('/api/notes').set(auth()).send({ title: 'Quick note' });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/notes').set(auth()).send({ content: 'no title' });
    expect(res.status).toBe(400);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).post('/api/notes').send({ title: 'x' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/notes', () => {
  it('returns all notes for the user', async () => {
    await request(app).post('/api/notes').set(auth()).send({ title: 'Note A' });
    await request(app).post('/api/notes').set(auth()).send({ title: 'Note B' });
    const res = await request(app).get('/api/notes').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('returns empty array when no notes exist', async () => {
    const res = await request(app).get('/api/notes').set(auth());
    expect(res.body).toEqual([]);
  });
});

describe('DELETE /api/notes/:id', () => {
  it('deletes a note and returns 204', async () => {
    const created = await request(app).post('/api/notes').set(auth()).send({ title: 'Delete me' });
    const res = await request(app).delete(`/api/notes/${created.body.id}`).set(auth());
    expect(res.status).toBe(204);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).delete('/api/notes/ghost').set(auth());
    expect(res.status).toBe(404);
  });
});
