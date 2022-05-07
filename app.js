require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const { errors } = require('celebrate');

const PUBLIC_FOLDER = path.join(__dirname, 'public');
const { errorLogger } = require('./middlewares/logger');
const mainErrorHadler = require('./middlewares/mainErrorHandler');

const limiter = require('./middlewares/limit');

const app = express();

app.use(express.static(PUBLIC_FOLDER));
const { port = 3000 } = process.env;

// настройки корс можно зайти с лююбого домена, чтобы работал его надо  в правильное место поставить
app.use(cors({
  origin: true,
  credentials: true,
}));

const { routes } = require('./routes/routes');
const auth = require('./middlewares/auth');

const { createUser, login, logout } = require('./controllers/user');
const { requestLogger } = require('./middlewares/logger');
const { signIn, signUp } = require('./middlewares/joiValidation');

//  парсер

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

app.post('/signup', signUp, createUser);
app.post('/signin', signIn, login);
app.get('/logout', logout);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use(auth);

app.use(errorLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

async function main() {
  console.log('trying to connect');
  await mongoose.connect(
    'mongodb://localhost:27017/bitfilmsdb',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    },
  );

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();

app.use(errors());
app.use(mainErrorHadler);
