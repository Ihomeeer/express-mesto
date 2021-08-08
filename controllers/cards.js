const Card = require("../models/card");

const errorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  DEFAULT: 500,
  FORBIDDEN: 403,
};

// Получить все карточки
const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
    });
};

// Создать карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Переданы некорректные данные при создании карточки" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

// Удалить карточку
const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      const error = new Error("Карточка с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        // Удалять нельзя
        res.status(errorCodes.FORBIDDEN).send({ message: "Невозможно удалить чужую карточку" });
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((currentCard) => res.status(200).send({ data: currentCard }));
      }
    })
    .catch((err) => {
      if (err.statuscode === errorCodes.FORBIDDEN) {
        res.status(errorCodes.FORBIDDEN).send({ message: err.message });
      } else if (err.statusCode === errorCodes.NOT_FOUND) {
        res.status(errorCodes.NOT_FOUND).send({ message: "Карточка с заданным id отсутствует в базе" });
      } else if (err.statusCode === errorCodes.BAD_REQUEST) {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Ошибка в формате id карточки" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

// Поставить лайк карточке
const addCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Карточка с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        res.status(errorCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Ошибка в формате id карточки" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

// Убрать лайк у карточки
const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Карточка с заданным id отсутствует в базе");
      error.statusCode = errorCodes.NOT_FOUND;
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      console.log(err);
      if (err.statusCode === errorCodes.NOT_FOUND) {
        res.status(errorCodes.NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(errorCodes.BAD_REQUEST).send({ message: "Ошибка в формате id карточки" });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, addCardLike, deleteCardLike,
};
