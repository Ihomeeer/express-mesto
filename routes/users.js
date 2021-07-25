const router = require("express").Router();
const User = require("../models/user");

router.get("/users", (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
});

router.get("/users:userId", (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
});

router.post("/users", (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
});
