'use strict';
//Khai báo
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const express_handlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');
const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.connect().catch(console.error);
const passport = require('./controllers/passport');
const flash = require('connect-flash');

//Cấu hình public static folder
app.use(express.static(__dirname + '/public'));

//Cấu hình đọc dữ liệu post từ body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cấu hình session
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000 //20 phút
    }
}));

//Cấu hình passport
app.use(passport.initialize()); //Khởi tạo passport
app.use(passport.session()); //Sử dụng session để lưu thông tin người dùng

//Cấu hình sử dụng flash
app.use(flash()); //Sử dụng flash để lưu thông tin thông báo

//Middleware tạo giỏ hàng
app.use((req, res, next) => {
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity = req.session.cart.quantity;
    res.locals.isLoggedIn = req.isAuthenticated(); //Kiểm tra người dùng đã đăng nhập hay chưa
    next();
})

//Cấu hình express handlebars
app.engine('hbs', express_handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true //cho phép truy xuất property từ csdl
    },
    helpers: {
        createStarList,
        createPagination
    }
}));
app.set('view engine', 'hbs');

//Chuyển hướng sang Router
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productsRouter'));
app.use('/users', require('./routes/authRouter'));
app.use('/users', require('./routes/usersRouter'));


//Bắt lỗi
app.use((req, res, next) => {
    res.status(404).render('error', { message: 'File not found!' });
})

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error' });
})

//Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});


