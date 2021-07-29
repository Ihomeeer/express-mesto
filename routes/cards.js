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
router.delete("/cards/:cardId", deleteCard);

// Создать новую карточку
router.post("/cards", createCard);

// Поставить лайк карточке (только один для одного юзера)
router.put("/cards/:cardId/likes", addCardLike);

// Удалить лайк карточки
router.delete("/cards/:cardId/likes", deleteCardLike);

module.exports = router;
