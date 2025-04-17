const controller = {};
const passport = require('passport');
const models = require('../models');
const e = require('connect-flash');

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

controller.showForgotPassword = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/'); //Người dùng đã đăng nhập
    }
    res.render('forgot-password', { forgotPasswordMessage: req.flash('forgotPasswordMessage') });
};

controller.forgotPassword = async (req, res) => {
    let email = req.body.email;
    //Kiểm tra xem email có tồn tại trong cơ sở dữ liệu hay không
    let user = await models.User.findOne({ where: { email } });
    //Nếu có, tạo link và gửi email đặt lại mật khẩu
    if (user) {
        const { sign } = require('./jwt');
        const host = req.header('host');
        const resetLink = `${req.protocol}://${host}/users/reset?token=${sign(email)}&email=${email}`;
        const { sendForgotPasswordMail } = require('./mail');
        sendForgotPasswordMail(user, host, resetLink).then(() => {
            console.log('Email sent successfully!');//Thông báo thành công
            return res.render('forgot-password', { done: true });
        }).catch((err) => {
            console.log(err.statusCode);
            return res.render('forgot-password', { message: 'Failed to send email!' });//Nếu không, hiển thị thông báo lỗi
        });
    }
    else {
        return res.render('forgot-password', { message: 'Email does not exist!' });//Nếu không, hiển thị thông báo lỗi email không tồn tại
    }
};

controller.showResetPassword = (req, res) => {
    let token = req.query.token;
    let email = req.query.email;
    //Kiểm tra xem token có hợp lệ hay không
    const { verify } = require('./jwt');
    if (!verify(token) || !token) {
        res.render('reset-password', { expired: true });
    }
    else {
        res.render('reset-password', { email, token });
    }
};

controller.resetPassword = async (req, res) => {
    let token = req.body.token;
    let email = req.body.email;
    let bcrypt = require('bcrypt');
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)); //Mã hóa mật khẩu mới

    //Cập nhật mật khẩu mới cho người dùng
    await models.User.update({ password }, { where: { email } });
    res.render('reset-password', { done: true }); //Thông báo thành công    
};

module.exports = controller;