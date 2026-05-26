const store = require('../../src/store/users');

beforeEach(() => store.clear());

describe('user store', () => {
  const base = { id: 'u1', name: 'Alice', email: 'Alice@Example.com', password: 'hash', bio: '', createdAt: '2024-01-01T00:00:00.000Z' };

  it('creates and finds a user by id', () => {
    store.create(base);
    const found = store.findById('u1');
    expect(found.name).toBe('Alice');
  });

  it('normalises email to lowercase on create', () => {
    store.create(base);
    const found = store.findByEmail('alice@example.com');
    expect(found).not.toBeNull();
  });

  it('returns null for an unknown id', () => {
    expect(store.findById('missing')).toBeNull();
  });

  it('returns null for an unknown email', () => {
    expect(store.findByEmail('nobody@example.com')).toBeNull();
  });

  it('updates allowed fields and preserves id and email', () => {
    store.create(base);
    const updated = store.update('u1', { name: 'Alice Updated', bio: 'new bio' });
    expect(updated.name).toBe('Alice Updated');
    expect(updated.bio).toBe('new bio');
    expect(updated.id).toBe('u1');
    expect(updated.email).toBe('alice@example.com');
  });

  it('returns null when updating a non-existent user', () => {
    expect(store.update('ghost', { name: 'x' })).toBeNull();
  });

  it('tracks count correctly', () => {
    expect(store.count()).toBe(0);
    store.create(base);
    expect(store.count()).toBe(1);
    store.clear();
    expect(store.count()).toBe(0);
  });
});
