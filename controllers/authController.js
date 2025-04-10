const controller = {};
const passport = require('passport');

controller.show = (req, res) => {
    res.render('login', { loginMessage: req.flash('loginMessage') });
}

controller.login = (req, res, next) => {
    let keepSignedIn = req.body.keepSignedIn;
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
            return res.redirect('/users/my-account'); //Đăng nhập thành công
        });
    })(req, res, next);
}

module.exports = controller;