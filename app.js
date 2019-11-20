var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'))
 
app.get('/', function (req, res) {
    res.render('home', {title: 'Home Page'});
});

app.get('/items', function (req, res) {
    const list = [
        {BidId: 1, Time: '1/11/2019 10:43', Bidder: '****Khoa', Price: 6000000},
        {BidId: 2, Time: '1/11/2019 9:43', Bidder: '****Quang', Price: 5900000},
        {BidId: 3, Time: '1/11/2019 8:43', Bidder: '****Tuấn', Price: 5800000},
        {BidId: 4, Time: '1/11/2019 7:43', Bidder: '****Minh', Price: 5700000}
    ]

    res.render('items', {
        title: 'Product Page',
        categories: list
    });
});

app.get('/profile', function (req, res) {
    res.render('profile', {title: 'Profile'});
});

app.listen(3000,()=>{
    console.log('Web server running at sfhkfj');
})