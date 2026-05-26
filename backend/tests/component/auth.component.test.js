process.env.JWT_SECRET = 'test-secret-component';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const app = require('../../src/app');
const store = require('../../src/store/users');

beforeEach(() => store.clear());

describe('POST /api/auth/register', () => {
  it('creates a user and returns a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'pass1234' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('alice@example.com');
    expect(res.body.user.password).toBeUndefined();
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
    expect(res.status).toBe(400);
  });

  it('returns 409 when email is already registered', async () => {
    await request(app).post('/api/auth/register').send({ name: 'Alice', email: 'alice@example.com', password: 'pass1234' });
    const res = await request(app).post('/api/auth/register').send({ name: 'Alice2', email: 'alice@example.com', password: 'other' });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({ name: 'Alice', email: 'alice@example.com', password: 'pass1234' });
  });

  it('returns a JWT for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'alice@example.com', password: 'pass1234' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'alice@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: 'pass1234' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'alice@example.com' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Alice', email: 'alice@example.com', password: 'pass1234' });
    token = res.body.token;
  });

  it('returns the current user for a valid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('alice@example.com');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with a tampered token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}bad`);
    expect(res.status).toBe(401);
  });
});
