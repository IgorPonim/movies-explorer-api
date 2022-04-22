const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const BadRequestError = require('../errors/BadRequestError');

// короче нарыл че-то в интернетах, вроде фурычит
const urlChecking = Joi.string().custom((prot) => {
  if (!validator.isURL(prot, {
    // require_tld: true,
    require_protocol: true,
    // require_host: true,
    // require_port: false,
    // require_valid_protocol: true,
    // allow_underscores: false,
    // host_whitelist: false,
    // host_blacklist: false,
    // allow_trailing_dot: false,
    // allow_protocol_relative_urls: false,
    // allow_fragments: true,
    // allow_query_components: true,
    // disallow_auth: false,
    // validate_length: true,
    // protocols: ['http', 'https', 'ftp'],
  })) {
    throw new BadRequestError('Неправедный формат URL адреса');
  }
  return prot;
});

const signIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const createMovieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2).max(30).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().min(2).max(30).required(),
    movieId: Joi.number().required(),
    image: urlChecking,
    trailerLink: urlChecking,
    thumbnail: urlChecking,
  }),
});

const movieIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(), //  пример валидации в интернете для mognoD
  }),
});

const userUpdateValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  signIn,
  signUp,
  createMovieValidate,
  userUpdateValidate,
  movieIdValidate,
};
