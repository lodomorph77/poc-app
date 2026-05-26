process.env.JWT_SECRET = 'test-secret-component';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const app = require('../../src/app');
const store = require('../../src/store/users');

let token;

beforeEach(async () => {
  store.clear();
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Bob', email: 'bob@example.com', password: 'pass1234' });
  token = res.body.token;
});

describe('GET /api/profile', () => {
  it('returns the profile for an authenticated user', async () => {
    const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('bob@example.com');
    expect(res.body.name).toBe('Bob');
    expect(res.body.password).toBeUndefined();
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/profile', () => {
  it('updates name and bio', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bobby', bio: 'I love testing' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bobby');
    expect(res.body.bio).toBe('I love testing');
  });

  it('persists changes — GET returns updated values', async () => {
    await request(app).put('/api/profile').set('Authorization', `Bearer ${token}`).send({ bio: 'updated bio' });
    const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);
    expect(res.body.bio).toBe('updated bio');
  });

  it('returns 400 when no fields are provided', async () => {
    const res = await request(app).put('/api/profile').set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
  });

  it('does not allow changing email via profile update', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bobby', email: 'hacker@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('bob@example.com');
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).put('/api/profile').send({ name: 'x' });
    expect(res.status).toBe(401);
  });
});
