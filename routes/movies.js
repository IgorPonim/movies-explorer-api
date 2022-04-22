const express = require('express');

const { getMovies, createMovies, deleteMovies } = require('../controllers/movies');

const auth = require('../middlewares/auth');
const { createMovieValidate, movieIdValidate } = require('../middlewares/joiValidation');

const moviesRoutes = express.Router();

moviesRoutes.get('/', auth, getMovies);

moviesRoutes.post('/', auth, createMovieValidate, createMovies);

moviesRoutes.delete('/:movieId', movieIdValidate, auth, deleteMovies);

exports.moviesRoutes = moviesRoutes;
