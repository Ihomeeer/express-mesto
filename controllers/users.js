const User = require("../models/user");

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(404).send({ message: `Произошла ошибка: ${err}` }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req);
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports = {
  getAllUsers, getUserById, createUser,
};
