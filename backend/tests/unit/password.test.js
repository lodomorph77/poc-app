const { hashPassword, comparePassword } = require('../../src/utils/password');

describe('password utils', () => {
  it('hashes a plain-text password', async () => {
    const hash = await hashPassword('secret123');
    expect(hash).not.toBe('secret123');
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('returns true when the plain password matches the hash', async () => {
    const hash = await hashPassword('mypassword');
    expect(await comparePassword('mypassword', hash)).toBe(true);
  });

  it('returns false when the plain password does not match the hash', async () => {
    const hash = await hashPassword('correct');
    expect(await comparePassword('wrong', hash)).toBe(false);
  });

  it('produces a different hash on each call for the same input', async () => {
    const [h1, h2] = await Promise.all([hashPassword('same'), hashPassword('same')]);
    expect(h1).not.toBe(h2);
  });
});
