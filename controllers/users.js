const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res) => {
  if (Object.keys(req.body).length === 0) return res.status(400).send({ message: 'Тело запроса пустое' });
  // bcrypt.hash(req.body.password, 10)
  //   .then((hash) => User.create({
  //     email: req.body.email,
  //     password: hash,
  //     name: req.body.name,
  //     about: req.body.about,
  //     avatar: req.body.avatar,
  //   }))
  const {
    name, about, avatar, email, password,
  } = req.body
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка при создании пользователя' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(201).cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ message: 'Ок' });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при поиске всех пользователей' }));
};

module.exports.getSingleUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Нет пользователя с таким id' }));
};
