const { celebrate, Joi } = require("celebrate");

const router = require("express").Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
} = require("../controllers/cards");

// Получить все карточки
router.get("/cards", getAllCards);

// Удалить конкретную карточку по id
router.delete("/cards/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }), deleteCard);

// Создать новую карточку
router.post("/cards",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }), createCard);

// Поставить лайк карточке (только один для одного юзера)
router.put("/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }), addCardLike);

// Удалить лайк карточки
router.delete("/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }), deleteCardLike);

module.exports = router;
