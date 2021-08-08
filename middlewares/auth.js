const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(403)
      .send({ message: "Необходима авторизация" });
  }
  // извлечём токен
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(403)
      .send({ message: "Необходима авторизация" });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};

module.exports = authCheck;