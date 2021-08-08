const bcrypt = require("bcryptjs");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFound");
const BadRequestError = require("../errors/BadRequest");
const ConflictingRequestError = require("../errors/ConflictingRequest");

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
const createUser = (req, res) => {
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
          if (err.name === "ValidationError") {
            res.status(errorCodes.BAD_REQUEST).send({ message: "Переданы некорректные данные при создании пользователя" });
          } else {
            res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
          }
        });
    });
};

// Получить конкретного пользователя
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("Пользователь с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === errorCodes.NOT_FOUND) {
        res.status(errorCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Ошибка в формате id пользователя" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

// Получить инфо об авторизированном пользователе
const getUserInfo = (req, res) => {
  const currentUser = req.user._id;
  User.findById(currentUser)
    .orFail(() => {
      const error = new Error("Пользователь с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === errorCodes.NOT_FOUND) {
        res.status(errorCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Ошибка в формате id пользователя" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

// Обновить профиль пользователя
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const currentUser = req.user._id;
  User.findByIdAndUpdate(currentUser, { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он НЕ будет создан
    })
    .orFail(() => {
      const error = new Error("Пользователь с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        res.status(errorCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Переданы некорректные данные при обновлении профиля пользователя" });
      } else if (err.name === "CastError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Ошибка в формате id пользователя" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

// Обновить аватар пользователя
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const currentUser = req.user._id;
  User.findByIdAndUpdate(currentUser, { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он НЕ будет создан
    })
    .orFail(() => {
      const error = new Error("Пользователь с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        res.status(errorCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Переданы некорректные данные при обновлении аватара пользователя" });
      } else if (err.name === "CastError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Ошибка в формате id пользователя" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
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
