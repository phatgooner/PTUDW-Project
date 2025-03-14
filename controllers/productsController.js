const controller = {};
const { where } = require('sequelize');
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

controller.getData = async (req, res, next) => {
    //Lấy các sản phẩm từ request theo category    
    let categories = await models.Category.findAll({
        include: [{
            model: models.Product //lấy các sản phẩm theo category
        }]
    });
    res.locals.categories = categories;

    //Lấy các sản phẩm từ request theo brand   
    let brands = await models.Brand.findAll({
        include: [{
            model: models.Product //lấy các sản phẩm theo brand
        }]
    });
    res.locals.brands = brands;

    //Lấy các sản phẩm từ request theo tags    
    let tags = await models.Tag.findAll({
        include: [{
            model: models.Product //lấy các sản phẩm theo brand
        }]
    });
    res.locals.tags = tags;
    next();
}

controller.show = async (req, res) => {
    let categoryId = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let brandId = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
    let tagId = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
    let keyword = req.query.keyword || '';

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
    else if (keyword.trim() != '') {
        options.where.name = {
            [Op.iLike]: `%${keyword}%`
        };
    }
    let products = await models.Product.findAll(options);

    //Render trang product-list theo bộ lọc
    res.render('product-list', { products });
}

controller.showDetails = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

    let product = await models.Product.findOne({
        attibutes: ['id', 'name', 'summary', 'stars', 'price', 'oldPrice', 'description', 'specification'],
        where: { id },
        include: [{
            model: models.Image,
            attibutes: ['name', 'imagePath']
        }, {
            model: models.Review,
            attibutes: ['id', 'review', 'stars', 'createdAt'],
            include: [{
                model: models.User,
                attibutes: ['firstName', 'lastName']
            }]
        }]
    });

    res.render('product-detail', { product });

}

module.exports = controller;