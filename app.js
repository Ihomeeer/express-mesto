const express = require("express");
const mongoose = require("mongoose");

// подключение express
const app = express();

const userRoute = require("./routes/users");
const cardRoute = require("./routes/cards");

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

//  Временное решение для авторизации, пофиксится в следующем спринте
app.use((req, res, next) => {
  req.user = {
    _id: "6101930e161e28309024c751",
  };

  next();
});

// подключение роутов для юзеровв и карточек, а так же роута для страницы 404
app.use("/", userRoute);

app.use("/", cardRoute);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Ошибка 404, такой страницы не существует" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
