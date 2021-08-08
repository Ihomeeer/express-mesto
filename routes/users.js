const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

// Получить всех пользователей
router.get("/users", getAllUsers);

// Получить инфо об авторизированном пользователе ( о себе )
router.get("/users/me", getUserInfo);

// Получить определенного пользователя по id
router.get("/users/:userId", getUserById);

// Обновить текущего пользователя (имя и инфо)
router.patch("/users/me", updateUserProfile);

// Обновить текущего пользователя (аватар)
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
