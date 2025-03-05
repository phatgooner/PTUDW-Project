const controller = {};
const { where } = require('sequelize');
const models = require('../models');

controller.show = async (req, res) => {
    let categoryId = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let categories = await models.Category.findAll({
        include: [{
            model: models.Product
        }]
    });
    let options = {
        attibutes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        where: {}
    }
    if (categoryId > 0) {
        options.where.categoryId = categoryId;
    }
    let products = await models.Product.findAll(options);

    res.render('product-list', { products, categories });
}

module.exports = controller;