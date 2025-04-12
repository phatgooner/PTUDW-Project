const controller = {};
const passport = require('passport');

controller.show = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/'); //Người dùng đã đăng nhập
    }
    res.render('login', { loginMessage: req.flash('loginMessage'), reqUrl: req.query.reqUrl, registerMessage: req.flash('registerMessage') });
}

controller.login = (req, res, next) => {
    let keepSignedIn = req.body.keepSignedIn;
    let reqUrl = req.body.reqUrl ? req.body.reqUrl : '/users/my-account'; //Lấy URL yêu cầu từ form
    let cart = req.session.cart; //Lưu giỏ hàng vào session
    passport.authenticate('local-login', (err, user) => {
        if (err) {
            return next(err); //Có lỗi xảy ra
        }
        if (!user) {
            return res.redirect(`/users/login?reqUrl=${reqUrl}`); //Đăng nhập không thành công
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); //Có lỗi xảy ra
            }
            req.session.cookie.maxAge = keepSignedIn ? (24 * 60 * 60 * 1000) : null;
            req.session.cart = cart; //Khôi phục giỏ hàng từ session
            return res.redirect(reqUrl); //Đăng nhập thành công
        });
    })(req, res, next);
}

controller.logout = (req, res, next) => {
    let cart = req.session.cart; //Lưu giỏ hàng vào session
    req.logout((err) => {
        if (err) {
            return next(err); //Có lỗi xảy ra
        }
        req.session.cart = cart; //Khôi phục giỏ hàng từ session
        res.redirect('/'); //Đăng xuất thành công
    });
}

controller.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); //Người dùng đã đăng nhập
    }
    res.redirect(`/users/login?reqUrl=${req.originalUrl}`); //Người dùng chưa đăng nhập
};

controller.register = async (req, res, next) => {
    let reqUrl = req.body.reqUrl ? req.body.reqUrl : '/users/my-account'; //Lấy URL yêu cầu từ form
    let cart = req.session.cart; //Lưu giỏ hàng vào session
    passport.authenticate('local-register', (err, user) => {
        if (err) {
            return next(err); //Có lỗi xảy ra
        }
        if (!user) {
            return res.redirect(`/users/login?reqUrl=${reqUrl}`); //Đăng ký không thành công
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); //Có lỗi xảy ra
            }
            req.session.cart = cart; //Khôi phục giỏ hàng từ session
            return res.redirect(reqUrl); //Đăng ký thành công
        });
    })(req, res, next);
};

module.exports = controller;