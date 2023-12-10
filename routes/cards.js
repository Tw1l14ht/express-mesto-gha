const cardRoutes = require('express').Router();

const {
  getCards, removeCard, postCards, putLikes, removeLikes,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', postCards);
cardRoutes.delete('/:cardId', removeCard);
cardRoutes.delete('/:cardId/likes', removeLikes);
cardRoutes.put('/:cardId/likes', putLikes);

module.exports = cardRoutes;
