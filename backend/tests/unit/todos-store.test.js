const store = require('../../src/store/todos');

beforeEach(() => store.clear());

const UID = 'user-1';
const todo = (overrides = {}) => ({
  id: 't1', userId: UID, title: 'Buy milk', description: '', completed: false,
  createdAt: new Date().toISOString(), ...overrides,
});

describe('todos store', () => {
  it('creates and lists a todo', () => {
    store.create(UID, todo());
    expect(store.list(UID)).toHaveLength(1);
  });

  it('lists only active todos', () => {
    store.create(UID, todo({ id: 't1', completed: false }));
    store.create(UID, todo({ id: 't2', completed: true }));
    expect(store.list(UID, 'active')).toHaveLength(1);
  });

  it('lists only completed todos', () => {
    store.create(UID, todo({ id: 't1', completed: false }));
    store.create(UID, todo({ id: 't2', completed: true }));
    expect(store.list(UID, 'completed')).toHaveLength(1);
  });

  it('updates completed flag', () => {
    store.create(UID, todo());
    const updated = store.update(UID, 't1', { completed: true });
    expect(updated.completed).toBe(true);
  });

  it('returns null when updating non-existent todo', () => {
    expect(store.update(UID, 'ghost', { completed: true })).toBeNull();
  });

  it('removes a todo and returns true', () => {
    store.create(UID, todo());
    expect(store.remove(UID, 't1')).toBe(true);
    expect(store.list(UID)).toHaveLength(0);
  });

  it('returns false when removing non-existent todo', () => {
    expect(store.remove(UID, 'ghost')).toBe(false);
  });

  it('stats reflect current state', () => {
    store.create(UID, todo({ id: 't1', completed: false }));
    store.create(UID, todo({ id: 't2', completed: true }));
    const s = store.stats(UID);
    expect(s.total).toBe(2);
    expect(s.completed).toBe(1);
    expect(s.active).toBe(1);
  });

  it('todos are scoped per user', () => {
    store.create('user-a', todo({ id: 'ta' }));
    store.create('user-b', todo({ id: 'tb' }));
    expect(store.list('user-a')).toHaveLength(1);
    expect(store.list('user-b')).toHaveLength(1);
  });
});
