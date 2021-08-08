const express = require("express");
const mongoose = require("mongoose");

// подключение express
const app = express();

// подключение helmet для защиты рабочей среды
const helmet = require("helmet");

app.use(helmet());

const { celebrate, Joi, errors } = require("celebrate");
const userRoute = require("./routes/users");
const cardRoute = require("./routes/cards");
const login = require("./controllers/login");
const { createUser } = require("./controllers/users");
const authCheck = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const { PORT = 3000 } = process.env;

// подключение БД
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// подключение парсера
app.use(express.json());

// подключение роутов для юзеровв и карточек, а так же роута для страницы 404
app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(2).max(30),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(90),
    email: Joi.string().required(),
    password: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(authCheck);

app.use("/", userRoute);

app.use("/", cardRoute);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Ошибка 404, такой страницы не существует" });
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
