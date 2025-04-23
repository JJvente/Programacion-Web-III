const User = require('../model/userModel');

exports.getUsers = (req, res) => {
  User.getAll((err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

exports.getUserById = (req, res) => {
  User.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
};

exports.createUser = (req, res) => {
  User.create(req.body, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Usuario creado' });
  });
};

exports.updateUser = (req, res) => {
  User.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Usuario actualizado' });
  });
};

exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Usuario eliminado' });
  });
};
