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

router.post('/register',
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword').trim().notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    (req, res, next) => {
        let errorMessage = getErrorMessage(req);
        if (errorMessage) {
            return res.render('login', { registerMessage: errorMessage });
        }
        next();
    },
    controller.register
); // POST /users/register

router.get('/forgot', controller.showForgotPassword); // GET /users/forgot-password
router.post('/forgot',
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    (req, res, next) => {
        let message = getErrorMessage(req);
        if (message) {
            return res.render('forgot-password', { message });
        }
        next();
    },
    controller.forgotPassword); // POST /users/forgot-password

router.get('/reset', controller.showResetPassword); // GET /users/reset/:token
router.post('/reset',
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword').trim().notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    (req, res, next) => {
        let message = getErrorMessage(req);
        if (message) {
            return res.render('reset-password', { message });
        }
        next();
    },
    controller.resetPassword); // POST /users/reset/:token

module.exports = router;