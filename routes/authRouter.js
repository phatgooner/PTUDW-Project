const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.get('/login', controller.show); // GET /users/login
router.post('/login', controller.login); // POST /users/login
module.exports = router;