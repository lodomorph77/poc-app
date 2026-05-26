const notes = new Map(); // userId → Map(noteId → note)

const bucket = (userId) => {
  if (!notes.has(userId)) notes.set(userId, new Map());
  return notes.get(userId);
};

const list = (userId) =>
  [...bucket(userId).values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const create = (userId, note) => {
  bucket(userId).set(note.id, note);
  return note;
};

const findById = (userId, id) => bucket(userId).get(id) || null;

const remove = (userId, id) => {
  const b = bucket(userId);
  const existed = b.has(id);
  b.delete(id);
  return existed;
};

const clear = () => notes.clear();

module.exports = { list, create, findById, remove, clear };
