const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const errorCodes = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  DEFAULT: 500,
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select("+password")
    .orFail(() => {
      const error = new Error("Неправильные почта или пароль");
      error.statusCode = errorCodes.UNAUTHORIZED;
      throw error;
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — выбрасываем ошибку и не говорим, что конкретно неправильно
            const error = new Error("Неправильные почта или пароль");
            error.statusCode = errorCodes.UNAUTHORIZED;
            throw error;
          }
          // аутентификация успешна
          const token = jwt.sign({ _id: user._id },
            "some-secret-key",
            { expiresIn: "7d" });
          res.send({ token });
        })
        .catch((err) => {
          res
            .status(errorCodes.DEFAULT)
            .send({ message: err.message });
        });
    })
    .catch((err) => {
      if (err.statusCode === errorCodes.NOT_FOUND) {
        res.status(errorCodes.UNAUTHORIZED).send({ message: err.message });
      } else {
        res.status(errorCodes.DEFAULT).send({ message: "Произошла ошибка, сервер не может обработать запрос" });
      }
    });
};

module.exports = login;
