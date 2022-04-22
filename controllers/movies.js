const { movie } = require('../models/movieModel');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnathorizedError = require('../errors/UnathorizedError');

exports.getMovies = (req, res, next) => {
  movie.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      next(err);
    });
};

exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const ownerId = req.user._id;
  movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: ownerId,
  })

    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неверный тип данных.'));
      }
      return next(err);
    });
};

module.exports.deleteMovies = (req, res, next) => {
  movie.findByIdAndDelete(req.params.movieId)
    .then((film) => {
      if (!film) {
        throw new NotFoundError('Фильм не найден');
      } else if (film.owner.toString() !== req.user._id) {
        throw new UnathorizedError('Нельзя удалять чужие фильмы!');
      }

      movie.findByIdAndDelete(req.params.movieId)
        .then(() => res.status(200).send({ message: 'Фильм удален' }));
    })
    .catch(next);
};
