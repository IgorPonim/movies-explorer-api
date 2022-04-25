const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnathorizedError = require('../errors/UnathorizedError');
const ConflictError = require('../errors/ConflictError');
const { User } = require('../models/userModel');

exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь не найден.'));
    }

    return res.status(200).send(user);
  })
    .catch((err) => {
      next(err);
    });
};

exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Неверный тип данных.'));
      } else if (err.codeName === 'DuplicateKey') {
        next(new ConflictError('Указанный Email уже используется другим пользователем.'));
      } else {
        next(err);
      }
    });
};

// создаем юзера проверяем есть ли уже в базе
exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new BadRequestError('Неправильный логин или пароль.');
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(` Пользователь с ${email} уже зарегистрирован.`);
      }
      return bcrypt.hash(req.body.password, 10); // шифруем ответ
    })

    .then((hash) => User.create({
      email: req.body.email,
      name: req.body.name,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверные данные о пользователе или неверная ссылка на аватар.'));
      }
      next(err);
    });
};

const { NODE_ENV, JWT_SECRET } = process.env;

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnathorizedError('Неверный email или пароль.'));
      }
      // расшифровываем введенный пароль
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnathorizedError('Неверный email или пароль.'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');

          return res.status(200)
            .cookie('token', token, {
              maxAge: 60 * 60 * 60 * 24,
              httpOnly: true,
              sameSite: 'None',
              secure: true,
            })
            .send({ message: 'Успешно' });
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  }).send({ message: 'Пользователь вышел' });
};
