const express = require('express');

const { getCurrentUser, updateUserInfo } = require('../controllers/user');

const auth = require('../middlewares/auth');
const { userUpdateValidate } = require('../middlewares/joiValidation');

const userRoutes = express.Router();

userRoutes.get('/me', auth, getCurrentUser);

userRoutes.patch('/me', auth, userUpdateValidate, updateUserInfo);

exports.userRoutes = userRoutes;
