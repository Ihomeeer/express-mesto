const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

// Получить всех пользователей
router.get('/users', getAllUsers);

// Получить инфо об авторизированном пользователе ( о себе )
router.get('/users/me', getUserInfo);

// Получить определенного пользователя по id
router.get('/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }), getUserById);

// Обновить текущего пользователя (имя и инфо)
router.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(90),
    }),
  }), updateUserProfile);

// Обновить текущего пользователя (аватар)
router.patch('/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      // eslint-disable-next-line
      avatar: Joi.string().required().regex(/https?:\/\/(www.)?[a-z0-9\-\._~:\/?#\[\]@!$&'\(\)*\+,;=]+.[a-z0-9\/]/i),
    }),
  }), updateUserAvatar);

module.exports = router;
