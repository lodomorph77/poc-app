const users = new Map();

const findByEmail = (email) =>
  [...users.values()].find((u) => u.email === email.toLowerCase()) || null;

const findById = (id) => users.get(id) || null;

const create = (user) => {
  const record = { ...user, email: user.email.toLowerCase() };
  users.set(record.id, record);
  return record;
};

const update = (id, updates) => {
  const user = users.get(id);
  if (!user) return null;
  const updated = { ...user, ...updates, id, email: user.email };
  users.set(id, updated);
  return updated;
};

const clear = () => users.clear();

const count = () => users.size;

module.exports = { findByEmail, findById, create, update, clear, count };
