'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const models = require('../models');

//Hàm được gọi khi xác thực người dùng thành công và lưu thông tin user vào session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//Hàm được gọi bởi passport.session để lấy thông tin của user từ csdl và đưa vào req.user
passport.deserializeUser(async (id, done) => {
    try {
        let user = await models.User.findOne({
            attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'isAdmin'],
            where: { id }
        });
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});

//Hàm xác thực người dùng khi đăng nhập
passport.use('local-login', new LocalStrategy({
    usernameField: 'email', //Tên đăng nhập là email
    passwordField: 'password',
    passReqToCallback: true, //Chuyển req vào callback
}, async (req, email, password, done) => {
    if (email) {
        email = email.toLowerCase(); //Chuyển email về chữ thường
    }
    try {
        if (!req.user) {
            //Nếu chưa đăng nhập
            let user = await models.User.findOne({
                where: { email }
            });
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'Email does not exist!'));
            }
            //So sánh mật khẩu với mật khẩu đã mã hóa trong csdl
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, req.flash('loginMessage', 'Invalid password!.'));
            }
            return done(null, user); //Đăng nhập thành công
        }
        //Bỏ qua đăng nhập
        done(null, req.user);
    }
    catch (err) {
        done(err); //Có lỗi xảy ra
    }
}));

passport.use('local-register', new LocalStrategy({
    usernameField: 'email', //Tên đăng nhập là email
    passwordField: 'password',
    passReqToCallback: true, //Chuyển req vào callback
}, async (req, email, password, done) => {
    if (email) {
        email = email.toLowerCase(); //Chuyển email về chữ thường
    }
    try {
        if (!req.user) {
            //Nếu chưa đăng nhập
            let user = await models.User.findOne({
                where: { email }
            });
            if (user) {
                return done(null, false, req.flash('registerMessage', 'Email already exists!'));
            }
            user = await models.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                mobile: req.body.mobile,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)), //Mã hóa mật khẩu
            });
            done(null, false, req.flash('registerMessage', 'You have registered successfully. Please login!')); //Đăng ký thành công
        }
        //Bỏ qua đăng ký
        done(null, req.user);
    }
    catch (err) {
        done(err); //Có lỗi xảy ra
    }
}));

module.exports = passport;