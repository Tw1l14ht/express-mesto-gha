const cardRoutes = require('express').Router();

const {
  getCards, postCards, deleteCard, putLikes, removeLikes,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', postCards);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.delete('/:cardId/likes', removeLikes);
cardRoutes.put('/:cardId/likes', putLikes);

module.exports = cardRoutes;
