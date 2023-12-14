const cardSchema = require('../models/card');
const BadRequestError = require('../stat_code_errors/BadRequestError');
const NotFoundError = require('../stat_code_errors/NotFoundError');
const ForbiddenError = require('../stat_code_errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.removeCard = (req, res, next) => {
  const { cardId } = req.params;
  cardSchema.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Пользователь не найден');
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      cardSchema.findOneAndDelete(cardId)
        .then((carD) => res.send(carD));
    })
    .catch(next);
};

module.exports.postCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки. '));
      } else {
        next(err);
      }
    });
};

module.exports.putLikes = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

module.exports.removeLikes = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      }
      return next(err);
    });
};
