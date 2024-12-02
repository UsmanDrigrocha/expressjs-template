const express = require('express');

const { userRegister, verifyAccount, login } = require('../controllers/userController')

const { validateUser } = require('../middlewares/validateUser')

const route = express.Router();

// --------------------------------------- User Auth Roues ---------------------------------------
route.post('/register', userRegister);

route.get('/verify-account/:token', verifyAccount);

route.post('/login', login);

module.exports = route;