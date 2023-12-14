const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const NotFoundError = require('../stat_code_errors/NotFoundError');
const BadRequestError = require('../stat_code_errors/BadRequestError');
const ForbiddenError = require('../stat_code_errors/ForbiddenError');

module.exports.getUsers = (req, res, next) => {
  console.log(req);
  userSchema.find({})
    .then((users) => { res.send(users); })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  userSchema.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports.postUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10).then((hash) => {
    userSchema.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ForbiddenError('Пользователь с таким email уже существует'));
        } else if (err.name === 'ValidationError') {
          next(new BadRequestError('Некорректные данные'));
        } else next(err);
      });
  });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userSchema.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userSchema.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getMyUser = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь не найден'));
      } else next(err);
    });
};
