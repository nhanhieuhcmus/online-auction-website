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
    res.render('items', {title: 'Product Page'});
});

app.get('/profile', function (req, res) {
    res.render('profile', {title: 'Profile'});
});

app.listen(3000,()=>{
    console.log('Web server running at sfhkfj');
})