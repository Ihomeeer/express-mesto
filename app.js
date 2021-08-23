const express = require('express');
const mongoose = require('mongoose');

// подключение express
const app = express();

// подключение helmet для защиты рабочей среды
const helmet = require('helmet');

app.use(helmet());

// импорт celebrate для валидации полей запроса до попадания в контроллеры
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;

// импорт роутов для юзеров и карточек
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

const login = require('./controllers/login');
const { createUser } = require('./controllers/users');
const authCheck = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFound');

// импорт логгера
const { requestLogger, errorLogger } = require('./middlewares/logger');

// подключение БД
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// подключение парсера
app.use(express.json());

// подключение логгера запросов
app.use(requestLogger);

// подключение роутов для юзеровв и карточек, а так же роута для страницы 404
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    // eslint-disable-next-line
    avatar: Joi.string().regex(/https?:\/\/(www.)?[a-z0-9\-\._~:\/?#\[\]@!$&'\(\)*\+,;=]+.[a-z0-9\/]/i),
    password: Joi.string().required().min(4),
  }),
}), createUser);

// мидлвэр для авторизации
app.use(authCheck);

app.use('/', userRoute);

app.use('/', cardRoute);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ошибка 404, такой страницы не существует'));
});

// подключение логгера ошибок
app.use(errorLogger);

// мидлвэр для ошибок celebrate
app.use(errors());

// мидлвэр для обработчика ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`App listening on port ${PORT}`);
});
