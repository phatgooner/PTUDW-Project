'use strict';

const controller = {};
const models = require('../models');

controller.checkout = async (req, res) => {
    if (req.session.cart.quantity > 0) {
        let userId = 1;
        let addresses = await models.Address.findAll({
            where: { userId }
        });
        let cart = req.session.cart.getCart();

        return res.render('checkout', { cart, addresses });
    }
    res.redirect('/products');
}

module.exports = controller;