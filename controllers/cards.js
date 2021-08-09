const Card = require('../models/card');
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');
const ForbiddenError = require('../errors/Forbidden');

const errorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
};

// Получить все карточки
const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

// Создать карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// Удалить карточку
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с заданным id отсутствует в базе');
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        // Удалять нельзя
        throw new ForbiddenError('Невозможно удалить чужую карточку');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((currentCard) => res.status(200).send({ data: currentCard }))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.statuscode === errorCodes.FORBIDDEN) {
        next(err);
      } else if (err.statusCode === errorCodes.NOT_FOUND) {
        next(err);
      } else if (err.statusCode === errorCodes.BAD_REQUEST) {
        next(new BadRequestError('Ошибка в формате id карточки'));
      } else {
        next(err);
      }
    });
};

// Поставить лайк карточке
const addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с заданным id отсутствует в базе');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        next(err);
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в формате id карточки'));
      } else {
        next(err);
      }
    });
};

// Убрать лайк у карточки
const deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с заданным id отсутствует в базе');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        next(err);
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в формате id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, addCardLike, deleteCardLike,
};
