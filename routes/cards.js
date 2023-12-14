const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, removeCard, postCards, putLikes, removeLikes,
} = require('../controllers/cards');
const { linkVerify } = require('../utils/regexFunc');
const { idVerify } = require('../utils/constans');

const idJoi = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(idVerify),
  }),
};

cardRoutes.get('/', getCards);

cardRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(linkVerify),
  }),
}), postCards);

cardRoutes.delete('/:cardId', celebrate(idJoi), removeCard);

cardRoutes.delete('/:cardId/likes', celebrate(idJoi), removeLikes);

cardRoutes.put('/:cardId/likes', celebrate(idJoi), putLikes);

module.exports = cardRoutes;
