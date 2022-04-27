const express = require('express');
const { moviesRoutes } = require('./movies');
const auth = require('../middlewares/auth');
const { userRoutes } = require('./users');
const NotFoundError = require('../errors/NotFoundError');

const routes = express.Router();

routes.use('/users', auth, userRoutes);

routes.use('/movies', auth, moviesRoutes);

routes.use('*', () => {
  throw new NotFoundError('Страница по указанному маршруту не найдена');
});

exports.routes = routes;
