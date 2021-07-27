const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  createUser,
} = require("../controllers/users");

// Получить всех пользователей
router.get("/users", getAllUsers);

// Получить определенного пользователя по id
router.get("/users:userId", getUserById);

// Создать нового пользователя
router.post("/users", createUser);

module.exports = router;
