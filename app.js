var express = require('express');
var exphbs = require('express-handlebars');
const morgan = require('morgan');
const numeral = require('numeral');
const handlebars = require('./helpers/handlebars')(exphbs);
const productModel = require('./models/product.model');
const offerModel = require('./models/offer.model');
const moment= require('moment');
const bodyparser=require('body-parser')
var app = express();

const productRoute=require('./routes/product.route');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyparser.urlencoded({extended:true}))

app.use(morgan('dev'));

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('./public'));
app.use('/list-product',productRoute);

app.get('/', function (req, res) {
    res.render('home', { title: 'Trang chủ' });
});

app.get('/home', function (req, res) {
    res.render('home', { title: 'Trang chủ' });
});

app.get('/cart', function (req, res) {
    res.render('cart', { title: 'Giỏ hàng' });
});

app.get('/items', function (req, res) {
    const list = [
        { BidId: 1, Time: '1/11/2019 10:43', Bidder: '****Khoa', Price: 6000000 },
        { BidId: 2, Time: '1/11/2019 9:43', Bidder: '****Quang', Price: 5900000 },
        { BidId: 3, Time: '1/11/2019 8:43', Bidder: '****Tuấn', Price: 5800000 },
        { BidId: 4, Time: '1/11/2019 7:43', Bidder: '****Minh', Price: 5700000 }
    ]

    res.render('items', {
        title: 'Chi tiết sản phẩm',
        categories: list
    });
});

app.get('/profile', function (req, res) {
    res.render('profile', { title: 'Thông tin cá nhân' });
});

app.get('/new-product', function (req, res) {
    res.render('newProduct', { title: 'Thông tin cá nhân' });
});

require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.use((req, res, next) => {
    res.render('vwError/404.hbs', { title: 'Not Found' });
})

app.use((err, req, res, next) => {
    res.render('vwError/index.hbs', { title: 'Error' })
    console.error(err.stack);
    res.status(500).send('View error on console.');
})

app.listen(3000, () => {
    console.log('Web server running at port [3000]..');
})