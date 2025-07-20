const express = require('express');
const { login, signUp, sendOTP, changePassword } = require('../controllers/Auth');
const { resetPasswordToken, resetPassword } = require('../controllers/ResetPassword');
const { auth } = require('../middlewares/auth');
const route = express.Router();


route.post('/login',login);

route.post('/signup',signUp);

route.post('/sendotp',sendOTP);

route.post('/changepassword',auth,changePassword);

route.post('/reset-password-token',resetPasswordToken);

route.post('/reset-password',resetPassword);

module.exports = route;

