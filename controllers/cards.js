const validID = require('mongoose').Types.ObjectId;
const cardSchema = require('../models/card');

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Ошибка по умолчанию: ${err.name}` }));
};

module.exports.removeCard = (req, res) => {
  const { cardID } = req.params;
  cardSchema.findOneAndDelete(cardID)
    .then((card) => {
      if (!validID.isValid(cardID)) {
        return res.status(400).send({ message: 'Передан некорректный id' });
      }
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Передан некорректный id',
        });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.postCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.putLikes = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardID,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.removeLikes = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardID,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
