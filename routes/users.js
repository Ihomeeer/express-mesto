const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

// Получить всех пользователей
router.get("/users", getAllUsers);

// Получить определенного пользователя по id
router.get("/users/:userId", getUserById);

// Создать нового пользователя
router.post("/users", createUser);

// Обновить текущего пользователя (имя и инфо)
router.patch("/users/me", updateUserProfile);

// Обновить текущего пользователя (аватар)
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
