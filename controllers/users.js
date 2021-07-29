const User = require("../models/user");

const errorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  DEFAULT: 500,
};

// Получить всех пользователей
const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => {
      res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
    });
};

// Создать нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Переданы некорректные данные при создании пользователя" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

// Получить конкретного пользователя
const getUserById = (req, res) => {
  User.findById(req.params.id)
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
      upsert: true, // если пользователь не найден, он будет создан
    })
    .then((user) => res.status(200).send({ data: user }))
    .orFail(() => {
      const error = new Error("Пользователь с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
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
      upsert: true, // если пользователь не найден, он будет создан
    })
    .then((user) => res.status(200).send({ data: user }))
    .orFail(() => {
      const error = new Error("Пользователь с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
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
  getAllUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
};
