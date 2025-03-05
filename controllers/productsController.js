const controller = {};
const { where } = require('sequelize');
const models = require('../models');

controller.show = async (req, res) => {
    //Lấy các sản phẩm từ request theo category
    let categoryId = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let categories = await models.Category.findAll({
        include: [{
            model: models.Product //lấy các sản phẩm theo category
        }]
    });

    //Lấy các sản phẩm từ request theo brand    
    let brandId = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
    let brands = await models.Brand.findAll({
        include: [{
            model: models.Product //lấy các sản phẩm theo brand
        }]
    });

    //Lấy các sản phẩm từ request theo tags    
    let tagId = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
    let tags = await models.Tag.findAll({
        include: [{
            model: models.Product //lấy các sản phẩm theo brand
        }]
    });

    //Lọc các sản phẩm theo brand hoặc category
    let options = {
        attibutes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        where: {}
    }
    if (categoryId > 0) {
        options.where.categoryId = categoryId;
    }
    else if (brandId > 0) {
        options.where.brandId = brandId;
    }
    else if (tagId > 0) {
        options.include = [{
            model: models.Tag,
            where: { id: tagId }
        }]
    }
    let products = await models.Product.findAll(options);

    //Render trang product-list theo bộ lọc
    res.render('product-list', { products, categories, brands, tags });
}

module.exports = controller;