const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');
const ConflictingRequestError = require('../errors/ConflictingRequest');

const errorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  DEFAULT: 500,
};

// Получить всех пользователей
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

// Создать нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPass) => {
      User.create({
        name, about, avatar, email, password: hashedPass,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else if (err.name === 'MongoError' && err.code === 11000) {
            next(new ConflictingRequestError('Пользователь с такими данными уже существует'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

// Получить конкретного пользователя
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с заданным id отсутствует в базе');
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        next(err);
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в формате id пользователя'));
      } else {
        next(err);
      }
    });
};

// Получить инфо об авторизированном пользователе
const getUserInfo = (req, res, next) => {
  const currentUser = req.user._id;
  User.findById(currentUser)
    .orFail(() => {
      throw new NotFoundError('Пользователь с заданным id отсутствует в базе');
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        next(err);
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в формате id пользователя'));
      } else {
        next(err);
      }
    });
};

// Обновить профиль пользователя
const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const currentUser = req.user._id;
  User.findByIdAndUpdate(currentUser, { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он НЕ будет создан
    })
    .orFail(() => {
      throw new NotFoundError('Пользователь с заданным id отсутствует в базе');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        next(err);
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в формате id пользователя'));
      } else {
        next(err);
      }
    });
};

// Обновить аватар пользователя
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const currentUser = req.user._id;
  User.findByIdAndUpdate(currentUser, { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он НЕ будет создан
    })
    .orFail(() => {
      throw new NotFoundError('Пользователь с заданным id отсутствует в базе');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        next(err);
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара пользователя'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в формате id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
