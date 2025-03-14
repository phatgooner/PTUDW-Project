'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const cartController = require('../controllers/cartController');

router.get('/', controller.getData, controller.show);
router.get('/:id', controller.getData, controller.showDetails);

router.post('/cart', cartController.add);
module.exports = router;