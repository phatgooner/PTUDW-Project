'use strict';

const controller = {};
const models = require('../models');


controller.showHomePage = async (req, res) => {
    //lấy dữ liệu từ csdl
    const Brand = models.Brand;
    const Category = models.Category;
    const Product = models.Product;

    //thêm await trong hàm async(req,res) để xử lý csdl xong mới render ở dòng dưới
    //featured products
    const featuredProducts = await Product.findAll({
        attibutes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 10
    });

    //recent products
    const recentProducts = await Product.findAll({
        attibutes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        order: [['stars', 'DESC']],
        limit: 10
    });

    //brands
    const brands = await Brand.findAll();

    //categories
    const categories = await Category.findAll();
    const secArray = categories.splice(2, 2);
    const thirdArray = categories.splice(1, 1);
    const categoriesArray = [categories, secArray, thirdArray];

    //Xử lý render
    res.render('index', { brands, categoriesArray, featuredProducts, recentProducts });
}

controller.showPage = (req, res, next) => {
    let page = req.params.page;
    const pages = ['cart', 'checkout', 'contact', 'login', 'my-account', 'product-detail', 'product-list', 'wishlist'];
    if (pages.includes(page)) {
        return res.render(page);
    }
    next();
}

module.exports = controller;