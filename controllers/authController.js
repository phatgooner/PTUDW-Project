const controller = {};
const passport = require('passport');

controller.show = (req, res) => {
    res.render('login', { loginMessage: req.flash('loginMessage') });
}

controller.login = (req, res, next) => {
    let keepSignedIn = req.body.keepSignedIn;
    let cart = req.session.cart; //Lưu giỏ hàng vào session
    passport.authenticate('local-login', (err, user) => {
        if (err) {
            return next(err); //Có lỗi xảy ra
        }
        if (!user) {
            return res.redirect('/users/login'); //Đăng nhập không thành công
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); //Có lỗi xảy ra
            }
            req.session.cookie.maxAge = keepSignedIn ? (24 * 60 * 60 * 1000) : null;
            req.session.cart = cart; //Khôi phục giỏ hàng từ session
            return res.redirect('/users/my-account'); //Đăng nhập thành công
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

module.exports = controller;