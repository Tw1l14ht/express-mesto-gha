const validID = require('mongoose').Types.ObjectId;
const cardSchema = require('../models/card');

const { statCode500, statCode400, statCode404 } = require('../utils/constans');

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` }));
};

module.exports.removeCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema.findOneAndDelete(cardId)
    .then((card) => {
      if (!validID.isValid(cardId)) {
        return res.status(statCode400).send({ message: 'Передан некорректный id' });
      }
      if (!card) {
        return res.status(statCode404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statCode400).send({ message: 'Передан некорректный id' });
      } else {
        res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` });
      }
    });
};

module.exports.postCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statCode400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` });
      }
    });
};

module.exports.putLikes = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(statCode404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(statCode400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` });
    });
};

module.exports.removeLikes = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(statCode404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(statCode400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(statCode500).send({ message: `Ошибка по умолчанию: ${err.name}` });
    });
};
