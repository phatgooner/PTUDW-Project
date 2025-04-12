const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { body, getErrorMessage } = require('../controllers/validator');

router.get('/login', controller.show); // GET /users/login
router.post('/login',
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        let errorMessage = getErrorMessage(req);
        if (errorMessage) {
            return res.render('login', { loginMessage: errorMessage });
        }
        next();
    },
    controller.login); // POST /users/login

router.get('/logout', controller.logout); // GET /users/logout

router.post('/register', controller.register); // POST /users/register

module.exports = router;