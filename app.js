var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('home', {title: 'Trang chủ'});
});

app.get('/home', function (req, res) {
    res.render('home', {title: 'Trang chủ'});
});

app.get('/cart', function (req, res) {
    res.render('cart', {title: 'Giỏ hàng'});
});

app.get('/items', function (req, res) {
    res.render('items', {title: 'Chi tiết sản phẩm'});
});

app.get('/list-product', function (req, res) {
    res.render('listProduct', {title: 'Danh sách sản phẩm'});
});

app.get('/profile', function (req, res) {
    res.render('profile', {title: 'Thông tin cá nhân'});
});

app.get('/history-auction', function (req, res) {
    res.render('history_auction', {title: 'Thông tin cá nhân'});
});
app.listen(3000,()=>{
    console.log('Web server running at port [3000]..');
})