process.env.JWT_SECRET = 'test-secret-unit';

const { generateToken, verifyToken } = require('../../src/utils/token');

describe('token utils', () => {
  const payload = { id: 'user-1', email: 'test@example.com' };

  it('generates a JWT string', () => {
    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('verifies a valid token and returns the original payload', () => {
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it('throws when verifying a tampered token', () => {
    const token = generateToken(payload);
    expect(() => verifyToken(token + 'tampered')).toThrow();
  });

  it('throws when verifying a token signed with a different secret', () => {
    const jwt = require('jsonwebtoken');
    const foreign = jwt.sign(payload, 'other-secret');
    expect(() => verifyToken(foreign)).toThrow();
  });
});
