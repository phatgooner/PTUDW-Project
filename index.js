'use strict';
//Khai báo
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const express_handlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');

//Cấu hình public static folder
app.use(express.static(__dirname + '/public'));

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


