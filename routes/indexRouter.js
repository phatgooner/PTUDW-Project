'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexControllers');

// router.get('/createTable', (req, res) => {
//     let models = require('../models');
//     models.sequelize.sync().then(() => {
//         res.send('Tables created!')
//     })
// })

router.get('/', controller.showHomePage);

router.get('/:page', controller.showPage);


module.exports = router;