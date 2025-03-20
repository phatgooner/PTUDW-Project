'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const cartController = require('../controllers/cartController');

//GET Method
router.get('/', controller.getData, controller.show);
router.get('/cart', cartController.show);
router.get('/:id', controller.getData, controller.showDetails);

//POST Method
router.post('/cart', cartController.add);

//PUT Method
router.put('/cart', cartController.update);

//DELETE Method
router.delete('/cart', cartController.remove);
router.delete('/cart/all', cartController.clear);
module.exports = router;