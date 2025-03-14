const controller = {};
const { where } = require('sequelize');
const models = require('../models');
const sequelize = require('sequelize');
const { query } = require('express');
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
    // Lấy query
    let categoryId = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let brandId = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
    let tagId = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
    let keyword = req.query.keyword || '';
    let sort = ['price', 'newest', 'popular'].includes(req.query.sort) ? req.query.sort : 'price';
    let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));


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
    //Sắp xếp sản phẩm theo ngày, giá, phổ biến
    switch (sort) {
        case 'newest':
            options.order = [['createdAt', 'DESC']];
            break;
        case 'popular':
            options.order = [['stars', 'DESC']];
            break;
        default:
            options.order = [['price', 'ASC']];
    }

    let originalUrl;
    if (Object.keys(req.query).length > 0) {
        originalUrl = removeParam('sort', req.originalUrl);
    }
    else {
        originalUrl = req.originalUrl + '?';
    }

    //Phân trang sản phẩm
    const limit = 6;
    options.limit = limit;
    options.offset = limit * (page - 1);
    let { rows, count } = await models.Product.findAndCountAll(options);
    let pagination = {
        page: page,
        limit: limit,
        totalRows: count,
        queryParams: req.query
    };
    let products = rows;

    //Render trang product-list theo bộ lọc
    res.render('product-list', { products, originalUrl, sort, pagination });
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

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

module.exports = controller;