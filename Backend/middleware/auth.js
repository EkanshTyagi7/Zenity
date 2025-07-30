const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Must match your authController's secret
    req.user = decoded; // { userId, ... }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};