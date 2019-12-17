const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const handlebars = require('./helpers/handlebars')(exphbs);

const app = express();

app.use(morgan('dev'));

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render('home.hbs', {title: 'Trang chủ'});
});

app.get('/home', function (req, res) {
    res.render('home.hbs', {title: 'Trang chủ'});
});

app.get('/cart', function (req, res) {
    res.render('cart.hbs', {title: 'Giỏ hàng'});
});

app.get('/items', function (req, res) {
    const list = [
        {BidId: 1, Time: '1/11/2019 10:43', Bidder: '****Khoa', Price: 6000000},
        {BidId: 2, Time: '1/11/2019 9:43', Bidder: '****Quang', Price: 5900000},
        {BidId: 3, Time: '1/11/2019 8:43', Bidder: '****Tuấn', Price: 5800000},
        {BidId: 4, Time: '1/11/2019 7:43', Bidder: '****Minh', Price: 5700000}
    ]

    res.render('items', {
        title: 'Chi tiết sản phẩm',
        categories: list
    });
});

app.get('/list-product', function (req, res) {
    res.render('listProduct.hbs', {title: 'Danh sách sản phẩm'});
});

app.get('/profile', function (req, res) {
    res.render('profile.hbs', {title: 'Thông tin cá nhân'});
});

app.get('/new-product', function (req, res) {
    res.render('newProduct.hbs', {title: 'Thông tin cá nhân'});
});

app.use(express.static('public'));
app.use('/admin/home', require('./routes/admin/category.route'));

app.listen(3000,()=>{
    console.log('Web server running at port [3000]..');
})