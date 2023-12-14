const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUser, updateAvatar, getMyUser,
} = require('../controllers/users');
const { linkVerify } = require('../utils/regexFunc');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getMyUser);
userRoutes.get('/:userId', getUserById);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(linkVerify),
  }),
}), updateAvatar);

module.exports = userRoutes;
