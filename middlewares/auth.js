const jwt = require('jsonwebtoken');
const AuthError = require('../stat_code_errors/AuthError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AuthError('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(err);
  }
  req.user = payload;
  next();
};
