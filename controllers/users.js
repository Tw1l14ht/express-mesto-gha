const userSchema = require('../models/user');
const { statCode500, statCode400, statCode404 } = require('../utils/constans');

module.exports.getUsers = (req, res) => {
  console.log(req);
  userSchema.find({})
    .then((users) => { res.send(users); })
    .catch((err) => res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  userSchema.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(statCode404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(statCode400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` });
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  userSchema.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statCode400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userSchema.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(statCode404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(statCode400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userSchema.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(statCode404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(statCode400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` });
    });
};
