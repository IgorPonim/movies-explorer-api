//  все взял с тренажера ;

const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/UnathorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new UnathorizedError('Необходима авторизация.');
  }
  req.user = payload;

  next();
};
