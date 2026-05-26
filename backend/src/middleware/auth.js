const { verifyToken } = require('../utils/token');

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'authorization header missing or malformed' });
  }
  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: 'token invalid or expired' });
  }
};

module.exports = { authMiddleware };
