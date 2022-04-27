const { movie } = require('../models/movieModel');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

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

//  не был знаком с методом orFail, красиво!
module.exports.deleteMovies = (req, res, next) => {
  movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм по _id не найден'))
    .then((film) => {
      if (film.owner.toString() === req.user._id) {
        return film.remove()
          .then(() => res.status(200).send({ message: 'Фильм удален' }));
      }

      throw new ForbiddenError('Нельзя удалять чужой фильм');
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный id'));
      }
      next(err);
    });
};
