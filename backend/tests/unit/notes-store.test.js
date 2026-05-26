const store = require('../../src/store/notes');

beforeEach(() => store.clear());

const UID = 'user-1';
const note = (overrides = {}) => ({
  id: 'n1', userId: UID, title: 'My note', content: 'some content',
  createdAt: new Date().toISOString(), ...overrides,
});

describe('notes store', () => {
  it('creates and lists a note', () => {
    store.create(UID, note());
    expect(store.list(UID)).toHaveLength(1);
  });

  it('finds a note by id', () => {
    store.create(UID, note());
    expect(store.findById(UID, 'n1')).not.toBeNull();
  });

  it('returns null for unknown id', () => {
    expect(store.findById(UID, 'ghost')).toBeNull();
  });

  it('removes a note and returns true', () => {
    store.create(UID, note());
    expect(store.remove(UID, 'n1')).toBe(true);
    expect(store.list(UID)).toHaveLength(0);
  });

  it('returns false when removing non-existent note', () => {
    expect(store.remove(UID, 'ghost')).toBe(false);
  });

  it('notes are scoped per user', () => {
    store.create('user-a', note({ id: 'na' }));
    store.create('user-b', note({ id: 'nb' }));
    expect(store.list('user-a')).toHaveLength(1);
    expect(store.list('user-b')).toHaveLength(1);
  });
});
