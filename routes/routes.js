const express = require('express');
const { moviesRoutes } = require('./movies');
const auth = require('../middlewares/auth');
const { userRoutes } = require('./users');

const routes = express.Router();

routes.use('/users', auth, userRoutes);

routes.use('/movies', auth, moviesRoutes);

routes.use((req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});

exports.routes = routes;
