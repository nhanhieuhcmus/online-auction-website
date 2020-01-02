var express = require('express');
var exphbs = require('express-handlebars');
const morgan = require('morgan');
const numeral = require('numeral');
const handlebars = require('./helpers/handlebars')(exphbs);
const productModel = require('./models/product.model');
const categoryModel = require('./models/category.model');
const offerModel = require('./models/offer.model');
const moment= require('moment');
const bodyparser=require('body-parser');
const bcrypt = require('bcryptjs');

var app = express();

const productRoute=require('./routes/product.route');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyparser.urlencoded({extended:true}))
var urlencodedParser = bodyparser.urlencoded({ extended: false })
app.use(morgan('dev'));

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('./public'));

app.get('/', async (req, res)=> {
    const category= await categoryModel.all();
    res.render('home', { title: 'Trang chủ',category });
});

app.get('/home', function (req, res) {
    res.render('home', { title: 'Trang chủ' });
});

app.get('/cart', function (req, res) {
    res.render('cart', { title: 'Giỏ hàng' });
});

app.get('/profile', function (req, res) {
    res.render('profile', { title: 'Thông tin cá nhân' });
});

app.get('/new-product', function (req, res) {
    res.render('newProduct', { title: 'Thông tin cá nhân' });
});
// app.post('/register',urlencodedParser,async(req,res)=>{
//     const N = 10;
//     const hash = bcrypt.hashSync(req.body.password, N);
//     const entity=req.body;
//     entity.password=hash;
//     res.send('email: '+req.body.email+'<br>'+'password:'+entity.password+'<br>');
// })
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
    console.log('Web server running at http://localhost:3000');
})