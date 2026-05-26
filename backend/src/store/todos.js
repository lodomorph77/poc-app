const todos = new Map(); // userId → Map(todoId → todo)

const bucket = (userId) => {
  if (!todos.has(userId)) todos.set(userId, new Map());
  return todos.get(userId);
};

const list = (userId, status) => {
  const all = [...bucket(userId).values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (status === 'active') return all.filter((t) => !t.completed);
  if (status === 'completed') return all.filter((t) => t.completed);
  return all;
};

const create = (userId, todo) => {
  bucket(userId).set(todo.id, todo);
  return todo;
};

const findById = (userId, id) => bucket(userId).get(id) || null;

const update = (userId, id, updates) => {
  const b = bucket(userId);
  const todo = b.get(id);
  if (!todo) return null;
  const updated = { ...todo, ...updates, id, userId };
  b.set(id, updated);
  return updated;
};

const remove = (userId, id) => {
  const b = bucket(userId);
  const existed = b.has(id);
  b.delete(id);
  return existed;
};

const stats = (userId) => {
  const all = [...bucket(userId).values()];
  const completed = all.filter((t) => t.completed).length;
  return { total: all.length, completed, active: all.length - completed };
};

const clear = () => todos.clear();

module.exports = { list, create, findById, update, remove, stats, clear };
