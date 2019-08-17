const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  const token = req.headers.authorization;
  return jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(401).end();
    }
    return next();
  });
};
