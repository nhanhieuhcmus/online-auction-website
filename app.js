var express = require('express');
var exphbs  = require('express-handlebars');
 
var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/items', function (req, res) {
    res.render('items');
});
app.listen(3000,()=>{
    console.log('Web server running at sfhkfj');
})