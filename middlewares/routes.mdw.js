module.exports = function (app) {
    app.use('/category', require('../routes/product.route'));
    app.use('/admin/category', require('../routes/admin/category.route'));
    app.use('/account',require('../routes/account.route'));
    // app.use('/register',require('../routes/account.route'));
    // app.use('/login',require('../routes/account.route'));

};